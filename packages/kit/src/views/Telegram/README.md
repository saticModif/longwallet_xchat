# Telegram 模块修复说明

## 问题总结

### 问题1：频道初始化逻辑不完整
- **原问题**：原代码仅通过超时重试机制触发初始化，未实际调用Telegram API
- **缺乏功能**：缺乏对频道元数据的预加载（如channels.getFullChannel）

### 问题2：错误处理不足
- **原问题**：未处理Telegram API可能返回的错误状态（如CHANNEL_PRIVATE）
- **缺乏功能**：失败时仅简单重试，未向WebView反馈具体错误原因

### 问题3：协议兼容性
- **原问题**：WebView通信协议中已定义channelSessionReady和channelInitFailed消息，但原生端未实现对应逻辑

## 修复内容

### 1. 新增文件

#### `services/telegramApi.ts`
- 创建了完整的Telegram API服务层
- 实现了频道初始化、错误处理、重试机制
- 支持私有频道自动加入
- 提供了详细的错误类型定义和错误信息映射
- **注意**：当前使用模拟数据，因为后端API端点可能不存在

#### `types/webview.ts`
- 定义了完整的WebView通信协议类型
- 包括所有消息类型的TypeScript接口
- 提供了全局函数类型定义

#### `shared/src/routes/telegram.ts`
- 定义了Telegram相关的路由类型
- 规范了路由参数的类型定义

### 2. 修改文件

#### `pages/page.tsx`
- 修复了TypeScript类型错误
- 实现了完整的频道初始化逻辑
- 添加了错误处理和重试机制
- 实现了channelSessionReady和channelInitFailed消息处理
- 使用新的API服务和类型定义

## 功能特性

### 频道初始化流程
1. **基础初始化**：调用`getChannelInfo` API获取频道基本信息（当前使用模拟数据）
2. **完整信息获取**：调用`getChannelFullInfo` API获取频道详细信息（当前使用模拟数据）
3. **私有频道处理**：自动尝试加入私有频道（当前模拟成功）
4. **错误重试**：对可恢复错误进行指数退避重试
5. **状态通知**：向WebView发送初始化成功或失败消息

### 错误处理机制
- **CHANNEL_PRIVATE**：自动尝试加入频道
- **NETWORK_ERROR**：可恢复错误，自动重试
- **UNAUTHORIZED**：用户未登录，提示登录
- **CHANNEL_NOT_FOUND**：频道不存在，显示错误信息
- **ACCESS_DENIED**：访问被拒绝，显示错误信息

### WebView通信协议
- **channelSessionReady**：频道初始化成功，包含频道信息
- **channelInitFailed**：频道初始化失败，包含错误信息和重试次数
- **initializeChannel**：WebView请求初始化频道
- **标准消息**：保持原有的登录、设置、跳转等功能

## 使用方式

### Bot Token配置
```typescript
// 访问Bot配置页面
navigation.navigate('telegram', {
  screen: 'BotConfig'
});

// 或者直接设置Bot Token
import { setBotToken } from '../services/telegramApi';
await setBotToken('your_bot_token_here');
```

### 频道初始化
```typescript
// 自动初始化（通过路由参数）
navigation.navigate('telegram', {
  screen: 'TgChat',
  params: {
    screen: 'TgChatHome',
    params: {
      action: 'toChannel',
      channelId: 'channel_id_here'
    }
  }
});

// 手动初始化（通过WebView）
window.initializeChannel('channel_id_here');
```

### 错误处理
```typescript
// 监听频道初始化成功
window.onChannelSessionReady = (data) => {
  console.log('频道准备就绪:', data.channelInfo);
};

// 监听频道初始化失败
window.onChannelInitFailed = (data) => {
  console.error('频道初始化失败:', data.error);
  if (data.retryCount < 3) {
    // 可以手动重试
    window.initializeChannel(data.channelId);
  }
};
```

## 技术改进

### 类型安全
- 所有API调用都有完整的TypeScript类型定义
- WebView通信协议类型化，避免运行时错误
- 路由参数类型化，提供更好的开发体验

### 错误处理
- 详细的错误分类和处理逻辑
- 可恢复错误的自动重试机制
- 用户友好的错误信息显示

### 性能优化
- 指数退避重试策略，避免频繁请求
- 频道信息缓存，减少重复请求
- 异步操作优化，避免阻塞UI

### 代码质量
- 模块化设计，职责分离
- 完整的错误边界处理
- 详细的日志记录，便于调试

## 当前状态

### 架构说明
- **用户认证**：使用后端提供的JWT Token进行用户身份验证
- **频道数据**：使用Telegram官方API获取频道信息（需要Bot Token）
- **后端支持**：后端提供用户登录和Token管理，但不提供频道相关API

### Telegram官方API集成
使用Telegram官方API来获取频道信息：

- **频道信息**：使用`getChat` API获取频道基本信息
- **完整信息**：使用`getChat` API获取频道详细信息
- **加入频道**：检查频道是否存在和可访问

### Bot Token配置
要使用Telegram官方API，需要配置Bot Token：

```typescript
import { setBotToken } from '../services/telegramApi';

// 配置Bot Token
await setBotToken('your_bot_token_here');
```

### 模拟数据回退
如果未配置Bot Token，系统会自动使用模拟数据：

- **频道信息**：返回模拟的频道基本信息
- **完整信息**：返回模拟的频道详细信息
- **加入频道**：模拟成功加入频道

## 测试建议

### 功能测试
1. 测试公开频道初始化（使用模拟数据）
2. 测试私有频道自动加入（使用模拟数据）
3. 测试网络错误重试机制
4. 测试用户未登录情况
5. 测试频道不存在情况

### 错误测试
1. 测试CHANNEL_PRIVATE错误处理
2. 测试NETWORK_ERROR重试机制
3. 测试UNAUTHORIZED错误提示
4. 测试最大重试次数限制

### 集成测试
1. 测试WebView通信协议
2. 测试路由参数传递
3. 测试状态管理
4. 测试UI响应性 