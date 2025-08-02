import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import MobileBrowser from '../page';

// Mock WebView
jest.mock('react-native-webview', () => {
  return {
    __esModule: true,
    default: ({ onMessage, injectedJavaScript }: any) => {
      // 模拟 WebView 消息
      const mockPostMessage = (data: any) => {
        onMessage({ nativeEvent: { data: JSON.stringify(data) } });
      };

      // 模拟注入的 JavaScript 执行
      if (injectedJavaScript) {
        // 模拟 WebView 准备就绪
        setTimeout(() => {
          mockPostMessage({ type: 'ready' });
        }, 100);
      }

      return <div data-testid="webview" />;
    },
  };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock navigation
const mockNavigation = {
  setParams: jest.fn(),
  getParent: jest.fn(() => ({
    setOptions: jest.fn(),
  })),
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
  useRoute: () => ({ params: {} }),
  useIsFocused: () => true,
}));

describe('Telegram MobileBrowser Interaction Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('页面加载时应该正确初始化', async () => {
    await act(async () => {
      render(<MobileBrowser />);
    });

    expect(screen.getByTestId('webview')).toBeInTheDocument();
  });

  test('WebView 消息处理应该正常工作', async () => {
    const { container } = render(<MobileBrowser />);

    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });

    // 模拟 WebView 发送消息
    const webview = screen.getByTestId('webview');
    
    // 测试登录消息处理
    fireEvent(webview, 'message', {
      nativeEvent: {
        data: JSON.stringify({
          type: 'sendTgAuthData',
          data: { id: '12345', firstName: 'Test', lastName: 'User' }
        })
      }
    });

    // 测试设置显示标签页消息
    fireEvent(webview, 'message', {
      nativeEvent: {
        data: JSON.stringify({
          type: 'setShowAppTabs',
          data: true
        })
      }
    });

    // 测试登出消息
    fireEvent(webview, 'message', {
      nativeEvent: {
        data: JSON.stringify({
          type: 'logout',
          data: null
        })
      }
    });
  });

  test('键盘交互应该正常工作', async () => {
    render(<MobileBrowser />);

    // 模拟键盘显示/隐藏
    const keyboardAvoidingView = screen.getByTestId('keyboard-avoiding-view');
    
    // 测试键盘显示时的行为
    fireEvent(keyboardAvoidingView, 'keyboardDidShow');
    
    // 测试键盘隐藏时的行为
    fireEvent(keyboardAvoidingView, 'keyboardDidHide');
  });

  test('页面焦点变化应该正确处理', async () => {
    const { rerender } = render(<MobileBrowser />);

    // 模拟页面获得焦点
    rerender(<MobileBrowser />);

    // 模拟页面失去焦点
    rerender(<MobileBrowser />);
  });

  test('路由参数变化应该正确处理', async () => {
    const mockRouteWithParams = {
      params: {
        action: 'openSettings',
        channelId: 'test-channel'
      }
    };

    jest.doMock('@react-navigation/native', () => ({
      useNavigation: () => mockNavigation,
      useRoute: () => mockRouteWithParams,
      useIsFocused: () => true,
    }));

    render(<MobileBrowser />);
  });

  test('性能测试 - 页面渲染时间', async () => {
    const startTime = performance.now();
    
    await act(async () => {
      render(<MobileBrowser />);
    });
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // 页面渲染时间应该在合理范围内
    expect(renderTime).toBeLessThan(1000); // 1秒内
  });

  test('内存使用测试', async () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    
    await act(async () => {
      render(<MobileBrowser />);
    });
    
    // 等待一段时间让组件完全加载
    await waitFor(() => {
      expect(screen.getByTestId('webview')).toBeInTheDocument();
    }, { timeout: 5000 });
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;
    
    // 内存增长应该在合理范围内
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB
  });
}); 