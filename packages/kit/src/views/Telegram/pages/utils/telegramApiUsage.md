# Telegram API 使用指南

基于 Telegram Web A 源码分析，我们已经在 WebView 注入脚本中添加了 `window.TelegramAPI` 对象，提供了访问 Telegram 各种功能的接口。

## 可用的 API 方法

### 1. 用户相关 API

#### 获取当前用户信息
```javascript
// 在 WebView 中调用
try {
  const userInfo = await window.TelegramAPI.getCurrentUser();
  console.log('当前用户信息:', userInfo);
} catch (error) {
  console.error('获取用户信息失败:', error);
}
```

#### 更新用户资料
```javascript
try {
  const result = await window.TelegramAPI.updateProfile(
    'John',     // firstName
    'Doe',      // lastName
    'Hello World' // about
  );
  console.log('更新成功:', result);
} catch (error) {
  console.error('更新失败:', error);
}
```

### 2. 聊天/频道相关 API

#### 获取频道信息
```javascript
const channelId = '-1001234567890'; // 频道ID
try {
  const channelInfo = await window.TelegramAPI.getChannelInfo(channelId);
  console.log('频道信息:', channelInfo);
} catch (error) {
  console.error('获取频道信息失败:', error);
}
```

#### 加入频道
```javascript
const channelId = '-1001234567890';
try {
  const result = await window.TelegramAPI.joinChannel(channelId);
  console.log('加入频道成功:', result);
} catch (error) {
  console.error('加入频道失败:', error);
}
```

#### 离开频道
```javascript
const channelId = '-1001234567890';
try {
  const result = await window.TelegramAPI.leaveChannel(channelId);
  console.log('离开频道成功:', result);
} catch (error) {
  console.error('离开频道失败:', error);
}
```

#### 获取聊天信息
```javascript
const chatId = '123456789'; // 聊天ID
try {
  const chatInfo = await window.TelegramAPI.getChatInfo(chatId);
  console.log('聊天信息:', chatInfo);
} catch (error) {
  console.error('获取聊天信息失败:', error);
}
```

### 3. 消息相关 API

#### 发送消息
```javascript
const chatId = '123456789';
const message = 'Hello from WebView!';
try {
  const result = await window.TelegramAPI.sendMessage(chatId, message);
  console.log('发送消息成功:', result);
} catch (error) {
  console.error('发送消息失败:', error);
}
```

#### 获取消息历史
```javascript
const chatId = '123456789';
const limit = 50; // 获取消息数量
try {
  const messages = await window.TelegramAPI.getMessageHistory(chatId, limit);
  console.log('消息历史:', messages);
} catch (error) {
  console.error('获取消息历史失败:', error);
}
```

### 4. 对话和联系人 API

#### 获取对话列表
```javascript
const limit = 20; // 获取对话数量
try {
  const dialogs = await window.TelegramAPI.getDialogs(limit);
  console.log('对话列表:', dialogs);
} catch (error) {
  console.error('获取对话列表失败:', error);
}
```

#### 搜索用户
```javascript
const query = 'john'; // 搜索关键词
try {
  const users = await window.TelegramAPI.searchUsers(query);
  console.log('搜索结果:', users);
} catch (error) {
  console.error('搜索用户失败:', error);
}
```

#### 获取联系人列表
```javascript
try {
  const contacts = await window.TelegramAPI.getContacts();
  console.log('联系人列表:', contacts);
} catch (error) {
  console.error('获取联系人列表失败:', error);
}
```

### 5. 系统 API

#### 获取应用配置
```javascript
try {
  const config = await window.TelegramAPI.getAppConfig();
  console.log('应用配置:', config);
} catch (error) {
  console.error('获取应用配置失败:', error);
}
```

## 加入频道功能

### 自动加入频道（推荐）

当用户点击"加入频道"按钮时，系统会自动尝试以下方法：

1. **优先使用 Telegram API** - 如果 GramJS 可用，直接调用 API 加入频道
2. **UI 操作** - 查找并点击页面上的加入按钮
3. **链接操作** - 查找并点击加入链接

```javascript
// 在 WebView 中，点击加入频道按钮会自动触发
// 无需手动调用，系统会自动处理
```

### 手动调用加入频道

#### 直接使用 API 加入频道
```javascript
// 在 WebView 中
const channelId = '-1001234567890';
const success = await window.joinChannelDirectly(channelId);
if (success) {
  console.log('成功加入频道');
} else {
  console.log('加入频道失败');
}
```

