import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Icon,
  Page,
  Stack,
  XStack,
  useMedia,
  useSafeAreaInsets,
} from '@onekeyhq/components';

import WebView from 'react-native-webview';
import {
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView
} from 'react-native';
import {
  useIsFocused,
  useRoute,
  useNavigation,
} from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useStore from '../../../store/test.js';
import { CUSTOM_NETWORK_URL } from '@onekeyhq/shared/src/config/appConfig';

// 自定义Hook：管理Telegram Token
const useTelegramToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 从AsyncStorage获取token
  const getTokenFromStorage = useCallback(async () => {
    try {
      const storedToken = await AsyncStorage.getItem('tgToken');
      setToken(storedToken);
      return storedToken;
    } catch (error) {
      console.error('获取token失败:', error);
      return null;
    }
  }, []);

  // 保存token到AsyncStorage
  const saveToken = useCallback(async (newToken: string) => {
    try {
      await AsyncStorage.setItem('tgToken', newToken);
      setToken(newToken);
      return true;
    } catch (error) {
      console.error('保存token失败:', error);
      return false;
    }
  }, []);

  // 清除token
  const clearToken = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('tgToken');
      setToken(null);
      return true;
    } catch (error) {
      console.error('清除token失败:', error);
      return false;
    }
  }, []);

  // 调用登录接口获取token
  const loginWithUserInfo = useCallback(async (userInfo: any) => {
    setIsLoading(true);
    try {
      const params = {
        telegramId: userInfo.id || userInfo.telegramId,
        phone: '',
        firstName: '',
        lastName: '',
        profilePicture: '',
        nick: '',
        username: '',
      };

      const response = await fetch(`${CUSTOM_NETWORK_URL}/communal/tgLogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.code === 200) {
          await saveToken(data.token);
          return { success: true, token: data.token };
        } else {
          return { success: false, error: '登录失败' };
        }
      } else {
        return { success: false, error: '网络请求失败' };
      }
    } catch (error) {
      console.error('登录接口调用失败:', error);
      return { success: false, error: '登录异常' };
    } finally {
      setIsLoading(false);
    }
  }, [saveToken]);

  // 初始化时获取token
  useEffect(() => {
    getTokenFromStorage();
  }, [getTokenFromStorage]);

  return {
    token,
    isLoading,
    getTokenFromStorage,
    saveToken,
    clearToken,
    loginWithUserInfo,
  };
};

async function requestMicrophonePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Microphone Permission',
        message:
          'This app needs access to your microphone for audio recording.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    console.log(PermissionsAndroid.RESULTS);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Microphone permission granted');
    } else {
      console.log('Microphone permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

function MobileBrowser() {
  const webViewRef = useRef<WebView>(null);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const route = useRoute();
  const { isShowAppTabs, setShowAppTabs } = useStore();
  
  // 使用自定义Hook管理token
  const { token, isLoading, saveToken, clearToken, loginWithUserInfo } = useTelegramToken();
  
  // 简化的JS注入，只负责基础通信
  const injectedJS = `
  (function() {
    // 基础消息监听
    document.addEventListener('message', function(event) {
      const data = JSON.parse(event.data);
      console.log('Received from React Native:', data);
      
      if(data?.type === 'uploadtgToken'){
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
          window.localStorage.setItem('tgToken', data.data.token);
          console.log('tgToken已经修改完毕');
        }
      } else if(data?.type === 'openSettings'){
        console.log('start');
        window?.openSettings();
      } else if(data?.type === 'toChannel'){
        const url = window.location.origin + '/' + data.channelId;
        console.log('url:', url);
        history.pushState(null, '', url);
        location.reload();
      } else if(data?.type === 'requestUserInfo'){
        console.log('收到请求用户信息的消息');
        // 从localStorage获取用户ID
        if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
          try {
            const userId = window.localStorage.getItem('telegram_user_id');
            if (userId) {
              console.log('从localStorage获取到用户ID:', userId);
              window.ReactNativeWebView.postMessage(JSON.stringify({ 
                type: 'provideUserInfo', 
                data: { id: userId }
              }));
            } else {
              console.log('localStorage中没有找到telegram_user_id');
              window.ReactNativeWebView.postMessage(JSON.stringify({ 
                type: 'provideUserInfo', 
                data: null 
              }));
            }
          } catch (error) {
            console.error('获取用户ID时出错:', error);
            window.ReactNativeWebView.postMessage(JSON.stringify({ 
              type: 'provideUserInfo', 
              data: null 
            }));
          }
        } else {
          console.log('localStorage不可用，无法获取用户ID');
          window.ReactNativeWebView.postMessage(JSON.stringify({ 
            type: 'provideUserInfo', 
            data: null 
          }));
        }
      }
    });
    
    // 通知React Native页面已准备就绪
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
    
    // 重写console.log以发送到React Native
    const originalLog = console.log;
    console.log = function(...args) {
      originalLog.apply(console, args);
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'log', data: args }));
    };
    
    // 暴露给WebView的API
    window.setTgAuthData = (authData) => {
      console.log('setTgAuthData called with:', authData);
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'sendTgAuthData', data: authData }));
    };
    
    window.setShowAppTabs = (flag) => {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'setShowAppTabs', data: flag }));
    };
    
    window.logout = () => {
      window.localStorage.removeItem('tgToken');
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'logout', data: null }));
    };
    
    // 页面加载时检查token
    function checkTgToken() {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        const cachedToken = window.localStorage.getItem('tgToken');
        if (!cachedToken) {
          console.log('localStorage中没有tgToken，请求React Native检查');
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'checkTgToken' }));
        } else {
          console.log('localStorage中已存在tgToken');
        }
      }
    }
    
    // 页面加载完成后检查token
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkTgToken);
    } else {
      checkTgToken();
    }
  })();
  true;
  `;

  // 处理WebView消息
  const handleWebViewMessage = useCallback(async (event: any) => {
    try {
      const messageData = JSON.parse(event.nativeEvent.data);
      
      switch (messageData.type) {
        case 'log':
          console.log('WebView Console Log:', ...messageData.data);
          break;
          
        case 'sendTgAuthData':
          console.log('收到用户认证数据:', messageData.data);
          const loginResult = await loginWithUserInfo(messageData.data);
          if (loginResult.success) {
            // 发送token到WebView
            webViewRef.current?.postMessage(
              JSON.stringify({
                type: 'uploadtgToken',
                data: { token: loginResult.token },
              }),
            );
          }
          break;
          
        case 'setShowAppTabs':
          setShowAppTabs(messageData.data);
          break;
          
        case 'checkTgToken':
          console.log('WebView请求检查token');
          if (token) {
            // 如果有token，发送给WebView
            webViewRef.current?.postMessage(
              JSON.stringify({
                type: 'uploadtgToken',
                data: { token },
              }),
            );
          } else {
            // 如果没有token，尝试从Telegram WebApp获取用户信息
            webViewRef.current?.postMessage(
              JSON.stringify({
                type: 'requestUserInfo',
              }),
            );
          }
          break;
          
        case 'provideUserInfo':
          if (messageData.data && messageData.data.id) {
            console.log('收到WebView提供的用户ID:', messageData.data.id);
            const loginResult = await loginWithUserInfo(messageData.data);
            if (loginResult.success) {
              webViewRef.current?.postMessage(
                JSON.stringify({
                  type: 'uploadtgToken',
                  data: { token: loginResult.token },
                }),
              );
            }
          } else {
            console.log('WebView无法提供用户ID，需要用户重新登录');
          }
          break;
          
        case 'logout':
          console.log('用户登出');
          await clearToken();
          break;
          
        default:
          console.log('未知消息类型:', messageData.type);
      }
    } catch (error) {
      console.error('处理WebView消息失败:', error);
    }
  }, [token, loginWithUserInfo, clearToken, setShowAppTabs]);

  useEffect(() => {
    if (isFocused) {
      if (route?.params?.action === 'openSettings') {
        webViewRef.current?.postMessage(
          JSON.stringify({
            type: 'openSettings',
          }),
        );
        navigation.setParams({ action: '321' });
      } else if (route?.params?.action === 'toChannel') {
        webViewRef.current?.postMessage(
          JSON.stringify({
            type: 'toChannel',
            channelId: route?.params?.channelId,
          }),
        );
        navigation.setParams({ action: '123' });
      }
    }
  }, [isFocused, route?.params, navigation]);

  useEffect(() => {
    // 隐藏 TabBar
    navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });

    return () => {
      // 离开页面时恢复 TabBar
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } });
    };
  }, [navigation]);

  return (
    <Page fullPage>
      <Page.Header headerShown={false} />

      <Page.Body>
        <KeyboardAvoidingView 
          behavior='height' 
          style={{flex:1}}
          keyboardVerticalOffset={isShowAppTabs?0:28}
        >
          <Stack flex={1}>
            <WebView
              ref={webViewRef}
              style={{flex:1}}
              onMessage={handleWebViewMessage}
              javaScriptEnabled={true}
              injectedJavaScript={injectedJS}
              cacheMode="LOAD_NO_CACHE"
              source={{ uri: 'https://tgwebtest.33test.com/'}}
              mediaPlaybackRequiresUserAction={false}
              allowsInlineMediaPlayback={true}
              originWhitelist={['*']}
              mediaCapturePermissionGrantType="grant"
            />
          </Stack>
        </KeyboardAvoidingView>
      </Page.Body>
    </Page>
  );
}

export default MobileBrowser;
