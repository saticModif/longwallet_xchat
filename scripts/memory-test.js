#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class MemoryTest {
  constructor(options = {}) {
    this.options = {
      url: 'http://localhost:3000',
      outputDir: './memory-reports',
      iterations: 5,
      duration: 30000, // 30秒测试
      ...options
    };
    
    this.results = [];
  }

  async init() {
    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true });
    }

    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
  }

  async measureMemoryUsage(page) {
    const memoryInfo = await page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          timestamp: Date.now()
        };
      }
      return null;
    });

    return memoryInfo;
  }

  async runMemoryStressTest(page) {
    const memorySnapshots = [];
    
    // 初始内存快照
    memorySnapshots.push(await this.measureMemoryUsage(page));

    // 执行一些操作来测试内存使用
    const operations = [
      async () => {
        // 滚动操作
        for (let i = 0; i < 10; i++) {
          await page.evaluate(() => {
            window.scrollTo(0, Math.random() * 1000);
          });
          await page.waitForTimeout(100);
        }
      },
      async () => {
        // 点击操作
        for (let i = 0; i < 5; i++) {
          await page.click('body');
          await page.waitForTimeout(200);
        }
      },
      async () => {
        // 输入操作
        await page.type('body', 'test input for memory stress');
        await page.waitForTimeout(500);
      },
      async () => {
        // 创建大量DOM元素
        await page.evaluate(() => {
          const container = document.createElement('div');
          container.id = 'memory-test-container';
          for (let i = 0; i < 100; i++) {
            const div = document.createElement('div');
            div.textContent = `Memory test element ${i}`;
            div.style.cssText = 'padding: 10px; margin: 5px; border: 1px solid #ccc;';
            container.appendChild(div);
          }
          document.body.appendChild(container);
        });
        await page.waitForTimeout(1000);
      },
      async () => {
        // 清理测试元素
        await page.evaluate(() => {
          const container = document.getElementById('memory-test-container');
          if (container) {
            container.remove();
          }
        });
        await page.waitForTimeout(500);
      }
    ];

    // 执行操作并记录内存使用
    for (const operation of operations) {
      await operation();
      memorySnapshots.push(await this.measureMemoryUsage(page));
    }

    return memorySnapshots;
  }

  async runTest() {
    console.log('🧠 Starting memory usage test...');
    
    const page = await this.browser.newPage();
    
    try {
      // 导航到页面
      await page.goto(this.options.url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // 等待页面稳定
      await page.waitForTimeout(2000);

      // 运行内存压力测试
      const memorySnapshots = await this.runMemoryStressTest(page);

      // 分析内存使用趋势
      const analysis = this.analyzeMemoryUsage(memorySnapshots);

      const result = {
        url: this.options.url,
        memorySnapshots,
        analysis,
        timestamp: new Date().toISOString()
      };

      this.results.push(result);
      
      console.log('📊 Memory test completed');
      console.log('Memory Analysis:', JSON.stringify(analysis, null, 2));

    } catch (error) {
      console.error('❌ Memory test failed:', error);
      this.results.push({
        url: this.options.url,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      await page.close();
    }
  }

  analyzeMemoryUsage(snapshots) {
    if (snapshots.length < 2) {
      return { error: 'Insufficient data for analysis' };
    }

    const validSnapshots = snapshots.filter(s => s !== null);
    
    if (validSnapshots.length < 2) {
      return { error: 'No valid memory data available' };
    }

    const initialMemory = validSnapshots[0].usedJSHeapSize;
    const finalMemory = validSnapshots[validSnapshots.length - 1].usedJSHeapSize;
    const memoryGrowth = finalMemory - initialMemory;
    const memoryGrowthPercent = (memoryGrowth / initialMemory) * 100;

    // 计算内存使用趋势
    const memoryTrend = validSnapshots.map((snapshot, index) => ({
      step: index,
      usedJSHeapSize: snapshot.usedJSHeapSize,
      totalJSHeapSize: snapshot.totalJSHeapSize,
      jsHeapSizeLimit: snapshot.jsHeapSizeLimit
    }));

    // 检测内存泄漏
    const isMemoryLeak = memoryGrowthPercent > 10; // 如果内存增长超过10%，认为可能存在泄漏

    return {
      initialMemory: Math.round(initialMemory / 1024 / 1024 * 100) / 100, // MB
      finalMemory: Math.round(finalMemory / 1024 / 1024 * 100) / 100, // MB
      memoryGrowth: Math.round(memoryGrowth / 1024 / 1024 * 100) / 100, // MB
      memoryGrowthPercent: Math.round(memoryGrowthPercent * 100) / 100,
      isMemoryLeak,
      memoryTrend,
      recommendations: this.generateMemoryRecommendations(memoryGrowthPercent, finalMemory)
    };
  }

  generateMemoryRecommendations(growthPercent, finalMemory) {
    const recommendations = [];

    if (growthPercent > 20) {
      recommendations.push({
        type: 'critical',
        title: '严重内存泄漏',
        description: `内存使用增长了 ${growthPercent}%，可能存在严重的内存泄漏问题`,
        action: '检查事件监听器、定时器、闭包等可能导致内存泄漏的代码'
      });
    } else if (growthPercent > 10) {
      recommendations.push({
        type: 'warning',
        title: '潜在内存泄漏',
        description: `内存使用增长了 ${growthPercent}%，建议进一步调查`,
        action: '使用Chrome DevTools Memory面板进行详细分析'
      });
    }

    if (finalMemory > 100) { // 100MB
      recommendations.push({
        type: 'performance',
        title: '内存使用过高',
        description: `最终内存使用达到 ${Math.round(finalMemory)}MB，可能影响性能`,
        action: '优化组件渲染、减少不必要的状态更新、使用虚拟滚动等'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        title: '内存使用正常',
        description: '内存使用在合理范围内，没有发现明显问题',
        action: '继续保持当前的优化实践'
      });
    }

    return recommendations;
  }

  generateReport() {
    const report = {
      summary: this.generateSummary(),
      details: this.results,
      timestamp: new Date().toISOString()
    };

    const reportPath = path.join(
      this.options.outputDir, 
      `memory-report-${new Date().toISOString().split('T')[0]}.json`
    );

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // 生成HTML报告
    this.generateHTMLReport(report, reportPath);
    
    console.log(`📄 Memory report saved to: ${reportPath}`);
    return report;
  }

  generateSummary() {
    const successfulResults = this.results.filter(r => !r.error);
    
    if (successfulResults.length === 0) {
      return { error: 'No successful memory tests' };
    }

    const avgMemoryGrowth = successfulResults.reduce((sum, r) => 
      sum + r.analysis.memoryGrowthPercent, 0) / successfulResults.length;
    
    const avgFinalMemory = successfulResults.reduce((sum, r) => 
      sum + r.analysis.finalMemory, 0) / successfulResults.length;

    const memoryLeaks = successfulResults.filter(r => r.analysis.isMemoryLeak).length;

    return {
      totalTests: this.results.length,
      successfulTests: successfulResults.length,
      averageMemoryGrowth: Math.round(avgMemoryGrowth * 100) / 100,
      averageFinalMemory: Math.round(avgFinalMemory * 100) / 100,
      memoryLeaksDetected: memoryLeaks,
      memoryScore: this.calculateMemoryScore(avgMemoryGrowth, avgFinalMemory)
    };
  }

  calculateMemoryScore(growthPercent, finalMemory) {
    let score = 100;
    
    if (growthPercent > 20) score -= 40;
    else if (growthPercent > 10) score -= 20;
    else if (growthPercent > 5) score -= 10;
    
    if (finalMemory > 150) score -= 30;
    else if (finalMemory > 100) score -= 20;
    else if (finalMemory > 50) score -= 10;
    
    return Math.max(0, score);
  }

  generateHTMLReport(report, jsonPath) {
    const htmlPath = jsonPath.replace('.json', '.html');
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Memory Usage Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .metric { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
        .score { font-size: 24px; font-weight: bold; }
        .good { color: green; }
        .warning { color: orange; }
        .poor { color: red; }
        .chart { margin: 20px 0; padding: 20px; background: #f5f5f5; }
    </style>
</head>
<body>
    <h1>🧠 Memory Usage Report</h1>
    <div class="metric">
        <h2>Memory Score: <span class="score ${report.summary.memoryScore > 80 ? 'good' : report.summary.memoryScore > 60 ? 'warning' : 'poor'}">${report.summary.memoryScore}/100</span></h2>
    </div>
    <div class="metric">
        <h3>Summary</h3>
        <p>Average Memory Growth: ${report.summary.averageMemoryGrowth}%</p>
        <p>Average Final Memory: ${report.summary.averageFinalMemory}MB</p>
        <p>Memory Leaks Detected: ${report.summary.memoryLeaksDetected}</p>
    </div>
    <div class="metric">
        <h3>Recommendations</h3>
        ${report.details[0]?.analysis?.recommendations?.map(rec => `
            <div style="margin: 10px 0; padding: 10px; background: #f5f5f5;">
                <strong>${rec.title}</strong><br>
                ${rec.description}<br>
                <em>Action: ${rec.action}</em>
            </div>
        `).join('') || 'No recommendations available'}
    </div>
</body>
</html>`;

    fs.writeFileSync(htmlPath, html);
    console.log(`📄 HTML memory report saved to: ${htmlPath}`);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const options = {
    url: args[0] || 'http://localhost:3000',
    iterations: parseInt(args[1]) || 1
  };

  const memoryTest = new MemoryTest(options);
  
  try {
    await memoryTest.init();
    await memoryTest.runTest();
    const report = memoryTest.generateReport();
    
    console.log('\n📊 Memory Test Results:');
    console.log(JSON.stringify(report.summary, null, 2));
    
  } catch (error) {
    console.error('❌ Memory test failed:', error);
    process.exit(1);
  } finally {
    await memoryTest.cleanup();
  }
}

if (require.main === module) {
  main();
}

module.exports = MemoryTest; 