#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class PerformanceMonitor {
  constructor(options = {}) {
    this.options = {
      url: 'http://localhost:3000',
      outputDir: './performance-reports',
      iterations: 3,
      ...options
    };
    
    this.results = [];
  }

  async init() {
    // 创建输出目录
    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true });
    }

    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async measurePageLoad(url) {
    const page = await this.browser.newPage();
    
    // 启用性能监控
    await page.setCacheEnabled(false);
    
    // 监听性能指标
    const performanceMetrics = [];
    
    page.on('metrics', data => {
      performanceMetrics.push({
        timestamp: Date.now(),
        ...data.metrics
      });
    });

    // 监听控制台消息
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        timestamp: Date.now()
      });
    });

    // 监听网络请求
    const networkRequests = [];
    page.on('response', response => {
      networkRequests.push({
        url: response.url(),
        status: response.status(),
        size: response.headers()['content-length'],
        timestamp: Date.now()
      });
    });

    const startTime = Date.now();
    
    try {
      // 导航到页面
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // 等待页面完全加载
      await page.waitForTimeout(2000);

      // 收集性能指标
      const performance = await page.evaluate(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        const paintTiming = performance.getEntriesByType('paint');
        
        return {
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
          firstPaint: paintTiming.find(p => p.name === 'first-paint')?.startTime,
          firstContentfulPaint: paintTiming.find(p => p.name === 'first-contentful-paint')?.startTime,
          domSize: document.querySelectorAll('*').length,
          resourceCount: performance.getEntriesByType('resource').length
        };
      });

      // 测量内存使用
      const memoryInfo = await page.evaluate(() => {
        if (performance.memory) {
          return {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
          };
        }
        return null;
      });

      // 测量交互响应时间
      const interactionMetrics = await this.measureInteractions(page);

      const endTime = Date.now();
      
      return {
        url,
        loadTime: endTime - startTime,
        performance,
        memoryInfo,
        interactionMetrics,
        consoleMessages,
        networkRequests: networkRequests.slice(0, 10), // 只保留前10个请求
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`Error measuring page load for ${url}:`, error);
      return {
        url,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    } finally {
      await page.close();
    }
  }

  async measureInteractions(page) {
    const interactions = [];
    
    try {
      // 测试点击响应时间
      const clickStart = performance.now();
      await page.click('body');
      const clickEnd = performance.now();
      interactions.push({
        type: 'click',
        responseTime: clickEnd - clickStart
      });

      // 测试滚动性能
      const scrollStart = performance.now();
      await page.evaluate(() => {
        window.scrollTo(0, 100);
      });
      await page.waitForTimeout(100);
      const scrollEnd = performance.now();
      interactions.push({
        type: 'scroll',
        responseTime: scrollEnd - scrollStart
      });

      // 测试键盘输入响应
      const inputStart = performance.now();
      await page.type('body', 'test');
      const inputEnd = performance.now();
      interactions.push({
        type: 'input',
        responseTime: inputEnd - inputStart
      });

    } catch (error) {
      console.warn('Error measuring interactions:', error);
    }

    return interactions;
  }

  async runTests() {
    console.log('🚀 Starting performance monitoring...');
    
    for (let i = 0; i < this.options.iterations; i++) {
      console.log(`📊 Running test iteration ${i + 1}/${this.options.iterations}`);
      
      const result = await this.measurePageLoad(this.options.url);
      this.results.push(result);
      
      // 等待一段时间再进行下一次测试
      if (i < this.options.iterations - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  generateReport() {
    const report = {
      summary: this.generateSummary(),
      details: this.results,
      recommendations: this.generateRecommendations()
    };

    const reportPath = path.join(
      this.options.outputDir, 
      `performance-report-${new Date().toISOString().split('T')[0]}.json`
    );

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // 生成可读的HTML报告
    this.generateHTMLReport(report, reportPath);
    
    console.log(`📄 Performance report saved to: ${reportPath}`);
    return report;
  }

  generateSummary() {
    const successfulResults = this.results.filter(r => !r.error);
    
    if (successfulResults.length === 0) {
      return { error: 'No successful test runs' };
    }

    const avgLoadTime = successfulResults.reduce((sum, r) => sum + r.loadTime, 0) / successfulResults.length;
    const avgDomContentLoaded = successfulResults.reduce((sum, r) => sum + r.performance.domContentLoaded, 0) / successfulResults.length;
    const avgFirstPaint = successfulResults.reduce((sum, r) => sum + (r.performance.firstPaint || 0), 0) / successfulResults.length;

    return {
      totalTests: this.results.length,
      successfulTests: successfulResults.length,
      averageLoadTime: Math.round(avgLoadTime),
      averageDomContentLoaded: Math.round(avgDomContentLoaded),
      averageFirstPaint: Math.round(avgFirstPaint),
      performanceScore: this.calculatePerformanceScore(successfulResults)
    };
  }

  calculatePerformanceScore(results) {
    const avgLoadTime = results.reduce((sum, r) => sum + r.loadTime, 0) / results.length;
    const avgDomSize = results.reduce((sum, r) => sum + r.performance.domSize, 0) / results.length;
    
    // 简单的性能评分算法
    let score = 100;
    
    if (avgLoadTime > 3000) score -= 30;
    else if (avgLoadTime > 2000) score -= 20;
    else if (avgLoadTime > 1000) score -= 10;
    
    if (avgDomSize > 1000) score -= 20;
    else if (avgDomSize > 500) score -= 10;
    
    return Math.max(0, score);
  }

  generateRecommendations() {
    const summary = this.generateSummary();
    const recommendations = [];

    if (summary.averageLoadTime > 2000) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        title: '页面加载时间过长',
        description: '建议优化资源加载，使用懒加载和代码分割',
        action: 'Implement lazy loading and code splitting'
      });
    }

    if (summary.averageDomSize > 500) {
      recommendations.push({
        type: 'optimization',
        priority: 'medium',
        title: 'DOM元素过多',
        description: '建议减少不必要的DOM元素，优化组件结构',
        action: 'Optimize component structure and reduce DOM elements'
      });
    }

    return recommendations;
  }

  generateHTMLReport(report, jsonPath) {
    const htmlPath = jsonPath.replace('.json', '.html');
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Performance Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .metric { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
        .score { font-size: 24px; font-weight: bold; }
        .good { color: green; }
        .warning { color: orange; }
        .poor { color: red; }
    </style>
</head>
<body>
    <h1>🚀 Frontend Performance Report</h1>
    <div class="metric">
        <h2>Performance Score: <span class="score ${report.summary.performanceScore > 80 ? 'good' : report.summary.performanceScore > 60 ? 'warning' : 'poor'}">${report.summary.performanceScore}/100</span></h2>
    </div>
    <div class="metric">
        <h3>Summary</h3>
        <p>Average Load Time: ${report.summary.averageLoadTime}ms</p>
        <p>Average DOM Content Loaded: ${report.summary.averageDomContentLoaded}ms</p>
        <p>Average First Paint: ${report.summary.averageFirstPaint}ms</p>
    </div>
    <div class="metric">
        <h3>Recommendations</h3>
        ${report.recommendations.map(rec => `
            <div style="margin: 10px 0; padding: 10px; background: #f5f5f5;">
                <strong>${rec.title}</strong><br>
                ${rec.description}<br>
                <em>Action: ${rec.action}</em>
            </div>
        `).join('')}
    </div>
</body>
</html>`;

    fs.writeFileSync(htmlPath, html);
    console.log(`📄 HTML report saved to: ${htmlPath}`);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// 命令行接口
async function main() {
  const args = process.argv.slice(2);
  const options = {
    url: args[0] || 'http://localhost:3000',
    iterations: parseInt(args[1]) || 3
  };

  const monitor = new PerformanceMonitor(options);
  
  try {
    await monitor.init();
    await monitor.runTests();
    const report = monitor.generateReport();
    
    console.log('\n📊 Performance Test Results:');
    console.log(JSON.stringify(report.summary, null, 2));
    
  } catch (error) {
    console.error('❌ Performance monitoring failed:', error);
    process.exit(1);
  } finally {
    await monitor.cleanup();
  }
}

if (require.main === module) {
  main();
}

module.exports = PerformanceMonitor; 