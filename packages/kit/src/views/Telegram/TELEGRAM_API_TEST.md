# Telegram API 测试说明

## 测试步骤

### 1. 配置Bot Token
**方法一：快速配置（测试用）**
1. 在应用主页面点击"快速配置Bot Token"按钮
2. 系统会自动配置一个测试Token

**方法二：手动配置**
1. 在Telegram中搜索 @BotFather
2. 发送 `/newbot` 命令
3. 按照提示设置Bot名称和用户名
4. 复制获得的Bot Token
5. 访问 `/BotConfig` 页面
6. 输入Bot Token并保存

### 3. 测试频道初始化
1. 点击任意频道
2. 观察控制台日志，应该看到：
   - "使用Telegram官方API获取频道信息"
   - "Telegram API响应状态: 200"
   - "频道会话准备就绪"

## 预期结果

### 成功情况
```
开始初始化频道: {channelId: "-1002581211950"}
使用Token初始化频道: 1234567890...
使用Telegram官方API获取频道信息
Telegram API响应状态: 200
Telegram API成功响应: {ok: true, result: {...}}
频道会话准备就绪: {channelId: "-1002581211950", channelInfo: {...}}
```

### 失败情况（Bot Token未配置）
```
开始初始化频道: {channelId: "-1002581211950"}
使用Token初始化频道: 1234567890...
Bot token未配置，使用模拟数据
频道会话准备就绪: {channelId: "-1002581211950", channelInfo: {...}}
```

### 失败情况（频道不存在）
```
开始初始化频道: {channelId: "invalid_channel"}
使用Token初始化频道: 1234567890...
使用Telegram官方API获取频道信息
Telegram API响应状态: 400
Telegram API错误: {ok: false, error_code: 400, description: "Bad Request: chat not found"}
频道初始化失败: 频道不存在或无法访问
```

## 常见问题

### 1. Bot Token无效
- 检查Token格式是否正确
- 确认Token是否从 @BotFather 获取
- 检查Token是否被撤销

### 2. 频道无法访问
- Bot需要被添加到频道中
- 私有频道需要Bot有访问权限
- 检查频道ID是否正确

### 3. 网络错误
- 检查网络连接
- 确认可以访问 api.telegram.org
- 检查防火墙设置

## 调试信息

### 控制台日志
所有API调用都会在控制台输出详细日志，包括：
- 请求参数
- 响应状态
- 错误信息
- 成功数据

### 错误代码
- `400`: 频道不存在或无法访问
- `401`: Bot Token无效
- `403`: Bot没有权限访问频道
- `429`: 请求频率过高
- `500`: 服务器错误

## 性能优化

### 缓存机制
- 频道信息会被缓存，避免重复请求
- 缓存时间：5分钟
- 可以通过清除缓存强制刷新

### 重试机制
- 网络错误自动重试
- 指数退避策略
- 最大重试次数：3次

## 安全注意事项

### Bot Token安全
- Bot Token是敏感信息
- 不要在代码中硬编码
- 使用安全的存储方式
- 定期更换Token

### 权限控制
- Bot只能访问被添加的频道
- 私有频道需要特殊权限
- 注意API调用频率限制 