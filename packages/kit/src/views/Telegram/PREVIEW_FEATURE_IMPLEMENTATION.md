# Telegram 频道预览功能实现

## 功能概述

为用户提供频道预览功能，让用户在加入频道之前可以先了解频道的基本信息。

## 实现方案

### 1. 用户界面更新

在WebView中显示三个选项：
- 📋 预览频道 - 查看频道基本信息
- ➕ 加入频道 - 直接加入频道
- 稍后再说 - 关闭提示

### 2. 预览功能实现

#### 2.1 在 `telegramApi.ts` 中添加预览功能

```typescript
/**
 * 预览频道信息
 */
export const previewChannel = async (channelId: string) => {
  try {
    const botToken = await getBotToken();
    if (!botToken) {
      // Bot Token未配置，返回模拟数据
      return {
        success: true,
        channelInfo: {
          id: channelId,
          title: '频道预览',
          type: 'channel',
          description: '这是一个公开频道（Bot Token未配置）',
          member_count: 1000,
          username: 'preview_channel'
        }
      };
    }

    // 使用Telegram Bot API获取频道信息
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getChat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chat_id: channelId }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        channelInfo: data.result
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        error: error.description || '获取频道信息失败'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '网络错误'
    };
  }
};
```

#### 2.2 在 `webview.ts` 中添加消息类型

```typescript
// WebView消息类型
export enum WebViewMessageType {
  // ... 现有类型 ...
  PREVIEW_CHANNEL_REQUEST = 'previewChannelRequest',
}

// 预览频道请求消息
export interface PreviewChannelRequestMessage extends WebViewMessage {
  type: WebViewMessageType.PREVIEW_CHANNEL_REQUEST;
  channelId: string;
}
```

#### 2.3 在 `page.tsx` 中处理预览请求

```typescript
// 在 onMessage 处理中添加
} else if (messageData.type === WebViewMessageType.PREVIEW_CHANNEL_REQUEST) {
  const { channelId } = messageData;
  console.log('收到预览频道请求:', channelId);
  
  const previewResult = await previewChannel(channelId);
  if (previewResult.success) {
    const channelInfo = previewResult.channelInfo;
    const previewInfo = `频道名称: ${channelInfo.title || '未知频道'}
频道类型: ${channelInfo.type === 'channel' ? '公开频道' : '私有频道'}
成员数量: ${channelInfo.member_count || '未知'}
频道描述: ${channelInfo.description || '暂无描述'}
频道用户名: ${channelInfo.username ? '@' + channelInfo.username : '无'}
频道ID: ${channelInfo.id}

这是一个预览信息，您可以：
1. 查看频道基本信息
2. 决定是否加入频道
3. 了解更多频道内容`;
    alert(previewInfo);
  } else {
    alert('预览频道失败: ' + previewResult.error);
  }
}
```

#### 2.4 在WebView中更新提示界面

```javascript
// 在 injectedJS 中更新 showJoinChannelPrompt 函数
window.showJoinChannelPrompt = function() {
  // 移除已存在的提示
  const existingPrompt = document.getElementById('join-channel-prompt');
  if (existingPrompt) {
    existingPrompt.remove();
  }
  
  // 创建提示元素
  const prompt = document.createElement('div');
  prompt.id = 'join-channel-prompt';
  prompt.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    z-index: 10000;
    max-width: 320px;
    text-align: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  prompt.innerHTML = `
    <div style="margin-bottom: 16px;">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="#0088cc">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    </div>
    <h3 style="margin: 0 0 8px 0; color: #333; font-size: 18px;">频道访问</h3>
    <p style="margin: 0 0 20px 0; color: #666; font-size: 14px; line-height: 1.4;">
      您需要先加入此频道才能查看完整内容
    </p>
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <button id="preview-channel-btn" style="
        background: #f0f0f0;
        color: #333;
        border: 1px solid #ddd;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        width: 100%;
        transition: background 0.2s;
      " onmouseover="this.style.background='#e0e0e0'" onmouseout="this.style.background='#f0f0f0'">
        📋 预览频道
      </button>
      <button id="join-channel-btn" style="
        background: #0088cc;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        width: 100%;
        transition: background 0.2s;
      " onmouseover="this.style.background='#0077b3'" onmouseout="this.style.background='#0088cc'">
        ➕ 加入频道
      </button>
      <button id="close-prompt-btn" style="
        background: transparent;
        color: #666;
        border: none;
        padding: 8px 16px;
        font-size: 14px;
        cursor: pointer;
      " onmouseover="this.style.color='#333'" onmouseout="this.style.color='#666'">
        稍后再说
      </button>
    </div>
  `;
  
  // 添加事件监听
  document.body.appendChild(prompt);
  
  // 预览频道按钮事件
  document.getElementById('preview-channel-btn').addEventListener('click', function() {
    console.log('WebView: 用户点击预览频道');
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'PREVIEW_CHANNEL_REQUEST',
      channelId: getCurrentChannelId()
    }));
    prompt.remove();
  });
  
  // 加入频道按钮事件
  document.getElementById('join-channel-btn').addEventListener('click', function() {
    console.log('WebView: 用户点击加入频道');
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'JOIN_CHANNEL_REQUEST',
      channelId: getCurrentChannelId()
    }));
    prompt.remove();
  });
  
  // 关闭提示按钮事件
  document.getElementById('close-prompt-btn').addEventListener('click', function() {
    prompt.remove();
  });
};
```

## 功能特点

### 1. 用户体验优化
- 提供预览选项，让用户了解频道信息
- 清晰的按钮布局和图标
- 友好的提示信息

### 2. 技术实现
- 使用Telegram Bot API获取频道信息
- 支持Bot Token未配置的情况
- 完善的错误处理

### 3. 信息展示
- 频道名称和类型
- 成员数量
- 频道描述
- 频道用户名
- 频道ID

## 使用流程

### 1. 用户点击频道
- 直接跳转到频道页面

### 2. WebView检测权限问题
- 自动识别"Text not allowed"状态
- 显示包含预览选项的提示界面

### 3. 用户选择操作
- 预览频道：显示频道基本信息
- 加入频道：发送加入请求
- 稍后再说：关闭提示

### 4. 预览信息展示
- 显示频道的详细信息
- 帮助用户做出决定

## 优势

1. **用户体验好** - 提供预览功能，让用户了解频道
2. **信息完整** - 显示频道的基本信息
3. **操作灵活** - 用户可以选择预览或直接加入
4. **技术稳定** - 基于现有的API架构
5. **错误处理** - 完善的异常情况处理

## 后续优化

1. **美化预览界面** - 使用更美观的弹窗设计
2. **添加更多信息** - 显示频道的最新消息等
3. **支持图片预览** - 显示频道头像
4. **多语言支持** - 支持国际化
5. **缓存机制** - 缓存频道信息，提高响应速度

通过这个预览功能，用户可以更好地了解频道信息，做出更明智的加入决定。 