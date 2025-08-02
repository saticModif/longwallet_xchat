# OneKey App 项目修改文档

## 概述

本次修改主要涉及 WebView 相关功能的增强，特别是添加了对音频和视频功能的支持，包括麦克风权限请求、媒体播放设置以及相关 Android 权限的配置。

## 详细修改内容

### 1. WebView 组件增强

#### 1.1 NativeWebView.tsx 文件修改

- **添加麦克风权限请求功能**：

  - 引入了 `react-native-permissions` 库，用于请求麦克风权限
  - 添加了 `hasPermission` 状态管理
  - 实现了 `requestMicrophonePermission` 函数，在组件挂载时自动请求麦克风权限
  - 添加了权限请求结果的日志记录

- **WebView 媒体相关配置**：

  - 设置 `mediaPlaybackRequiresUserAction={false}`，允许自动播放媒体
  - 添加 `allowsInlineMediaPlayback` 支持内联媒体播放
  - 添加 `allowsFullscreenVideo` 支持全屏视频播放
  - 添加 `allowsProtectedMedia` 支持受保护媒体内容

- **权限请求处理**：
  - 添加了 `onPermissionRequest` 事件处理，自动授予 WebView 请求的权限
  - 添加了权限请求和授权的日志记录

### 2. Android 平台配置

#### 2.1 AndroidManifest.xml 文件修改

- **添加新的权限**：

  - `android.permission.RECORD_AUDIO`：麦克风录音权限
  - `android.permission.POST_NOTIFICATIONS`：通知权限
  - `android.permission.VIDEO_CAPTURE`：视频捕获权限
  - `android.permission.AUDIO_CAPTURE`：音频捕获权限

- **MainActivity 配置**：
  - 添加了 `supportsPictureInPicture="true"` 支持画中画模式

### 3. 新增功能页面

#### 3.1 ProfileScreen.tsx 文件

- 新增了 ProfileScreen 组件，包含一个配置完善的 WebView
- WebView 配置了以下特性：
  - 目标 URL 设置为 `https://tgweb.44ceshi.com`
  - 允许自动播放媒体 `mediaPlaybackRequiresUserAction={false}`
  - 支持内联媒体播放 `allowsInlineMediaPlayback`
  - 支持全屏视频 `allowsFullscreenVideo`
  - 启用 JavaScript `javaScriptEnabled`
  - 启用 DOM 存储 `domStorageEnabled`
  - 允许文件访问 `allowFileAccess`
  - 允许受保护媒体 `allowsProtectedMedia`
