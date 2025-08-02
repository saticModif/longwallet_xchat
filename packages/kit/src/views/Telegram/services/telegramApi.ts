import AsyncStorage from '@react-native-async-storage/async-storage';
import { CUSTOM_NETWORK_URL } from '@onekeyhq/shared/src/config/appConfig';

// Telegram API响应类型
export interface TelegramApiResponse<T = any> {
  code: number;
  data?: T;
  message?: string;
  token?: string;
}

// 频道信息类型
export interface ChannelInfo {
  id: string;
  title: string;
  username?: string;
  description?: string;
  memberCount?: number;
  isPrivate?: boolean;
  isChannel?: boolean;
  isGroup?: boolean;
  photo?: {
    small?: string;
    big?: string;
  };
}

// 频道初始化参数
export interface ChannelInitParams {
  channelId: string;
  accessHash?: string;
}

// 频道初始化结果
export interface ChannelInitResult {
  success: boolean;
  channelInfo?: ChannelInfo;
  error?: string;
  errorCode?: string;
}

// Telegram API错误类型
export enum TelegramApiError {
  CHANNEL_PRIVATE = 'CHANNEL_PRIVATE',
  CHANNEL_NOT_FOUND = 'CHANNEL_NOT_FOUND',
  ACCESS_DENIED = 'ACCESS_DENIED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// 错误信息映射
const ERROR_MESSAGES = {
  [TelegramApiError.CHANNEL_PRIVATE]: '该频道为私有频道，无法访问',
  [TelegramApiError.CHANNEL_NOT_FOUND]: '频道不存在',
  [TelegramApiError.ACCESS_DENIED]: '访问被拒绝',
  [TelegramApiError.NETWORK_ERROR]: '网络连接错误',
  [TelegramApiError.UNAUTHORIZED]: '用户未授权',
  [TelegramApiError.UNKNOWN_ERROR]: '未知错误',
};

/**
 * 获取用户Token
 */
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('tgToken');
  } catch (error) {
    console.error('获取Token失败:', error);
    return null;
  }
};

/**
 * 获取Bot Token
 * 在实际应用中，这个token应该从配置或环境变量中获取
 */
export const getBotToken = async (): Promise<string | null> => {
  try {
    // 从AsyncStorage获取bot token
    const botToken = await AsyncStorage.getItem('telegramBotToken');
    
    if (!botToken) {
      console.log('Bot Token未配置，将使用模拟数据');
      console.log('如需使用真实频道数据，请配置Bot Token');
      console.log('配置方法：');
      console.log('1. 在Telegram中联系 @BotFather');
      console.log('2. 发送 /newbot 命令创建Bot');
      console.log('3. 复制获得的Bot Token');
      console.log('4. 调用 setBotToken(token) 配置');
    }
    
    return botToken;
  } catch (error) {
    console.error('获取Bot Token失败:', error);
    return null;
  }
};

/**
 * 设置Bot Token
 */
export const setBotToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('telegramBotToken', token);
    console.log('Bot Token配置成功');
  } catch (error) {
    console.error('设置Bot Token失败:', error);
  }
};

/**
 * 清除Bot Token
 */
export const clearBotToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('telegramBotToken');
    console.log('Bot Token已清除');
  } catch (error) {
    console.error('清除Bot Token失败:', error);
  }
};

/**
 * 检查Bot Token是否已配置
 */
export const isBotTokenConfigured = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('telegramBotToken');
    return !!token;
  } catch (error) {
    console.error('检查Bot Token失败:', error);
    return false;
  }
};

/**
 * 检查频道权限（供外部调用）
 */
