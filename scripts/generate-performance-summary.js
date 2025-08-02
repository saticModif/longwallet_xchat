#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class PerformanceSummaryGenerator {
  constructor() {
    this.reportsDir = './performance-reports';
    this.outputDir = './reports';
  }

  async generateSummary() {
    console.log('📊 Generating performance summary...');

    // 确保输出目录存在
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // 收集所有性能报告
    const performanceReports = this.collectReports(this.reportsDir);
    const memoryReports = this.collectReports('./memory-reports');

    // 生成综合摘要
    const summary = this.generateComprehensiveSummary(performanceReports, memoryReports);

    // 保存摘要报告
    const summaryPath = path.join(this.outputDir, 'summary.md');
    fs.writeFileSync(summaryPath, this.generateMarkdownSummary(summary));

    // 保存JSON格式的详细报告
    const jsonPath = path.join(this.outputDir, 'detailed-summary.json');
    fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2));

    console.log(`📄 Summary saved to: ${summaryPath}`);
    console.log(`📄 Detailed report saved to: ${jsonPath}`);

    return summary;
  }

  collectReports(reportsDir) {
    const reports = [];
    
    if (!fs.existsSync(reportsDir)) {
      return reports;
    }

    const files = fs.readdirSync(reportsDir);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(reportsDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          const report = JSON.parse(content);
          reports.push({
            file,
            ...report
          });
        } catch (error) {
          console.warn(`Warning: Could not parse report ${file}:`, error.message);
        }
      }
    }

    return reports;
  }

  generateComprehensiveSummary(performanceReports, memoryReports) {
    const summary = {
      timestamp: new Date().toISOString(),
      totalReports: performanceReports.length + memoryReports.length,
      performance: this.analyzePerformanceReports(performanceReports),
      memory: this.analyzeMemoryReports(memoryReports),
      overallScore: 0,
      recommendations: []
    };

    // 计算综合评分
    const perfScore = summary.performance.averageScore || 0;
    const memScore = summary.memory.averageScore || 0;
    summary.overallScore = Math.round((perfScore + memScore) / 2);

    // 生成综合建议
    summary.recommendations = this.generateOverallRecommendations(summary);

    return summary;
  }

  analyzePerformanceReports(reports) {
    if (reports.length === 0) {
      return { error: 'No performance reports found' };
    }

    const successfulReports = reports.filter(r => r.summary && !r.summary.error);
    
    if (successfulReports.length === 0) {
      return { error: 'No successful performance reports' };
    }

    const avgLoadTime = successfulReports.reduce((sum, r) => 
      sum + (r.summary.averageLoadTime || 0), 0) / successfulReports.length;
    
    const avgDomContentLoaded = successfulReports.reduce((sum, r) => 
      sum + (r.summary.averageDomContentLoaded || 0), 0) / successfulReports.length;
    
    const avgFirstPaint = successfulReports.reduce((sum, r) => 
      sum + (r.summary.averageFirstPaint || 0), 0) / successfulReports.length;
    
    const avgPerformanceScore = successfulReports.reduce((sum, r) => 
      sum + (r.summary.performanceScore || 0), 0) / successfulReports.length;

    return {
      totalReports: reports.length,
      successfulReports: successfulReports.length,
      averageLoadTime: Math.round(avgLoadTime),
      averageDomContentLoaded: Math.round(avgDomContentLoaded),
      averageFirstPaint: Math.round(avgFirstPaint),
      averageScore: Math.round(avgPerformanceScore),
      bestScore: Math.max(...successfulReports.map(r => r.summary.performanceScore || 0)),
      worstScore: Math.min(...successfulReports.map(r => r.summary.performanceScore || 0))
    };
  }

  analyzeMemoryReports(reports) {
    if (reports.length === 0) {
      return { error: 'No memory reports found' };
    }

    const successfulReports = reports.filter(r => r.summary && !r.summary.error);
    
    if (successfulReports.length === 0) {
      return { error: 'No successful memory reports' };
    }

    const avgMemoryGrowth = successfulReports.reduce((sum, r) => 
      sum + (r.summary.averageMemoryGrowth || 0), 0) / successfulReports.length;
    
    const avgFinalMemory = successfulReports.reduce((sum, r) => 
      sum + (r.summary.averageFinalMemory || 0), 0) / successfulReports.length;
    
    const avgMemoryScore = successfulReports.reduce((sum, r) => 
      sum + (r.summary.memoryScore || 0), 0) / successfulReports.length;

    const memoryLeaks = successfulReports.reduce((sum, r) => 
      sum + (r.summary.memoryLeaksDetected || 0), 0);

    return {
      totalReports: reports.length,
      successfulReports: successfulReports.length,
      averageMemoryGrowth: Math.round(avgMemoryGrowth * 100) / 100,
      averageFinalMemory: Math.round(avgFinalMemory * 100) / 100,
      averageScore: Math.round(avgMemoryScore),
      memoryLeaksDetected: memoryLeaks,
      bestScore: Math.max(...successfulReports.map(r => r.summary.memoryScore || 0)),
      worstScore: Math.min(...successfulReports.map(r => r.summary.memoryScore || 0))
    };
  }

  generateOverallRecommendations(summary) {
    const recommendations = [];

    // 性能建议
    if (summary.performance.averageLoadTime > 2000) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        title: '页面加载时间过长',
        description: `平均加载时间为 ${summary.performance.averageLoadTime}ms，超过推荐值`,
        action: '优化资源加载，使用懒加载和代码分割'
      });
    }

    if (summary.performance.averageScore < 80) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        title: '性能评分偏低',
        description: `性能评分为 ${summary.performance.averageScore}/100，需要优化`,
        action: '检查并优化关键渲染路径，减少阻塞资源'
      });
    }

    // 内存建议
    if (summary.memory.averageMemoryGrowth > 10) {
      recommendations.push({
        type: 'memory',
        priority: 'high',
        title: '内存使用增长过快',
        description: `内存增长率为 ${summary.memory.averageMemoryGrowth}%，可能存在内存泄漏`,
        action: '检查事件监听器、定时器、闭包等可能导致内存泄漏的代码'
      });
    }

    if (summary.memory.memoryLeaksDetected > 0) {
      recommendations.push({
        type: 'memory',
        priority: 'critical',
        title: '检测到内存泄漏',
        description: `检测到 ${summary.memory.memoryLeaksDetected} 个内存泄漏问题`,
        action: '立即修复内存泄漏问题，使用Chrome DevTools Memory面板进行详细分析'
      });
    }

    if (summary.memory.averageFinalMemory > 100) {
      recommendations.push({
        type: 'memory',
        priority: 'medium',
        title: '内存使用过高',
        description: `最终内存使用达到 ${summary.memory.averageFinalMemory}MB`,
        action: '优化组件渲染、减少不必要的状态更新、使用虚拟滚动等'
      });
    }

    // 综合建议
    if (summary.overallScore < 70) {
      recommendations.push({
        type: 'overall',
        priority: 'high',
        title: '整体性能需要改进',
        description: `综合评分为 ${summary.overallScore}/100，建议全面优化`,
        action: '制定性能优化计划，优先解决高优先级问题'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        priority: 'low',
        title: '性能表现良好',
        description: '所有指标都在合理范围内',
        action: '继续保持当前的优化实践，定期监控性能指标'
      });
    }

    return recommendations;
  }

  generateMarkdownSummary(summary) {
    const getScoreColor = (score) => {
      if (score >= 80) return '🟢';
      if (score >= 60) return '🟡';
      return '🔴';
    };

    const getPriorityIcon = (priority) => {
      switch (priority) {
        case 'critical': return '🚨';
        case 'high': return '⚠️';
        case 'medium': return '📝';
        case 'low': return 'ℹ️';
        default: return '📋';
      }
    };

    return `# 🚀 Frontend Performance Summary

## 📊 Overall Score: ${getScoreColor(summary.overallScore)} ${summary.overallScore}/100

**测试时间**: ${new Date(summary.timestamp).toLocaleString('zh-CN')}
**总报告数**: ${summary.totalReports}

---

## 📈 Performance Metrics

${summary.performance.error ? 
  `❌ ${summary.performance.error}` : 
  `- **平均加载时间**: ${summary.performance.averageLoadTime}ms
- **DOM内容加载时间**: ${summary.performance.averageDomContentLoaded}ms
- **首次绘制时间**: ${summary.performance.averageFirstPaint}ms
- **性能评分**: ${getScoreColor(summary.performance.averageScore)} ${summary.performance.averageScore}/100
- **成功测试**: ${summary.performance.successfulReports}/${summary.performance.totalReports}`
}

---

## 🧠 Memory Usage

${summary.memory.error ? 
  `❌ ${summary.memory.error}` : 
  `- **平均内存增长率**: ${summary.memory.averageMemoryGrowth}%
- **平均最终内存**: ${summary.memory.averageFinalMemory}MB
- **内存评分**: ${getScoreColor(summary.memory.averageScore)} ${summary.memory.averageScore}/100
- **检测到的内存泄漏**: ${summary.memory.memoryLeaksDetected} 个
- **成功测试**: ${summary.memory.successfulReports}/${summary.memory.totalReports}`
}

---

## 📋 Recommendations

${summary.recommendations.map(rec => 
  `${getPriorityIcon(rec.priority)} **${rec.title}** (${rec.priority.toUpperCase()})
  
  ${rec.description}
  
  *建议行动: ${rec.action}*
  
  ---`
).join('\n\n')}

---

## 📊 Detailed Reports

- Performance Reports: \`performance-reports/\`
- Memory Reports: \`memory-reports/\`
- Detailed JSON: \`reports/detailed-summary.json\`

---

*此报告由自动化性能测试系统生成*
`;
  }
}

async function main() {
  const generator = new PerformanceSummaryGenerator();
  
  try {
    const summary = await generator.generateSummary();
    console.log('\n✅ Performance summary generated successfully!');
    
    // 在CI环境中，如果性能评分过低，可以设置退出码
    if (process.env.CI && summary.overallScore < 60) {
      console.log('⚠️  Performance score is below threshold (60), but continuing...');
    }
    
  } catch (error) {
    console.error('❌ Failed to generate performance summary:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = PerformanceSummaryGenerator; 