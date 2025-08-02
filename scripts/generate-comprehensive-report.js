#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class ComprehensiveReportGenerator {
  constructor() {
    this.artifactsDir = './artifacts';
    this.outputDir = './reports';
  }

  async generateReport() {
    console.log('📊 Generating comprehensive performance report...');

    // 确保输出目录存在
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // 收集所有测试结果
    const allResults = await this.collectAllResults();

    // 生成综合报告
    const report = this.generateComprehensiveReport(allResults);

    // 保存报告
    const reportPath = path.join(this.outputDir, 'comprehensive-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // 生成HTML报告
    const htmlPath = path.join(this.outputDir, 'comprehensive-report.html');
    fs.writeFileSync(htmlPath, this.generateHTMLReport(report));

    // 生成Markdown摘要
    const summaryPath = path.join(this.outputDir, 'summary.md');
    fs.writeFileSync(summaryPath, this.generateMarkdownSummary(report));

    console.log(`📄 Comprehensive report saved to: ${reportPath}`);
    console.log(`📄 HTML report saved to: ${htmlPath}`);
    console.log(`📄 Summary saved to: ${summaryPath}`);

    return report;
  }

  async collectAllResults() {
    const results = {
      performance: [],
      memory: [],
      lighthouse: [],
      bundle: [],
      accessibility: []
    };

    if (!fs.existsSync(this.artifactsDir)) {
      console.log('No artifacts directory found, skipping artifact collection');
      return results;
    }

    // 遍历artifacts目录
    const artifactDirs = fs.readdirSync(this.artifactsDir);
    
    for (const dir of artifactDirs) {
      const dirPath = path.join(this.artifactsDir, dir);
      const stats = fs.statSync(dirPath);
      
      if (stats.isDirectory()) {
        await this.collectResultsFromDirectory(dirPath, results);
      }
    }

    return results;
  }

  async collectResultsFromDirectory(dirPath, results) {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      
      if (file.endsWith('.json')) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(content);
          
          // 根据文件名和内容判断报告类型
          if (file.includes('performance') || file.includes('perf')) {
            results.performance.push(data);
          } else if (file.includes('memory')) {
            results.memory.push(data);
          } else if (file.includes('lighthouse')) {
            results.lighthouse.push(data);
          } else if (file.includes('bundle')) {
            results.bundle.push(data);
          } else if (file.includes('accessibility')) {
            results.accessibility.push(data);
          }
        } catch (error) {
          console.warn(`Warning: Could not parse ${filePath}:`, error.message);
        }
      }
    }
  }

  generateComprehensiveReport(allResults) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.generateOverallSummary(allResults),
      details: allResults,
      recommendations: this.generateComprehensiveRecommendations(allResults),
      trends: this.analyzeTrends(allResults),
      scores: this.calculateScores(allResults)
    };

    return report;
  }

  generateOverallSummary(allResults) {
    const summary = {
      totalTests: 0,
      successfulTests: 0,
      failedTests: 0,
      overallScore: 0,
      performanceScore: 0,
      memoryScore: 0,
      accessibilityScore: 0,
      bundleScore: 0
    };

    // 统计性能测试
    if (allResults.performance.length > 0) {
      const perfResults = allResults.performance.filter(r => r.summary && !r.summary.error);
      summary.totalTests += allResults.performance.length;
      summary.successfulTests += perfResults.length;
      summary.failedTests += allResults.performance.length - perfResults.length;
      
      if (perfResults.length > 0) {
        summary.performanceScore = Math.round(
          perfResults.reduce((sum, r) => sum + (r.summary.performanceScore || 0), 0) / perfResults.length
        );
      }
    }

    // 统计内存测试
    if (allResults.memory.length > 0) {
      const memResults = allResults.memory.filter(r => r.summary && !r.summary.error);
      summary.totalTests += allResults.memory.length;
      summary.successfulTests += memResults.length;
      summary.failedTests += allResults.memory.length - memResults.length;
      
      if (memResults.length > 0) {
        summary.memoryScore = Math.round(
          memResults.reduce((sum, r) => sum + (r.summary.memoryScore || 0), 0) / memResults.length
        );
      }
    }

    // 统计Lighthouse测试
    if (allResults.lighthouse.length > 0) {
      summary.totalTests += allResults.lighthouse.length;
      summary.successfulTests += allResults.lighthouse.length;
      
      const lighthouseScores = allResults.lighthouse.map(r => {
        if (r.lhr && r.lhr.categories) {
          return Object.values(r.lhr.categories).reduce((sum, cat) => sum + (cat.score || 0), 0) / Object.keys(r.lhr.categories).length;
        }
        return 0;
      });
      
      if (lighthouseScores.length > 0) {
        summary.accessibilityScore = Math.round(
          lighthouseScores.reduce((sum, score) => sum + score, 0) / lighthouseScores.length * 100
        );
      }
    }

    // 计算综合评分
    const scores = [
      summary.performanceScore,
      summary.memoryScore,
      summary.accessibilityScore,
      summary.bundleScore
    ].filter(score => score > 0);

    if (scores.length > 0) {
      summary.overallScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    }

    return summary;
  }

  generateComprehensiveRecommendations(allResults) {
    const recommendations = [];

    // 性能建议
    if (allResults.performance.length > 0) {
      const perfResults = allResults.performance.filter(r => r.summary && !r.summary.error);
      if (perfResults.length > 0) {
        const avgLoadTime = perfResults.reduce((sum, r) => sum + (r.summary.averageLoadTime || 0), 0) / perfResults.length;
        
        if (avgLoadTime > 3000) {
          recommendations.push({
            type: 'performance',
            priority: 'critical',
            title: '页面加载时间严重超时',
            description: `平均加载时间为 ${Math.round(avgLoadTime)}ms，严重影响用户体验`,
            action: '立即优化关键渲染路径，实施代码分割和懒加载'
          });
        } else if (avgLoadTime > 2000) {
          recommendations.push({
            type: 'performance',
            priority: 'high',
            title: '页面加载时间过长',
            description: `平均加载时间为 ${Math.round(avgLoadTime)}ms，需要优化`,
            action: '优化资源加载，减少阻塞资源'
          });
        }
      }
    }

    // 内存建议
    if (allResults.memory.length > 0) {
      const memResults = allResults.memory.filter(r => r.summary && !r.summary.error);
      if (memResults.length > 0) {
        const totalLeaks = memResults.reduce((sum, r) => sum + (r.summary.memoryLeaksDetected || 0), 0);
        
        if (totalLeaks > 0) {
          recommendations.push({
            type: 'memory',
            priority: 'critical',
            title: '检测到内存泄漏',
            description: `总共检测到 ${totalLeaks} 个内存泄漏问题`,
            action: '立即修复内存泄漏，使用Chrome DevTools进行详细分析'
          });
        }
      }
    }

    // Lighthouse建议
    if (allResults.lighthouse.length > 0) {
      const lighthouseResults = allResults.lighthouse;
      const avgScores = lighthouseResults.map(r => {
        if (r.lhr && r.lhr.categories) {
          return {
            performance: r.lhr.categories.performance?.score || 0,
            accessibility: r.lhr.categories.accessibility?.score || 0,
            bestPractices: r.lhr.categories['best-practices']?.score || 0,
            seo: r.lhr.categories.seo?.score || 0
          };
        }
        return null;
      }).filter(Boolean);

      if (avgScores.length > 0) {
        const avgPerformance = avgScores.reduce((sum, s) => sum + s.performance, 0) / avgScores.length;
        const avgAccessibility = avgScores.reduce((sum, s) => sum + s.accessibility, 0) / avgScores.length;

        if (avgPerformance < 0.7) {
          recommendations.push({
            type: 'lighthouse',
            priority: 'high',
            title: 'Lighthouse性能评分偏低',
            description: `性能评分为 ${Math.round(avgPerformance * 100)}/100`,
            action: '优化Core Web Vitals指标，改善用户体验'
          });
        }

        if (avgAccessibility < 0.8) {
          recommendations.push({
            type: 'accessibility',
            priority: 'medium',
            title: '可访问性需要改进',
            description: `可访问性评分为 ${Math.round(avgAccessibility * 100)}/100`,
            action: '改善键盘导航、屏幕阅读器支持、颜色对比度等'
          });
        }
      }
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        priority: 'low',
        title: '整体表现良好',
        description: '所有测试指标都在合理范围内',
        action: '继续保持当前的优化实践'
      });
    }

    return recommendations;
  }

  analyzeTrends(allResults) {
    const trends = {
      performance: 'stable',
      memory: 'stable',
      accessibility: 'stable'
    };

    // 这里可以添加趋势分析逻辑
    // 比如比较不同时间的测试结果

    return trends;
  }

  calculateScores(allResults) {
    const scores = {
      performance: 0,
      memory: 0,
      accessibility: 0,
      bundle: 0,
      overall: 0
    };

    // 计算各项评分
    if (allResults.performance.length > 0) {
      const perfResults = allResults.performance.filter(r => r.summary && !r.summary.error);
      if (perfResults.length > 0) {
        scores.performance = Math.round(
          perfResults.reduce((sum, r) => sum + (r.summary.performanceScore || 0), 0) / perfResults.length
        );
      }
    }

    if (allResults.memory.length > 0) {
      const memResults = allResults.memory.filter(r => r.summary && !r.summary.error);
      if (memResults.length > 0) {
        scores.memory = Math.round(
          memResults.reduce((sum, r) => sum + (r.summary.memoryScore || 0), 0) / memResults.length
        );
      }
    }

    // 计算综合评分
    const validScores = [scores.performance, scores.memory, scores.accessibility, scores.bundle]
      .filter(score => score > 0);
    
    if (validScores.length > 0) {
      scores.overall = Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length);
    }

    return scores;
  }

  generateHTMLReport(report) {
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprehensive Performance Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }
        .score {
            font-size: 3em;
            font-weight: bold;
            margin: 10px 0;
        }
        .content {
            padding: 30px;
        }
        .metric-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .metric-card {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            border-left: 4px solid #007bff;
        }
        .metric-card h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        .metric-value {
            font-size: 2em;
            font-weight: bold;
            color: #007bff;
        }
        .recommendations {
            margin: 30px 0;
        }
        .recommendation {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
        }
        .recommendation.critical {
            background: #f8d7da;
            border-color: #f5c6cb;
        }
        .recommendation.high {
            background: #fff3cd;
            border-color: #ffeaa7;
        }
        .recommendation.medium {
            background: #d1ecf1;
            border-color: #bee5eb;
        }
        .recommendation.low {
            background: #d4edda;
            border-color: #c3e6cb;
        }
        .timestamp {
            color: #666;
            font-size: 0.9em;
            text-align: center;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 前端性能综合报告</h1>
            <div class="score">${report.summary.overallScore}/100</div>
            <p>综合性能评分</p>
        </div>
        
        <div class="content">
            <div class="metric-grid">
                <div class="metric-card">
                    <h3>性能评分</h3>
                    <div class="metric-value">${report.scores.performance}/100</div>
                </div>
                <div class="metric-card">
                    <h3>内存评分</h3>
                    <div class="metric-value">${report.scores.memory}/100</div>
                </div>
                <div class="metric-card">
                    <h3>可访问性评分</h3>
                    <div class="metric-value">${report.scores.accessibility}/100</div>
                </div>
                <div class="metric-card">
                    <h3>测试统计</h3>
                    <div class="metric-value">${report.summary.successfulTests}/${report.summary.totalTests}</div>
                    <small>成功/总数</small>
                </div>
            </div>

            <div class="recommendations">
                <h2>📋 优化建议</h2>
                ${report.recommendations.map(rec => `
                    <div class="recommendation ${rec.priority}">
                        <h4>${rec.title}</h4>
                        <p>${rec.description}</p>
                        <strong>建议行动:</strong> ${rec.action}
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="timestamp">
            报告生成时间: ${new Date(report.timestamp).toLocaleString('zh-CN')}
        </div>
    </div>
</body>
</html>`;
  }

  generateMarkdownSummary(report) {
    const getScoreColor = (score) => {
      if (score >= 80) return '🟢';
      if (score >= 60) return '🟡';
      return '🔴';
    };

    return `# 🚀 前端性能综合报告

## 📊 综合评分: ${getScoreColor(report.summary.overallScore)} ${report.summary.overallScore}/100

**生成时间**: ${new Date(report.timestamp).toLocaleString('zh-CN')}
**测试统计**: ${report.summary.successfulTests}/${report.summary.totalTests} (成功/总数)

---

## 📈 详细评分

- **性能评分**: ${getScoreColor(report.scores.performance)} ${report.scores.performance}/100
- **内存评分**: ${getScoreColor(report.scores.memory)} ${report.scores.memory}/100
- **可访问性评分**: ${getScoreColor(report.scores.accessibility)} ${report.scores.accessibility}/100
- **包大小评分**: ${getScoreColor(report.scores.bundle)} ${report.scores.bundle}/100

---

## 📋 优化建议

${report.recommendations.map(rec => 
  `### ${rec.title} (${rec.priority.toUpperCase()})
  
  ${rec.description}
  
  **建议行动**: ${rec.action}
  
  ---`
).join('\n\n')}

---

*此报告由自动化性能测试系统生成*
`;
  }
}

async function main() {
  const generator = new ComprehensiveReportGenerator();
  
  try {
    const report = await generator.generateReport();
    console.log('\n✅ Comprehensive report generated successfully!');
    
    // 在CI环境中，如果综合评分过低，可以设置退出码
    if (process.env.CI && report.summary.overallScore < 60) {
      console.log('⚠️  Overall score is below threshold (60), but continuing...');
    }
    
  } catch (error) {
    console.error('❌ Failed to generate comprehensive report:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = ComprehensiveReportGenerator; 