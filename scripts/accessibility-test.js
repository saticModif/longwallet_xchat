#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class AccessibilityTest {
  constructor(options = {}) {
    this.options = {
      url: 'http://localhost:3000',
      outputDir: './test-results/accessibility',
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

  async runAccessibilityTest(page) {
    try {
      // 注入axe-core
      await page.addScriptTag({
        path: require.resolve('axe-core/axe.min.js')
      });

      // 运行可访问性测试
      const results = await page.evaluate(() => {
        return new Promise((resolve) => {
          axe.run((err, results) => {
            if (err) {
              resolve({ error: err.toString() });
            } else {
              resolve(results);
            }
          });
        });
      });

      return results;
    } catch (error) {
      console.error('Error running accessibility test:', error);
      return { error: error.message };
    }
  }

  async runTest() {
    console.log('♿ Starting accessibility test...');
    
    const page = await this.browser.newPage();
    
    try {
      // 设置视口
      await page.setViewport({ width: 1280, height: 720 });

      // 导航到页面
      console.log(`Navigating to ${this.options.url}...`);
      await page.goto(this.options.url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // 等待页面完全加载
      await page.waitForTimeout(2000);

      // 运行可访问性测试
      console.log('Running accessibility audit...');
      const results = await this.runAccessibilityTest(page);

      if (results.error) {
        throw new Error(results.error);
      }

      // 分析结果
      const analysis = this.analyzeResults(results);

      const result = {
        url: this.options.url,
        timestamp: new Date().toISOString(),
        results: results,
        analysis: analysis
      };

      this.results.push(result);
      
      console.log('📊 Accessibility test completed');
      console.log('Analysis:', JSON.stringify(analysis, null, 2));

    } catch (error) {
      console.error('❌ Accessibility test failed:', error);
      this.results.push({
        url: this.options.url,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      await page.close();
    }
  }

  analyzeResults(results) {
    const violations = results.violations || [];
    const passes = results.passes || [];
    const incomplete = results.incomplete || [];
    const inapplicable = results.inapplicable || [];

    const severityCounts = {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0
    };

    violations.forEach(violation => {
      const severity = violation.impact || 'moderate';
      severityCounts[severity]++;
    });

    const totalIssues = violations.length;
    const totalPasses = passes.length;
    const totalChecks = totalIssues + totalPasses;

    const accessibilityScore = totalChecks > 0 
      ? Math.round(((totalPasses / totalChecks) * 100))
      : 100;

    return {
      totalViolations: totalIssues,
      totalPasses: totalPasses,
      totalChecks: totalChecks,
      accessibilityScore: accessibilityScore,
      severityCounts: severityCounts,
      criticalIssues: violations.filter(v => v.impact === 'critical'),
      seriousIssues: violations.filter(v => v.impact === 'serious'),
      moderateIssues: violations.filter(v => v.impact === 'moderate'),
      minorIssues: violations.filter(v => v.impact === 'minor'),
      recommendations: this.generateRecommendations(violations, accessibilityScore)
    };
  }

  generateRecommendations(violations, score) {
    const recommendations = [];

    if (score < 70) {
      recommendations.push({
        type: 'critical',
        title: '可访问性评分过低',
        description: `可访问性评分为 ${score}/100，需要立即改进`,
        action: '优先修复严重和关键的可访问性问题'
      });
    } else if (score < 90) {
      recommendations.push({
        type: 'warning',
        title: '可访问性需要改进',
        description: `可访问性评分为 ${score}/100，建议进一步优化`,
        action: '修复剩余的可访问性问题'
      });
    }

    const criticalIssues = violations.filter(v => v.impact === 'critical');
    if (criticalIssues.length > 0) {
      recommendations.push({
        type: 'critical',
        title: '发现关键可访问性问题',
        description: `发现 ${criticalIssues.length} 个关键可访问性问题`,
        action: '立即修复这些关键问题，它们严重影响用户体验'
      });
    }

    const seriousIssues = violations.filter(v => v.impact === 'serious');
    if (seriousIssues.length > 0) {
      recommendations.push({
        type: 'high',
        title: '发现严重可访问性问题',
        description: `发现 ${seriousIssues.length} 个严重可访问性问题`,
        action: '优先修复这些严重问题'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        title: '可访问性表现良好',
        description: '没有发现严重的可访问性问题',
        action: '继续保持良好的可访问性实践'
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
      `accessibility-report-${new Date().toISOString().split('T')[0]}.json`
    );

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // 生成HTML报告
    this.generateHTMLReport(report, reportPath);
    
    console.log(`📄 Accessibility report saved to: ${reportPath}`);
    return report;
  }

  generateSummary() {
    const successfulResults = this.results.filter(r => !r.error);
    
    if (successfulResults.length === 0) {
      return { error: 'No successful accessibility tests' };
    }

    const avgScore = successfulResults.reduce((sum, r) => 
      sum + r.analysis.accessibilityScore, 0) / successfulResults.length;
    
    const totalViolations = successfulResults.reduce((sum, r) => 
      sum + r.analysis.totalViolations, 0);

    const totalCritical = successfulResults.reduce((sum, r) => 
      sum + r.analysis.severityCounts.critical, 0);

    return {
      totalTests: this.results.length,
      successfulTests: successfulResults.length,
      averageAccessibilityScore: Math.round(avgScore),
      totalViolations: totalViolations,
      totalCriticalIssues: totalCritical,
      accessibilityGrade: this.getAccessibilityGrade(avgScore)
    };
  }

  getAccessibilityGrade(score) {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  generateHTMLReport(report, jsonPath) {
    const htmlPath = jsonPath.replace('.json', '.html');
    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Report</title>
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
    <h1>♿ Accessibility Report</h1>
    <div class="metric">
        <h2>Accessibility Score: <span class="score ${report.summary.averageAccessibilityScore > 80 ? 'good' : report.summary.averageAccessibilityScore > 60 ? 'warning' : 'poor'}">${report.summary.averageAccessibilityScore}/100 (${report.summary.accessibilityGrade})</span></h2>
    </div>
    <div class="metric">
        <h3>Summary</h3>
        <p>Total Violations: ${report.summary.totalViolations}</p>
        <p>Critical Issues: ${report.summary.totalCriticalIssues}</p>
        <p>Grade: ${report.summary.accessibilityGrade}</p>
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
    console.log(`📄 HTML accessibility report saved to: ${htmlPath}`);
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
    url: args[0] || 'http://localhost:3000'
  };

  const accessibilityTest = new AccessibilityTest(options);
  
  try {
    await accessibilityTest.init();
    await accessibilityTest.runTest();
    const report = accessibilityTest.generateReport();
    
    console.log('\n📊 Accessibility Test Results:');
    console.log(JSON.stringify(report.summary, null, 2));
    
    // 如果有严重问题，设置退出码
    if (report.summary.totalCriticalIssues > 0) {
      console.log('⚠️  Critical accessibility issues found');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Accessibility test failed:', error);
    process.exit(1);
  } finally {
    await accessibilityTest.cleanup();
  }
}

if (require.main === module) {
  main();
}

module.exports = AccessibilityTest; 