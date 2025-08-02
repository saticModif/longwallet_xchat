#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Testing build process...');

// 检查必要的依赖是否存在
function checkDependencies() {
  console.log('📦 Checking dependencies...');
  
  try {
    // 检查cross-env是否可用
    execSync('cross-env --version', { stdio: 'pipe' });
    console.log('✅ cross-env is available');
  } catch (error) {
    console.log('❌ cross-env not found, installing...');
    try {
      execSync('npm install -g cross-env', { stdio: 'inherit' });
      console.log('✅ cross-env installed globally');
    } catch (installError) {
      console.log('❌ Failed to install cross-env globally');
      console.log('Trying local installation...');
      try {
        execSync('yarn add -D cross-env', { stdio: 'inherit' });
        console.log('✅ cross-env installed locally');
      } catch (localError) {
        console.error('❌ Failed to install cross-env');
        process.exit(1);
      }
    }
  }

  try {
    // 检查serve是否可用
    execSync('serve --version', { stdio: 'pipe' });
    console.log('✅ serve is available');
  } catch (error) {
    console.log('❌ serve not found, installing...');
    try {
      execSync('npm install -g serve', { stdio: 'inherit' });
      console.log('✅ serve installed globally');
    } catch (installError) {
      console.log('❌ Failed to install serve globally');
      console.log('Trying local installation...');
      try {
        execSync('yarn add -D serve', { stdio: 'inherit' });
        console.log('✅ serve installed locally');
      } catch (localError) {
        console.error('❌ Failed to install serve');
        process.exit(1);
      }
    }
  }
}

// 测试构建命令
function testBuildCommands() {
  console.log('\n🏗️  Testing build commands...');
  
  const commands = [
    {
      name: 'Web Build',
      command: 'yarn build:web',
      description: 'Building web application'
    },
    {
      name: 'Extension Build',
      command: 'yarn build:ext',
      description: 'Building extension'
    }
  ];

  for (const cmd of commands) {
    console.log(`\n📋 Testing: ${cmd.name}`);
    console.log(`Command: ${cmd.command}`);
    
    try {
      execSync(cmd.command, { 
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'production' }
      });
      console.log(`✅ ${cmd.name} completed successfully`);
    } catch (error) {
      console.error(`❌ ${cmd.name} failed`);
      console.error('Error:', error.message);
      
      // 尝试使用npx
      console.log('🔄 Trying with npx...');
      try {
        const npxCommand = cmd.command.replace('yarn build:', 'npx cross-env NODE_ENV=production yarn workspace @onekeyhq/');
        execSync(npxCommand, { stdio: 'inherit' });
        console.log(`✅ ${cmd.name} completed with npx`);
      } catch (npxError) {
        console.error(`❌ ${cmd.name} failed with npx too`);
        console.error('Npx Error:', npxError.message);
      }
    }
  }
}

// 检查构建输出
function checkBuildOutput() {
  console.log('\n📁 Checking build outputs...');
  
  const outputs = [
    {
      path: 'apps/web/web-build',
      name: 'Web Build Output'
    },
    {
      path: 'apps/ext/dist',
      name: 'Extension Build Output'
    }
  ];

  for (const output of outputs) {
    if (fs.existsSync(output.path)) {
      const files = fs.readdirSync(output.path);
      console.log(`✅ ${output.name}: ${files.length} files found`);
      
      // 检查关键文件
      const keyFiles = ['index.html', 'main.js', 'main.css'];
      for (const file of keyFiles) {
        if (fs.existsSync(path.join(output.path, file))) {
          console.log(`  ✅ ${file} exists`);
        } else {
          console.log(`  ⚠️  ${file} not found`);
        }
      }
    } else {
      console.log(`❌ ${output.name}: Directory not found`);
    }
  }
}

// 主函数
async function main() {
  try {
    checkDependencies();
    testBuildCommands();
    checkBuildOutput();
    
    console.log('\n🎉 Build test completed successfully!');
  } catch (error) {
    console.error('\n❌ Build test failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  checkDependencies,
  testBuildCommands,
  checkBuildOutput
}; 