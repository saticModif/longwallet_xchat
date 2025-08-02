# Telegram API 实际获取指南

## 当前状态分析

从日志可以看出，我们已经找到了 `webpackChunktelegram_t`，这是Telegram Web A的webpack chunk。现在需要深入分析这个chunk来获取真正的API。

## 在WebView控制台中执行以下命令

### 1. 分析webpack chunk结构

```javascript
// 分析webpack chunk的详细结构
window.analyzeWebpackChunk();
```

### 2. 深入探索webpack chunk

```javascript
// 手动分析webpackChunktelegram_t
const chunk = window.webpackChunktelegram_t;
console.log('Chunk类型:', typeof chunk);
console.log('Chunk长度:', Array.isArray(chunk) ? chunk.length : '不是数组');

if (Array.isArray(chunk)) {
  chunk.forEach((moduleArray, index) => {
    console.log(`模块数组 [${index}]:`, moduleArray);
    
    if (Array.isArray(moduleArray)) {
      moduleArray.forEach((module, moduleIndex) => {
        if (module && typeof module === 'object') {
          console.log(`模块 [${index}][${moduleIndex}] 键:`, Object.keys(module));
          
          // 查找包含API的对象
          Object.entries(module).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
              if (key.toLowerCase().includes('api') || 
                  key.toLowerCase().includes('client') ||
                  key.toLowerCase().includes('gram') ||
                  key.toLowerCase().includes('telegram')) {
                console.log(`发现API对象 [${index}][${moduleIndex}].${key}:`, value);
                console.log(`API对象方法:`, Object.getOwnPropertyNames(value));
              }
            }
          });
        }
      });
    }
  });
}
```

### 3. 查找特定的API对象

```javascript
// 查找可能的API对象
function findAPIInChunk() {
  const chunk = window.webpackChunktelegram_t;
  const foundAPIs = [];
  
  if (Array.isArray(chunk)) {
    chunk.forEach((moduleArray, index) => {
      if (Array.isArray(moduleArray)) {
        moduleArray.forEach((module, moduleIndex) => {
          if (module && typeof module === 'object') {
            Object.entries(module).forEach(([key, value]) => {
              if (typeof value === 'object' && value !== null) {
                // 检查是否是API对象
                if (key.toLowerCase().includes('api') || 
                    key.toLowerCase().includes('client') ||
                    key.toLowerCase().includes('gram') ||
                    key.toLowerCase().includes('telegram')) {
                  
                  // 检查是否有API方法
                  const methods = Object.getOwnPropertyNames(value);
                  const apiMethods = methods.filter(method => 
                    method.toLowerCase().includes('join') ||
                    method.toLowerCase().includes('send') ||
                    method.toLowerCase().includes('get') ||
                    method.toLowerCase().includes('user') ||
                    method.toLowerCase().includes('channel')
                  );
                  
                  if (apiMethods.length > 0) {
                    foundAPIs.push({
                      path: `[${index}][${moduleIndex}].${key}`,
                      object: value,
                      methods: apiMethods
                    });
                  }
                }
              }
            });
          }
        });
      }
    });
  }
  
  return foundAPIs;
}

const apis = findAPIInChunk();
console.log('找到的API对象:', apis);
```

### 4. 尝试调用找到的API

```javascript
// 如果找到了API对象，尝试调用
const apis = findAPIInChunk();
if (apis.length > 0) {
  const api = apis[0].object;
  console.log('尝试调用API:', api);
  
  // 尝试调用可能的方法
  const testMethods = ['getCurrentUser', 'getUser', 'getMe', 'getProfile'];
  testMethods.forEach(method => {
    if (typeof api[method] === 'function') {
      console.log(`尝试调用 ${method}...`);
      try {
        api[method]().then(result => {
          console.log(`${method} 调用成功:`, result);
        }).catch(error => {
          console.log(`${method} 调用失败:`, error);
        });
      } catch (e) {
        console.log(`${method} 调用异常:`, e);
      }
    }
  });
}
```

### 5. 监听API调用

```javascript
// 监听可能的API调用
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('拦截到fetch调用:', args);
  return originalFetch.apply(this, args);
};

const originalXHROpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(...args) {
  console.log('拦截到XHR调用:', args);
  return originalXHROpen.apply(this, args);
};

// 监听postMessage
const originalPostMessage = window.postMessage;
window.postMessage = function(...args) {
  console.log('拦截到postMessage调用:', args);
  return originalPostMessage.apply(this, args);
};
```

### 6. 查找React组件中的API

```javascript
// 查找React组件中的API
function findAPIInReact() {
  const reactElements = document.querySelectorAll('[data-testid], [class*="react"], [id*="react"]');
  const foundAPIs = [];
  
  reactElements.forEach(element => {
    if (element._reactInternalFiber) {
      const fiber = element._reactInternalFiber;
      
      // 检查props
      if (fiber.memoizedProps) {
        Object.entries(fiber.memoizedProps).forEach(([key, value]) => {
          if (key.toLowerCase().includes('api') || key.toLowerCase().includes('client')) {
            foundAPIs.push({
              element: element,
              prop: key,
              value: value
            });
          }
        });
      }
      
      // 检查state
      if (fiber.memoizedState) {
        Object.entries(fiber.memoizedState).forEach(([key, value]) => {
          if (key.toLowerCase().includes('api') || key.toLowerCase().includes('client')) {
            foundAPIs.push({
              element: element,
              state: key,
              value: value
            });
          }
        });
      }
    }
  });
  
  return foundAPIs;
}

const reactAPIs = findAPIInReact();
console.log('React组件中的API:', reactAPIs);
```

## 实际使用步骤

1. **打开WebView控制台**
2. **执行分析命令**：
   ```javascript
   window.analyzeWebpackChunk();
   ```
3. **查找API对象**：
   ```javascript
   const apis = findAPIInChunk();
   console.log('找到的API:', apis);
   ```
4. **测试API调用**：
   ```javascript
   if (apis.length > 0) {
     const api = apis[0].object;
     // 尝试调用API方法
   }
   ```

## 关键要点

- **webpackChunktelegram_t** 是Telegram Web A的核心，包含所有API
- 需要深入分析这个chunk的结构
- API可能在不同的模块中
- 需要找到正确的方法名来调用API

通过这个指南，您应该能够找到并调用真正的Telegram API。 