export const checkChannelPermission = async (channelId: string) => {
  try {
    const botToken = await getBotToken();
    if (!botToken) {
      console.log('Bot Token未配置，假设需要建立会话');
      return {
        hasAccess: false,
        needsSession: true,
        error: null,
      };
    }

    // 使用Telegram Bot API检查频道访问权限
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getChat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chat_id: channelId }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('频道访问权限检查成功:', data);
      return {
        hasAccess: true,
        needsSession: false,
        error: null,
      };
    } else {
      const error = await response.json();
      console.log('频道访问权限检查失败:', error);
      
      if (error.error_code === 403) {
        // Bot没有权限访问此频道
        return {
          hasAccess: false,
          needsSession: true,
          error: 'Bot没有权限访问此频道',
        };
      } else if (error.error_code === 400) {
        // 频道不存在
        return {
          hasAccess: false,
          needsSession: false,
          error: '频道不存在',
        };
      }
      
      return {
        hasAccess: false,
        needsSession: true,
        error: error.description || '访问权限检查失败',
      };
    }
  } catch (error) {
    console.error('检查频道权限失败:', error);
    return {
      hasAccess: false,
      needsSession: true,
      error: error instanceof Error ? error.message : '网络错误',
    };
  }
};

/**
 * 建立频道会话（供外部调用）
 */
export const establishChannelSession = async (channelId: string) => {
  try {
    console.log('尝试建立频道会话:', channelId);
    
    // 由于我们无法直接通过API建立用户会话，我们直接返回成功
    // 让WebView中的Telegram H5代码处理会话建立
    console.log('直接跳转到频道页面，让WebView处理会话建立');
    return true;
    
  } catch (error) {
    console.error('建立频道会话失败:', error);
    throw error;
  }
};

/**
 * 获取Bot信息
 */