#### 从 React Native 调用
```javascript
// 在 React Native 中
const channelId = '-1001234567890';
webViewRef.current?.injectJavaScript(`
  window.joinChannelDirectly('${channelId}');
`);
```

## 测试 API 功能

### 测试 Telegram API 是否可用
```javascript
// 在 WebView 中
const isAvailable = await window.testTelegramAPI();
if (isAvailable) {
  console.log('Telegram API 可用');
} else {
  console.log('Telegram API 不可用');
}
```

### 从 React Native 测试
```javascript
// 在 React Native 中
webViewRef.current?.injectJavaScript(`
  window.testTelegramAPI().then(result => {
    console.log('API测试结果:', result);
  });
`);
```

## 在 React Native 中调用 WebView API

### 通过 postMessage 调用
```javascript
// 在 React Native 中
const callTelegramAPI = (method, params) => {
  webViewRef.current?.postMessage(JSON.stringify({
    type: 'CALL_TELEGRAM_API',
    data: {
      method,
      params
    }
  }));
};

// 使用示例
callTelegramAPI('getCurrentUser', []);
callTelegramAPI('sendMessage', ['123456789', 'Hello!']);
```

### 通过 injectJavaScript 调用
```javascript
// 在 React Native 中
const channelId = '-1001234567890';

// 加入频道
webViewRef.current?.injectJavaScript(`
  window.TelegramAPI.joinChannel('${channelId}')
    .then(result => {
      console.log('加入频道成功:', result);
    })
    .catch(error => {
      console.error('加入频道失败:', error);
    });
`);

// 获取用户信息
webViewRef.current?.injectJavaScript(`
  window.TelegramAPI.getCurrentUser()
    .then(user => {
      console.log('用户信息:', user);
    })
    .catch(error => {
      console.error('获取用户信息失败:', error);
    });
`);
```

### 在 WebView 中处理 API 调用
```javascript
// 在 webviewScripts.ts 中添加处理逻辑
document.addEventListener('message', function(event) {
  const data = JSON.parse(event.data);
  
  if (data?.type === 'CALL_TELEGRAM_API') {
    const { method, params } = data.data;
    
    // 调用对应的 API 方法
    if (window.TelegramAPI[method]) {
      window.TelegramAPI[method](...params)
        .then(result => {
          // 返回结果给 React Native
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'TELEGRAM_API_RESULT',
            data: {
              method,
              success: true,
              result
            }
          }));
        })
        .catch(error => {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'TELEGRAM_API_RESULT',
            data: {
              method,
              success: false,
              error: error.message
            }
          }));
        });
    }
  }
});
```

## 错误处理

所有 API 方法都包含错误处理，当 GramJS 不可用或 API 调用失败时会抛出异常：

```javascript
// 检查 GramJS 是否可用
if (window.TelegramAPI.isGramJSAvailable()) {
  // 可以安全调用 API
  const userInfo = await window.TelegramAPI.getCurrentUser();
} else {
  console.log('GramJS 不可用，请确保已登录 Telegram');
}
```

## 加入频道结果处理

当加入频道操作完成时，会返回详细的结果信息：

```javascript
// 在 React Native 中处理加入频道结果
const handleJoinChannelResult = (result) => {
  const { channelId, success, error, method } = result;
  
  if (success) {
    console.log(`通过${method}方法成功加入频道:`, channelId);
    // 处理成功逻辑
  } else {
    console.error(`通过${method}方法加入频道失败:`, error);
    // 处理失败逻辑
  }
};
```

## 注意事项

1. **权限检查**: 某些 API 需要特定的权限，确保用户已登录并具有相应权限
2. **速率限制**: Telegram API 有速率限制，避免过于频繁的调用
3. **错误处理**: 始终使用 try-catch 包装 API 调用
4. **异步操作**: 所有 API 方法都是异步的，需要使用 await 或 .then()
5. **GramJS 可用性**: 在调用 API 前检查 GramJS 是否可用

## 更多 API 方法

Telegram Web A 基于 GramJS，支持所有 Telegram API 方法。您可以参考 [GramJS 文档](https://gram.js.org/) 了解更多可用的 API 方法。

常用的其他 API 包括：
- 文件上传/下载
- 媒体消息处理
- 群组管理
- 频道管理
- 通知设置
- 隐私设置

通过 `window.invoke(new window.GramJs.xxx.xxx())` 的方式可以调用任何 GramJS 支持的 API。 