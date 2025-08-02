import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

export interface JoinChannelState {
  isJoining: boolean;
  isJoined: boolean;
  error: string | null;
  channelId?: string;
}

export const useChannelJoin = () => {
  const [joinState, setJoinState] = useState<JoinChannelState>({
    isJoining: false,
    isJoined: false,
    error: null,
  });

  const joinChannel = useCallback(async (
    channelId: string,
    webViewRef: any
  ) => {
    if (!channelId) {
      console.error('频道ID不能为空');
      return;
    }

    setJoinState(prev => ({
      ...prev,
      isJoining: true,
      error: null,
      channelId,
    }));

    try {
      console.log('开始加入频道:', channelId);
      
      // 通过WebView执行加入频道操作
      const joinScript = `
        (async () => {
          try {
            console.log('WebView: 执行加入频道脚本');
            const result = await window.joinChannelViaWebView('${channelId}');
            console.log('WebView: 加入频道结果:', result);
            return result;
          } catch (error) {
            console.error('WebView: 加入频道失败:', error);
            return false;
          }
        })();
      `;
      
      // 执行WebView脚本
      webViewRef.current?.injectJavaScript(joinScript);
      
    } catch (error) {
      console.error('加入频道失败:', error);
      
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      
      setJoinState(prev => ({
        ...prev,
        isJoining: false,
        error: errorMessage,
      }));
      
      Alert.alert('错误', '加入频道失败，请重试');
    }
  }, []);

  const checkJoinStatus = useCallback(async (
    channelId: string,
    webViewRef: any
  ) => {
    try {
      console.log('检查频道加入状态:', channelId);
      
      const checkScript = `
        (async () => {
          try {
            const isJoined = await window.checkJoinStatus('${channelId}');
            console.log('WebView: 加入状态检查结果:', isJoined);
            
            // 通知React Native结果
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'JOIN_STATUS_RESULT',
              data: {
                channelId: '${channelId}',
                isJoined: isJoined
              }
            }));
            
            return isJoined;
          } catch (error) {
            console.error('WebView: 检查加入状态失败:', error);
            return false;
          }
        })();
      `;
      
      webViewRef.current?.injectJavaScript(checkScript);
      
    } catch (error) {
      console.error('检查加入状态失败:', error);
    }
  }, []);

  const resetJoinState = useCallback(() => {
    setJoinState({
      isJoining: false,
      isJoined: false,
      error: null,
    });
  }, []);

  return {
    joinState,
    joinChannel,
    checkJoinStatus,
    resetJoinState,
  };
}; 