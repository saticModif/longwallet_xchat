#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 Fixing build issues...');

// 检查并安装必要的依赖
function installDependencies() {
  console.log('📦 Installing dependencies...');
  
  const dependencies = [
    { name: 'cross-env', global: true },
    { name: 'serve', global: true },
    { name: 'puppeteer', local: true },
    { name: 'lighthouse', local: true },
    { name: 'axe-core', local: true }
  ];

  for (const dep of dependencies) {
    try {
      if (dep.global) {
        console.log(`Installing ${dep.name} globally...`);
        execSync(`npm install -g ${dep.name}`, { stdio: 'inherit' });
        console.log(`✅ ${dep.name} installed globally`);
      }
      
      if (dep.local) {
        console.log(`Installing ${dep.name} locally...`);
        execSync(`yarn add -D ${dep.name}`, { stdio: 'inherit' });
        console.log(`✅ ${dep.name} installed locally`);
      }
    } catch (error) {
      console.log(`⚠️  Failed to install ${dep.name}:`, error.message);
    }
  }
}

// 清理缓存
function cleanCache() {
  console.log('🧹 Cleaning cache...');
  
  try {
    execSync('yarn clean:cache', { stdio: 'inherit' });
    console.log('✅ Cache cleaned');
  } catch (error) {
    console.log('⚠️  Cache clean failed:', error.message);
  }
}

// 重新安装依赖
function reinstallDependencies() {
  console.log('🔄 Reinstalling dependencies...');
  
  try {
    execSync('yarn install --frozen-lockfile', { stdio: 'inherit' });
    console.log('✅ Dependencies reinstalled');
  } catch (error) {
    console.log('❌ Failed to reinstall dependencies:', error.message);
  }
}

// 测试构建
function testBuild() {
  console.log('🏗️  Testing build...');
  
  try {
    execSync('yarn test:build', { stdio: 'inherit' });
    console.log('✅ Build test passed');
  } catch (error) {
    console.log('❌ Build test failed:', error.message);
  }
}

// 检查系统依赖
function checkSystemDependencies() {
  console.log('🔍 Checking system dependencies...');
  
  const systemDeps = [
    'libgbm-dev',
    'libxss1',
    'libnss3',
    'libatk-bridge2.0-0',
    'libgtk-3-0',
    'libxshmfence1'
  ];

  for (const dep of systemDeps) {
    try {
      execSync(`dpkg -l | grep ${dep}`, { stdio: 'pipe' });
      console.log(`✅ ${dep} is installed`);
    } catch (error) {
      console.log(`⚠️  ${dep} not found`);
    }
  }
}

// 主函数
async function main() {
  console.log('🚀 Starting build issue fix...\n');
  
  try {
    installDependencies();
    console.log('');
    
    cleanCache();
    console.log('');
    
    reinstallDependencies();
    console.log('');
    
    checkSystemDependencies();
    console.log('');
    
    testBuild();
    console.log('');
    
    // 测试服务器启动
    console.log('🌐 Testing server startup...');
    try {
      execSync('yarn build:web', { stdio: 'inherit' });
      console.log('✅ Web build completed');
      
      // 测试服务器启动
      execSync('npx serve -s apps/web/web-build -l 3000 > server.log 2>&1 &', { stdio: 'inherit' });
      console.log('✅ Server started');
      
      // 等待服务器启动
      setTimeout(() => {
        try {
          execSync('curl -s http://localhost:3000 > /dev/null', { stdio: 'pipe' });
          console.log('✅ Server is responding');
        } catch (error) {
          console.log('⚠️  Server not responding yet');
        }
      }, 5000);
      
    } catch (error) {
      console.log('❌ Server test failed:', error.message);
    }
    
    console.log('🎉 Build issue fix completed!');
    console.log('\nNext steps:');
    console.log('1. Try running: yarn build:web');
    console.log('2. Test server: npx serve -s apps/web/web-build -l 3000');
    console.log('3. Run tests: yarn test:accessibility');
    console.log('4. For CI/CD issues, ensure all dependencies are properly installed');
    
  } catch (error) {
    console.error('❌ Build issue fix failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  installDependencies,
  cleanCache,
  reinstallDependencies,
  testBuild,
  checkSystemDependencies
}; 