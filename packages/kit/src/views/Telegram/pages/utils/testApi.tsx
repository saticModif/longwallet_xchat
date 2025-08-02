import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import WebView from 'react-native-webview';

interface TestApiProps {
  webViewRef: React.RefObject<WebView>;
}

export const TestApiComponent: React.FC<TestApiProps> = ({ webViewRef }) => {
  const testTelegramAPI = () => {
    webViewRef.current?.injectJavaScript(`
      window.testTelegramAPI().then(result => {
        console.log('API测试结果:', result);
        if (result) {
          alert('Telegram API 可用！');
        } else {
          alert('Telegram API 不可用，请检查登录状态');
        }
      });
    `);
  };

  const testGetCurrentUser = () => {
    webViewRef.current?.injectJavaScript(`
      if (window.TelegramAPI && window.TelegramAPI.isGramJSAvailable()) {
        window.TelegramAPI.getCurrentUser()
          .then(user => {
            console.log('用户信息:', user);
            alert('获取用户信息成功！');
          })
          .catch(error => {
            console.error('获取用户信息失败:', error);
            alert('获取用户信息失败: ' + error.message);
          });
      } else {
        alert('GramJS 不可用');
      }
    `);
  };

  const testJoinChannel = () => {
    // 这里使用一个测试频道ID，实际使用时需要替换为真实的频道ID
    const testChannelId = '-1001234567890';
    
    webViewRef.current?.injectJavaScript(`
      window.joinChannelDirectly('${testChannelId}').then(success => {
        if (success) {
          alert('加入频道成功！');
        } else {
          alert('加入频道失败');
        }
      });
    `);
  };

  const testSendMessage = () => {
    const testChatId = '123456789';
    const testMessage = 'Hello from API test!';
    
    webViewRef.current?.injectJavaScript(`
      if (window.TelegramAPI && window.TelegramAPI.isGramJSAvailable()) {
        window.TelegramAPI.sendMessage('${testChatId}', '${testMessage}')
          .then(result => {
            console.log('发送消息成功:', result);
            alert('发送消息成功！');
          })
          .catch(error => {
            console.error('发送消息失败:', error);
            alert('发送消息失败: ' + error.message);
          });
      } else {
        alert('GramJS 不可用');
      }
    `);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Telegram API 测试</Text>
      
      <TouchableOpacity style={styles.button} onPress={testTelegramAPI}>
        <Text style={styles.buttonText}>测试 API 可用性</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testGetCurrentUser}>
        <Text style={styles.buttonText}>获取当前用户</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testJoinChannel}>
        <Text style={styles.buttonText}>测试加入频道</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testSendMessage}>
        <Text style={styles.buttonText}>测试发送消息</Text>
      </TouchableOpacity>
      
      <Text style={styles.note}>
        注意：请确保已登录 Telegram 并具有相应权限
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0088cc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  note: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
}); 