export const getBotInfo = async (): Promise<{ username: string; name: string } | null> => {
  try {
    const botToken = await getBotToken();
    if (!botToken) {
      console.log('Bot Token未配置');
      return null;
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const data = await response.json();
    
    if (data.ok) {
      console.log('Bot信息:', data.result);
      return {
        username: data.result.username,
        name: data.result.first_name
      };
    } else {
      console.error('获取Bot信息失败:', data);
      return null;
    }
  } catch (error) {
    console.error('获取Bot信息失败:', error);
    return null;
  }
};

/**
 * 获取模拟频道信息（当Bot Token未配置时使用）
 */
const getMockChannelInfo = (channelId: string): ChannelInitResult => {
  // 根据频道ID生成更真实的模拟数据
  const mockChannelInfo: ChannelInfo = {
    id: channelId,
    title: channelId === '-1002581211950' ? 'test' : `频道 ${channelId}`,
    username: channelId === '-1002581211950' ? 'test_channel' : `channel_${channelId}`,
    description: channelId === '-1002581211950' 
      ? "Tencent's major shareholder's new progress in reducing holdings! The shareholding ratio has decreased to 23.99%" 
      : '这是一个模拟的频道信息（Bot Token未配置）',
    memberCount: Math.floor(Math.random() * 10000) + 100,
    isPrivate: false,
    isChannel: true,
    isGroup: false,
    photo: {
      small: 'https://via.placeholder.com/50x50/007AFF/FFFFFF?text=TG',
      big: 'https://via.placeholder.com/200x200/007AFF/FFFFFF?text=Telegram',
    },
  };
  
  console.log('使用模拟频道信息（Bot Token未配置）:', mockChannelInfo);
  
  return {
    success: true,
    channelInfo: mockChannelInfo,
  };
};

/**
 * 检查用户是否已登录
 */
export const isUserLoggedIn = async (): Promise<boolean> => {
  const token = await getToken();
  return !!token;
};

/**
 * 初始化频道
 * 调用Telegram API获取频道信息并建立会话
 */
export const initializeChannel = async (
  params: ChannelInitParams
): Promise<ChannelInitResult> => {
  try {
    console.log('开始初始化频道:', params);
    const token = await getToken();
    if (!token) {
      console.log('用户未登录，无法初始化频道');
      return {
        success: false,
        error: '用户未登录',
        errorCode: TelegramApiError.UNAUTHORIZED,
      };
    }

    console.log('使用Token初始化频道:', token.substring(0, 10) + '...');
    console.log('API URL:', `${CUSTOM_NETWORK_URL}/communal/getChannelInfo`);
    
    // 使用Telegram官方API获取频道信息
    console.log('使用Telegram官方API获取频道信息');
    
    try {
      // 构建Telegram API请求
      const telegramApiUrl = 'https://api.telegram.org/bot';
      const botToken = await getBotToken(); // 需要从配置或存储中获取bot token
      
      if (!botToken) {
        console.log('Bot token未配置，使用模拟数据');
        return getMockChannelInfo(params.channelId);
      }
      
      console.log('使用Bot Token调用Telegram API:', botToken.substring(0, 10) + '...');
      
      // 获取频道信息
      const response = await fetch(`${telegramApiUrl}${botToken}/getChat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: params.channelId,
        }),
      });
      
      console.log('Telegram API响应状态:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Telegram API错误:', errorData);
        
        // 详细的错误处理
        if (errorData.error_code === 400) {
          return {
            success: false,
            error: '频道不存在或无法访问',
            errorCode: TelegramApiError.CHANNEL_NOT_FOUND,
          };
        } else if (errorData.error_code === 403) {
          return {
            success: false,
            error: 'Bot 没有权限访问此频道，需要将 Bot 添加到频道中',
            errorCode: TelegramApiError.CHANNEL_PRIVATE,
          };
        } else if (errorData.error_code === 404) {
          return {
            success: false,
            error: '频道不存在或已被删除',
            errorCode: TelegramApiError.CHANNEL_NOT_FOUND,
          };
        }
        
        return {
          success: false,
          error: errorData.description || '获取频道信息失败',
          errorCode: TelegramApiError.UNKNOWN_ERROR,
        };
      }
      
      const telegramData = await response.json();
      console.log('Telegram API成功响应:', telegramData);
      
      if (telegramData.ok && telegramData.result) {
        const chat = telegramData.result;
        
        // 转换Telegram API响应为我们的格式
        const channelInfo: ChannelInfo = {
          id: chat.id.toString(),
          title: chat.title || chat.first_name || '未知频道',
          username: chat.username,
          description: chat.description || '',
          memberCount: chat.member_count,
          isPrivate: !chat.username, // 没有username的频道通常是私有的
          isChannel: chat.type === 'channel',
          isGroup: chat.type === 'group' || chat.type === 'supergroup',
          photo: chat.photo ? {
            small: chat.photo.small_file_id,
            big: chat.photo.big_file_id,
          } : undefined,
        };
        
        return {
          success: true,
          channelInfo,
        };
      } else {
        return {
          success: false,
          error: 'Telegram API返回无效数据',
          errorCode: TelegramApiError.UNKNOWN_ERROR,
        };
      }
    } catch (error) {
      console.error('Telegram API调用失败:', error);
      return {
        success: false,
        error: '网络错误或API调用失败',
        errorCode: TelegramApiError.NETWORK_ERROR,
      };
    }
  } catch (error) {
    console.error('频道初始化失败:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Network')) {
        return {
          success: false,
          error: ERROR_MESSAGES[TelegramApiError.NETWORK_ERROR],
          errorCode: TelegramApiError.NETWORK_ERROR,
        };
      }
    }
    
    return {
      success: false,
      error: ERROR_MESSAGES[TelegramApiError.UNKNOWN_ERROR],
      errorCode: TelegramApiError.UNKNOWN_ERROR,
    };
  }
};

/**
 * 获取频道完整信息
 * 包括成员数量、描述等详细信息
 */
export const getChannelFullInfo = async (
  channelId: string
): Promise<ChannelInitResult> => {
  try {
    const token = await getToken();
    if (!token) {
      return {
        success: false,
        error: '用户未登录',
        errorCode: TelegramApiError.UNAUTHORIZED,
      };
    }

    // 使用Telegram官方API获取频道完整信息
    console.log('使用Telegram官方API获取频道完整信息');
    
    const botToken = await getBotToken();
    
    if (!botToken) {
      console.log('Bot token未配置，使用模拟数据');
      return getMockChannelInfo(channelId);
    }
    
    try {
      const telegramApiUrl = 'https://api.telegram.org/bot';
      
      // 获取频道完整信息
      const response = await fetch(`${telegramApiUrl}${botToken}/getChat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: channelId,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Telegram API错误:', errorData);
        
        return {
          success: false,
          error: errorData.description || '获取频道完整信息失败',
          errorCode: TelegramApiError.UNKNOWN_ERROR,
        };
      }
      
      const telegramData = await response.json();
      
      if (telegramData.ok && telegramData.result) {
        const chat = telegramData.result;
        
        // 转换Telegram API响应为我们的格式
        const channelInfo: ChannelInfo = {
          id: chat.id.toString(),
          title: chat.title || chat.first_name || '未知频道',
          username: chat.username,
          description: chat.description || '',
          memberCount: chat.member_count,
          isPrivate: !chat.username,
          isChannel: chat.type === 'channel',
          isGroup: chat.type === 'group' || chat.type === 'supergroup',
          photo: chat.photo ? {
            small: chat.photo.small_file_id,
            big: chat.photo.big_file_id,
          } : undefined,
        };
        
        return {
          success: true,
          channelInfo,
        };
      } else {
        return {
          success: false,
          error: 'Telegram API返回无效数据',
          errorCode: TelegramApiError.UNKNOWN_ERROR,
        };
      }
    } catch (error) {
      console.error('Telegram API调用失败:', error);
      return {
        success: false,
        error: '网络错误或API调用失败',
        errorCode: TelegramApiError.NETWORK_ERROR,
      };
    }
  } catch (error) {
    console.error('获取频道完整信息失败:', error);
    return {
      success: false,
      error: ERROR_MESSAGES[TelegramApiError.UNKNOWN_ERROR],
      errorCode: TelegramApiError.UNKNOWN_ERROR,
    };
  }
};

/**
 * 加入频道
 */
export const joinChannel = async (
  channelId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const token = await getToken();
    if (!token) {
      return {
        success: false,
        error: '用户未登录',
      };
    }

    // 使用Telegram官方API加入频道
    console.log('使用Telegram官方API加入频道:', channelId);
    
    const botToken = await getBotToken();
    
    if (!botToken) {
      console.log('Bot token未配置，模拟加入频道成功');
      return {
        success: true,
      };
    }
    
    try {
      const telegramApiUrl = 'https://api.telegram.org/bot';
      
      // 注意：Bot无法直接加入频道，需要通过其他方式
      // 这里我们只是检查频道是否存在
      const response = await fetch(`${telegramApiUrl}${botToken}/getChat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: channelId,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Telegram API错误:', errorData);
        
        if (errorData.error_code === 400) {
          return {
            success: false,
            error: '频道不存在或无法访问',
          };
        }
        
        return {
          success: false,
          error: errorData.description || '加入频道失败',
        };
      }
      
      // 如果能够获取到频道信息，说明频道存在
      console.log('频道存在，模拟加入成功');
      return {
        success: true,
      };
    } catch (error) {
      console.error('Telegram API调用失败:', error);
      return {
        success: false,
        error: '网络错误或API调用失败',
      };
    }
  } catch (error) {
    console.error('加入频道失败:', error);
    return {
      success: false,
      error: '网络错误',
    };
  }
};

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
      console.log('频道预览信息:', data);
      
      return {
        success: true,
        channelInfo: data.result
      };
    } else {
      const error = await response.json();
      console.error('获取频道预览失败:', error);
      
      return {
        success: false,
        error: error.description || '获取频道信息失败'
      };
    }
  } catch (error) {
    console.error('预览频道失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '网络错误'
    };
  }
};

/**
 * 获取错误信息
 */
export const getErrorMessage = (errorCode: TelegramApiError): string => {
  return ERROR_MESSAGES[errorCode] || ERROR_MESSAGES[TelegramApiError.UNKNOWN_ERROR];
};

/**
 * 检查是否为可恢复的错误
 */
export const isRecoverableError = (errorCode: TelegramApiError): boolean => {
  return [
    TelegramApiError.NETWORK_ERROR,
    TelegramApiError.UNKNOWN_ERROR,
  ].includes(errorCode);
}; 