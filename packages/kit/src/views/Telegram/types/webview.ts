// WebView消息类型
export enum WebViewMessageType {
  READY = 'ready',
  LOG = 'log',
  SEND_TG_AUTH_DATA = 'sendTgAuthData',
  SET_SHOW_APP_TABS = 'setShowAppTabs',
  LOGOUT = 'logout',
  INITIALIZE_CHANNEL = 'initializeChannel',
  CHANNEL_SESSION_READY = 'channelSessionReady',
  CHANNEL_INIT_FAILED = 'channelInitFailed',
  UPLOAD_TG_TOKEN = 'uploadtgToken',
  OPEN_SETTINGS = 'openSettings',
  TO_CHANNEL = 'toChannel',
  JOIN_CHANNEL_REQUEST = 'joinChannelRequest',
  PREVIEW_CHANNEL_REQUEST = 'previewChannelRequest',
  JOIN_CHANNEL_RESULT = 'joinChannelResult',
  CHECK_JOIN_STATUS = 'checkJoinStatus',
  JOIN_STATUS_RESULT = 'joinStatusResult',
}

// WebView消息基础接口
export interface WebViewMessage {
  type: WebViewMessageType;
  data?: any;
}

// 频道初始化请求消息
export interface InitializeChannelMessage extends WebViewMessage {
  type: WebViewMessageType.INITIALIZE_CHANNEL;
  data: {
    channelId: string;
  };
}

// 频道会话准备就绪消息
export interface ChannelSessionReadyMessage extends WebViewMessage {
  type: WebViewMessageType.CHANNEL_SESSION_READY;
  data: {
    channelId: string;
    channelInfo: any;
  };
}

// 频道初始化失败消息
export interface ChannelInitFailedMessage extends WebViewMessage {
  type: WebViewMessageType.CHANNEL_INIT_FAILED;
  data: {
    channelId: string;
    error: string;
    retryCount?: number;
  };
}

// Telegram认证数据消息
export interface SendTgAuthDataMessage extends WebViewMessage {
  type: WebViewMessageType.SEND_TG_AUTH_DATA;
  data: {
    id: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
    nick: string;
    username: string;
  };
}

// 上传Token消息
export interface UploadTgTokenMessage extends WebViewMessage {
  type: WebViewMessageType.UPLOAD_TG_TOKEN;
  data: {
    token: string;
  };
}

// 跳转到频道消息
export interface ToChannelMessage extends WebViewMessage {
  type: WebViewMessageType.TO_CHANNEL;
  data: {
    channelId: string;
  };
}

// 加入频道请求消息
export interface JoinChannelRequestMessage extends WebViewMessage {
  type: WebViewMessageType.JOIN_CHANNEL_REQUEST;
  channelId: string;
}

// 预览频道请求消息
export interface PreviewChannelRequestMessage extends WebViewMessage {
  type: WebViewMessageType.PREVIEW_CHANNEL_REQUEST;
  channelId: string;
}

// 加入频道结果消息
export interface JoinChannelResultMessage extends WebViewMessage {
  type: WebViewMessageType.JOIN_CHANNEL_RESULT;
  data: {
    channelId: string;
    success: boolean;
    error?: string;
    method?: 'api' | 'ui' | 'link' | 'none' | 'error';
  };
}

// 检查加入状态消息
export interface CheckJoinStatusMessage extends WebViewMessage {
  type: WebViewMessageType.CHECK_JOIN_STATUS;
  data: {
    channelId: string;
  };
}

// 加入状态结果消息
export interface JoinStatusResultMessage extends WebViewMessage {
  type: WebViewMessageType.JOIN_STATUS_RESULT;
  data: {
    channelId: string;
    isJoined: boolean;
  };
}

// 打开设置消息
export interface OpenSettingsMessage extends WebViewMessage {
  type: WebViewMessageType.OPEN_SETTINGS;
}

// 设置显示App标签消息
export interface SetShowAppTabsMessage extends WebViewMessage {
  type: WebViewMessageType.SET_SHOW_APP_TABS;
  data: boolean;
}

// 登出消息
export interface LogoutMessage extends WebViewMessage {
  type: WebViewMessageType.LOGOUT;
  data: null;
}

// 日志消息
export interface LogMessage extends WebViewMessage {
  type: WebViewMessageType.LOG;
  data: any[];
}

// 准备就绪消息
export interface ReadyMessage extends WebViewMessage {
  type: WebViewMessageType.READY;
}

// 联合类型
export type WebViewMessageUnion =
  | InitializeChannelMessage
  | ChannelSessionReadyMessage
  | ChannelInitFailedMessage
  | SendTgAuthDataMessage
  | UploadTgTokenMessage
  | ToChannelMessage
  | JoinChannelRequestMessage
  | PreviewChannelRequestMessage
  | JoinChannelResultMessage
  | CheckJoinStatusMessage
  | JoinStatusResultMessage
  | OpenSettingsMessage
  | SetShowAppTabsMessage
  | LogoutMessage
  | LogMessage
  | ReadyMessage;

// WebView全局函数类型
export interface WebViewGlobalFunctions {
  setTgAuthData: (authData: SendTgAuthDataMessage['data']) => void;
  setShowAppTabs: (flag: boolean) => void;
  logout: () => void;
  initializeChannel: (channelId: string) => void;
  joinChannelViaWebView: (channelId: string) => Promise<boolean>;
  checkJoinStatus: (channelId: string) => Promise<boolean>;
  testTelegramAPI: () => Promise<boolean>;
  joinChannelDirectly: (channelId: string) => Promise<boolean>;
  exploreTelegramAPI: () => any;
  getRealTelegramAPI: () => any;
  debugTelegramAPI: () => void;
  analyzeWebpackChunk: () => void;
  realTelegramAPI?: any;
  onChannelSessionReady?: (data: ChannelSessionReadyMessage['data']) => void;
  onChannelInitFailed?: (data: ChannelInitFailedMessage['data']) => void;
}

// 扩展Window接口
declare global {
  interface Window extends WebViewGlobalFunctions {
    ReactNativeWebView: {
      postMessage: (message: string) => void;
    };
    openSettings?: () => void;
  }
} 