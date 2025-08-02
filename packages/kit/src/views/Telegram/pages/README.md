# Telegram 页面模块重构说明

## 文件结构

```
pages/
├── page.tsx                           # 主页面组件
├── components/
│   └── ChannelPreviewModal.tsx        # 频道预览模态框组件
├── hooks/
│   ├── useChannelInitialization.ts    # 频道初始化Hook
│   └── useChannelPreview.ts           # 频道预览Hook
├── utils/
│   └── webviewScripts.ts              # WebView脚本工具
└── README.md                          # 本文件
```

## 重构内容

### 1. 主页面组件 (`page.tsx`)
- **原问题**: 文件过大（697行），包含大量内联JavaScript代码
- **解决方案**: 
  - 提取自定义Hook处理业务逻辑
  - 将WebView脚本分离到独立文件
  - 简化组件结构，提高可读性

### 2. 自定义Hook

#### `useChannelInitialization.ts`
- 处理频道初始化逻辑
- 管理频道初始化状态
- 提供重试机制和错误处理

#### `useChannelPreview.ts`
- 处理频道预览功能
- 调用Telegram Bot API获取频道信息
- 显示频道预览信息

### 3. 组件

#### `ChannelPreviewModal.tsx`
- 频道预览模态框组件
- 提供统一的预览信息展示接口

### 4. 工具函数

#### `webviewScripts.ts`
- 包含所有WebView注入脚本
- 处理权限检测和用户交互
- 管理WebView与React Native的通信

## 优势

1. **可维护性**: 代码分离后更容易维护和调试
2. **可重用性**: Hook可以在其他组件中重用
3. **可测试性**: 独立的模块更容易进行单元测试
4. **可读性**: 代码结构更清晰，职责分离明确

## 使用方式

```typescript
// 在主页面中使用
import { useChannelInitialization } from './hooks/useChannelInitialization';
import { useChannelPreview } from './hooks/useChannelPreview';
import { getWebViewInjectedScript } from './utils/webviewScripts';

function MobileBrowser() {
  const { channelInitState, initializeChannel } = useChannelInitialization();
  const { handlePreviewChannel } = useChannelPreview();
  
  // 使用这些Hook和工具函数
}
```

## 注意事项

1. 确保所有导入路径正确
2. WebView脚本中的模板字符串需要正确转义
3. Hook之间的依赖关系需要正确管理
4. 错误处理需要在各个层级都得到妥善处理 