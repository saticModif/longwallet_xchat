# 后端API接口需求

## 频道权限检查和会话建立

### 1. 检查频道权限接口

**接口地址：** `POST /communal/checkChannelPermission`

**请求参数：**
```json
{
  "channelId": "string"
}
```

**请求头：**
```
Authorization: {user_token}
Content-Type: application/json
```

**响应格式：**
```json
{
  "code": 200,
  "data": {
    "hasAccess": boolean,      // 是否有权限访问
    "needsSession": boolean,   // 是否需要建立会话
    "channelInfo": {           // 频道信息（可选）
      "id": "string",
      "title": "string",
      "username": "string",
      "isPublic": boolean
    }
  },
  "message": "success"
}
```

**错误响应：**
```json
{
  "code": 400,
  "message": "频道不存在"
}
```

### 2. 建立频道会话接口

**接口地址：** `POST /communal/establishSession`

**请求参数：**
```json
{
  "channelId": "string"
}
```

**请求头：**
```
Authorization: {user_token}
Content-Type: application/json
```

**响应格式：**
```json
{
  "code": 200,
  "data": {
    "success": boolean,
    "sessionId": "string"  // 会话ID（可选）
  },
  "message": "success"
}
```

**错误响应：**
```json
{
  "code": 403,
  "message": "无法建立会话，权限不足"
}
```

## 实现逻辑

### 1. 权限检查逻辑

```javascript
// 伪代码示例
async function checkChannelPermission(channelId, userToken) {
  // 1. 验证用户token
  const user = await validateToken(userToken);
  
  // 2. 检查用户是否已有该频道的会话
  const existingSession = await checkUserSession(user.id, channelId);
  
  if (existingSession) {
    return {
      hasAccess: true,
      needsSession: false
    };
  }
  
  // 3. 检查频道是否为公开频道
  const channelInfo = await getChannelInfo(channelId);
  
  if (channelInfo.isPublic) {
    return {
      hasAccess: true,
      needsSession: true
    };
  }
  
  // 4. 检查用户是否有权限访问私有频道
  const hasPermission = await checkPrivateChannelAccess(user.id, channelId);
  
  return {
    hasAccess: hasPermission,
    needsSession: hasPermission
  };
}
```

### 2. 会话建立逻辑

```javascript
// 伪代码示例
async function establishSession(channelId, userToken) {
  // 1. 验证用户token
  const user = await validateToken(userToken);
  
  // 2. 检查频道是否存在
  const channelInfo = await getChannelInfo(channelId);
  if (!channelInfo) {
    throw new Error('频道不存在');
  }
  
  // 3. 建立用户与频道的会话
  const session = await createUserChannelSession(user.id, channelId);
  
  // 4. 记录用户访问日志
  await logChannelAccess(user.id, channelId, 'establish_session');
  
  return {
    success: true,
    sessionId: session.id
  };
}
```

## 数据库设计

### 1. 用户频道会话表

```sql
CREATE TABLE user_channel_sessions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  channel_id VARCHAR(50) NOT NULL,
  session_status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_channel (user_id, channel_id)
);
```

### 2. 频道访问日志表

```sql
CREATE TABLE channel_access_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  channel_id VARCHAR(50) NOT NULL,
  action_type ENUM('check_permission', 'establish_session', 'access_channel') NOT NULL,
  result ENUM('success', 'failed') NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 注意事项

1. **安全性：** 确保用户只能访问有权限的频道
2. **性能：** 缓存频道信息和用户会话状态
3. **日志：** 记录所有访问操作，便于调试和监控
4. **错误处理：** 提供详细的错误信息
5. **并发处理：** 处理并发访问同一频道的情况

## 测试用例

### 1. 正常流程测试
- 用户访问已建立会话的频道
- 用户访问公开频道（需要建立会话）
- 用户访问私有频道（有权限）

### 2. 异常流程测试
- 用户访问不存在的频道
- 用户访问无权限的私有频道
- 网络错误情况
- Token失效情况 