import { useCallback, useState } from 'react';
import {
  initializeChannel as initializeChannelApi,
  getChannelFullInfo,
  getBotInfo,
  TelegramApiError,
  isRecoverableError,
  type ChannelInitResult,
} from '../../services/telegramApi';

// 定义频道初始化状态
export interface ChannelInitState {
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  channelId?: string;
  retryCount: number;
}

export const useChannelInitialization = () => {
  const [channelInitState, setChannelInitState] = useState<ChannelInitState>({
    isLoading: false,
    isReady: false,
    error: null,
    retryCount: 0,
  });

  const initializeChannel = useCallback(async (
    channelId: string, 
    retryCount = 0,
    onSuccess?: (channelInfo: any) => void,
    onError?: (error: string) => void
  ) => {
    if (!channelId) {
      console.error('频道ID不能为空');
      return;
    }

    setChannelInitState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      channelId,
      retryCount,
    }));

    try {
      // 首先检查Bot信息
      const botInfo = await getBotInfo();
      if (botInfo) {
        console.log('Bot信息:', botInfo);
        console.log('请确保Bot @' + botInfo.username + ' 已被添加到频道中');
      }

      // 尝试初始化频道
      const initResult: ChannelInitResult = await initializeChannelApi({ channelId });
      
      if (initResult.success && initResult.channelInfo) {
        // 频道初始化成功，获取完整信息
        const fullInfoResult = await getChannelFullInfo(channelId);
        
        setChannelInitState(prev => ({
          ...prev,
          isLoading: false,
          isReady: true,
          error: null,
        }));

        const finalChannelInfo = fullInfoResult.success ? fullInfoResult.channelInfo : initResult.channelInfo;
        
        // 调用成功回调
        if (onSuccess) {
          onSuccess(finalChannelInfo);
        }
      } else {
        // 处理特定错误类型
        if (initResult.errorCode === TelegramApiError.CHANNEL_PRIVATE) {
          const errorMessage = 'Bot没有权限访问此频道，请联系频道管理员将Bot添加到频道中';
          console.log(errorMessage);
          console.log('请频道管理员将Bot @' + (botInfo?.username || 'your_bot') + ' 添加到频道中');
          
          setChannelInitState(prev => ({
            ...prev,
            isLoading: false,
            isReady: false,
            error: errorMessage,
          }));

          if (onError) {
            onError(errorMessage);
          }
          return;
        }
        
        // 检查是否为可恢复的错误
        if (initResult.errorCode && isRecoverableError(initResult.errorCode as TelegramApiError) && retryCount < 3) {
          // 可恢复错误，重试
          setTimeout(() => {
            initializeChannel(channelId, retryCount + 1, onSuccess, onError);
          }, 2000 * (retryCount + 1)); // 指数退避
          return;
        }
        
        throw new Error(initResult.error || '频道初始化失败');
      }
    } catch (error) {
      console.error('频道初始化失败:', error);
      
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      
      setChannelInitState(prev => ({
        ...prev,
        isLoading: false,
        isReady: false,
        error: errorMessage,
      }));

      if (onError) {
        onError(errorMessage);
      }
    }
  }, []);

  return {
    channelInitState,
    initializeChannel,
  };
}; 