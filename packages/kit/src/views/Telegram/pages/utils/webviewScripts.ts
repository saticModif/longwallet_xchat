import { WebViewMessageType } from '../../types/webview';

export const getWebViewInjectedScript = () => `
(function() {
  // 探索和获取Telegram API的函数
  window.exploreTelegramAPI = function() {
    console.log('WebView: 开始探索Telegram API...');
    
    // 方法1: 检查全局变量
    const globalVars = [
      'GramJs', 'gramjs', 'telegram', 'Telegram', 'tg', 'TG',
      'api', 'API', 'client', 'Client', 'session', 'Session'
    ];
    
    const foundGlobals = {};
    globalVars.forEach(varName => {
      if (typeof window[varName] !== 'undefined') {
        foundGlobals[varName] = window[varName];
        console.log('WebView: 找到全局变量:', varName, window[varName]);
      }
    });
    
    // 方法2: 检查window对象的所有属性
    const windowKeys = Object.keys(window);
    const telegramRelatedKeys = windowKeys.filter(key => 
      key.toLowerCase().includes('gram') || 
      key.toLowerCase().includes('telegram') || 
      key.toLowerCase().includes('tg') ||
      key.toLowerCase().includes('api') ||
      key.toLowerCase().includes('client')
    );
    
    console.log('WebView: 可能的Telegram相关属性:', telegramRelatedKeys);
    
    // 方法3: 尝试查找invoke函数
    const invokeFunctions = windowKeys.filter(key => 
      typeof window[key] === 'function' && 
      (key.toLowerCase().includes('invoke') || key.toLowerCase().includes('call'))
    );
    
    console.log('WebView: 可能的调用函数:', invokeFunctions);
    
    // 方法4: 检查document中的脚本标签
    const scripts = document.querySelectorAll('script');
    scripts.forEach((script, index) => {
      if (script.src && script.src.includes('telegram')) {
        console.log('WebView: 找到Telegram相关脚本:', script.src);
      }
    });
    
    // 方法5: 尝试从现有对象中提取API
    let telegramAPI = null;
    
    // 检查是否有现有的API对象
    if (window.telegram) {
      telegramAPI = window.telegram;
      console.log('WebView: 找到window.telegram:', telegramAPI);
    }
    
    if (window.Telegram) {
      telegramAPI = window.Telegram;
      console.log('WebView: 找到window.Telegram:', telegramAPI);
    }
    
    if (window.tg) {
      telegramAPI = window.tg;
      console.log('WebView: 找到window.tg:', telegramAPI);
    }
    
    // 方法6: 尝试从React组件中获取API
    try {
      const reactRoot = document.querySelector('#root') || document.querySelector('[data-reactroot]');
      if (reactRoot && reactRoot._reactInternalFiber) {
        console.log('WebView: 找到React根节点，尝试获取API');
        // 这里可以尝试遍历React组件树找到API
      }
    } catch (e) {
      console.log('WebView: 无法访问React组件树:', e);
    }
    
    return {
      foundGlobals,
      telegramRelatedKeys,
      invokeFunctions,
      telegramAPI
    };
  };
  
  // Telegram API 访问接口
  window.TelegramAPI = {
    // 检查GramJS是否可用
    isGramJSAvailable: function() {
      return typeof window.GramJs !== 'undefined' && typeof window.invoke === 'function';
    },

    // 获取当前用户信息
    getCurrentUser: async function() {
      if (!this.isGramJSAvailable()) {
        throw new Error('GramJS not available');
      }
      
      try {
        const result = await window.invoke(new window.GramJs.users.GetFullUser({ id: 'self' }));
        return result;
      } catch (error) {
        console.error('获取用户信息失败:', error);
        throw error;
      }
    },

    // 获取聊天信息
    getChatInfo: async function(chatId) {
      if (!this.isGramJSAvailable()) {
        throw new Error('GramJS not available');
      }
      
      try {
        const result = await window.invoke(new window.GramJs.messages.GetFullChat({ chatId }));
        return result;
      } catch (error) {
        console.error('获取聊天信息失败:', error);
        throw error;
      }
    },

    // 获取频道信息
    getChannelInfo: async function(channelId) {
      if (!this.isGramJSAvailable()) {
        throw new Error('GramJS not available');
      }
      
      try {
        const result = await window.invoke(new window.GramJs.channels.GetFullChannel({ 
          channel: channelId 
        }));
        return result;
      } catch (error) {
        console.error('获取频道信息失败:', error);
        throw error;
      }
    },

    // 加入频道
    joinChannel: async function(channelId) {
      if (!this.isGramJSAvailable()) {
        throw new Error('GramJS not available');
      }
      
      try {
        const result = await window.invoke(new window.GramJs.channels.JoinChannel({ 
          channel: channelId 
        }));
        return result;
      } catch (error) {
        console.error('加入频道失败:', error);
        throw error;
      }
    },

    // 离开频道
    leaveChannel: async function(channelId) {
      if (!this.isGramJSAvailable()) {
        throw new Error('GramJS not available');
      }
      
      try {
        const result = await window.invoke(new window.GramJs.channels.LeaveChannel({ 
          channel: channelId 
        }));
        return result;
      } catch (error) {
        console.error('离开频道失败:', error);
        throw error;
      }
    },

    // 发送消息
    sendMessage: async function(chatId, message) {
      if (!this.isGramJSAvailable()) {
        throw new Error('GramJS not available');
      }
      
      try {
        const result = await window.invoke(new window.GramJs.messages.SendMessage({
          peer: chatId,
          message: message,
          randomId: Math.random()
        }));
        return result;
      } catch (error) {
        console.error('发送消息失败:', error);
        throw error;
      }
    },

    // 获取消息历史
    getMessageHistory: async function(chatId, limit = 50) {
      if (!this.isGramJSAvailable()) {
        throw new Error('GramJS not available');
      }
      
      try {
        const result = await window.invoke(new window.GramJs.messages.GetHistory({
          peer: chatId,
          limit: limit
        }));
        return result;
      } catch (error) {
        console.error('获取消息历史失败:', error);
        throw error;
      }
    },

    // 获取对话列表
    getDialogs: async function(limit = 20) {
      if (!this.isGramJSAvailable()) {
        throw new Error('GramJS not available');
      }
      
      try {
        const result = await window.invoke(new window.GramJs.messages.GetDialogs({
          limit: limit
        }));
        return result;
      } catch (error) {
        console.error('获取对话列表失败:', error);
        throw error;
      }
    },

    // 搜索用户
    searchUsers: async function(query) {
      if (!this.isGramJSAvailable()) {
        throw new Error('GramJS not available');
      }
      
      try {
        const result = await window.invoke(new window.GramJs.contacts.Search({
          q: query,
          limit: 20
        }));
        return result;
      } catch (error) {
        console.error('搜索用户失败:', error);
        throw error;
      }
    },

    // 获取联系人列表
    getContacts: async function() {
      if (!this.isGramJSAvailable()) {
        throw new Error('GramJS not available');
      }
      
      try {
        const result = await window.invoke(new window.GramJs.contacts.GetContacts({}));
        return result;
      } catch (error) {
        console.error('获取联系人列表失败:', error);
        throw error;
      }
    },

    // 更新用户资料
    updateProfile: async function(firstName, lastName, about) {
      if (!this.isGramJSAvailable()) {
        throw new Error('GramJS not available');
      }
      
      try {
        const result = await window.invoke(new window.GramJs.account.UpdateProfile({
          firstName: firstName,
          lastName: lastName,
          about: about
        }));
        return result;
      } catch (error) {
        console.error('更新用户资料失败:', error);
        throw error;
      }
    },

    // 获取应用配置
    getAppConfig: async function() {
      if (!this.isGramJSAvailable()) {
        throw new Error('GramJS not available');
      }
      
      try {
        const result = await window.invoke(new window.GramJs.help.GetAppConfig({}));
        return result;
      } catch (error) {
        console.error('获取应用配置失败:', error);
        throw error;
      }
    }
  };

  // 检测权限问题并显示友好提示
  window.detectAndHandlePermissionIssue = function() {
    console.log('WebView: 检测权限问题');
    
    // 检测"Text not allowed"问题
    const textNotAllowed = document.querySelector('.text-not-allowed') || 
                          document.querySelector('[data-testid="text-not-allowed"]') ||
                          document.body.innerText.includes('Text not allowed');
    
    if (textNotAllowed) {
      console.log('WebView: 检测到权限问题，显示加入频道提示');
      showJoinChannelPrompt();
      return true;
    }
    
    // 检测其他权限相关的元素
    const joinButton = document.querySelector('[data-testid="join-button"]') ||
                      document.querySelector('.join-button') ||
                      document.querySelector('button[data-testid*="join"]');
    
    if (joinButton) {
      console.log('WebView: 找到Join按钮，显示提示');
      showJoinChannelPrompt();
      return true;
    }
    
    return false;
  };
  
  // 显示加入频道提示
  window.showJoinChannelPrompt = function() {
    // 移除已存在的提示
    const existingPrompt = document.getElementById('join-channel-prompt');
    if (existingPrompt) {
      existingPrompt.remove();
    }
    
    // 创建提示元素
    const prompt = document.createElement('div');
    prompt.id = 'join-channel-prompt';
    prompt.style.cssText = \`
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
    \`;
    
    prompt.innerHTML = \`
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
    \`;
    
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
  document.getElementById('join-channel-btn').addEventListener('click', async function() {
    console.log('WebView: 用户点击加入频道');
    const channelId = getCurrentChannelId();
    
    if (!channelId) {
      console.error('WebView: 无法获取频道ID');
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: '${WebViewMessageType.JOIN_CHANNEL_RESULT}',
        data: {
          channelId: null,
          success: false,
          error: '无法获取频道ID'
        }
      }));
      prompt.remove();
      return;
    }
    
    try {
      // 首先尝试获取真实API
      const realAPI = window.getRealTelegramAPI();
      if (realAPI) {
        console.log('WebView: 使用真实API加入频道:', channelId);
        
        try {
          // 尝试调用真实API的加入频道方法
          let result = null;
          
          // 尝试不同的方法名
          const possibleMethods = ['joinChannel', 'join', 'subscribe', 'follow'];
          for (const method of possibleMethods) {
            if (typeof realAPI[method] === 'function') {
              console.log('WebView: 尝试调用真实API方法:', method);
              result = await realAPI[method](channelId);
              break;
            }
          }
          
          if (result) {
            console.log('WebView: 真实API加入频道成功:', result);
            
            // 通知React Native成功
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: '${WebViewMessageType.JOIN_CHANNEL_RESULT}',
              data: {
                channelId,
                success: true,
                error: null,
                method: 'real-api'
              }
            }));
            
            // 等待一段时间后刷新页面
            setTimeout(() => {
              console.log('WebView: 真实API加入成功，刷新页面');
              window.location.reload();
            }, 2000);
            
            prompt.remove();
            return;
          }
        } catch (apiError) {
          console.error('WebView: 真实API加入频道失败:', apiError);
          // API失败，继续尝试其他方法
        }
      }
      
      // 如果真实API不可用，尝试使用GramJS API
      if (window.TelegramAPI && window.TelegramAPI.isGramJSAvailable()) {
        console.log('WebView: 使用GramJS API加入频道:', channelId);
        
        try {
          const result = await window.TelegramAPI.joinChannel(channelId);
          console.log('WebView: GramJS API加入频道成功:', result);
          
          // 通知React Native成功
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: '${WebViewMessageType.JOIN_CHANNEL_RESULT}',
            data: {
              channelId,
              success: true,
              error: null,
              method: 'gramjs-api'
            }
          }));
          
          // 等待一段时间后刷新页面
          setTimeout(() => {
            console.log('WebView: GramJS API加入成功，刷新页面');
            window.location.reload();
          }, 2000);
          
          prompt.remove();
          return;
          
        } catch (apiError) {
          console.error('WebView: GramJS API加入频道失败:', apiError);
          // API失败，继续尝试UI方法
        }
      }
      
      // 如果API不可用或失败，使用UI方法
      console.log('WebView: 使用UI方法加入频道');
      
      // 直接查找并点击页面上的加入按钮
      const joinButtons = document.querySelectorAll('button, a, [role="button"]');
      let foundJoinButton = false;
      
      joinButtons.forEach((button, index) => {
        const text = button.textContent || button.innerText || '';
        const className = button.className || '';
        const id = button.id || '';
        
        // 检查是否包含加入相关的文本
        if (text.toLowerCase().includes('join') || 
            text.toLowerCase().includes('加入') ||
            className.toLowerCase().includes('join') ||
            id.toLowerCase().includes('join')) {
          console.log('WebView: 找到加入按钮，点击:', button);
          button.click();
          foundJoinButton = true;
          
          // 通知React Native
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: '${WebViewMessageType.JOIN_CHANNEL_RESULT}',
            data: {
              channelId,
              success: true,
              error: null,
              method: 'ui'
            }
          }));
          
          // 等待一段时间后刷新页面，确保保持在频道页面
          setTimeout(() => {
            console.log('WebView: UI加入成功，刷新页面');
            const currentUrl = window.location.href;
            const channelId = getCurrentChannelId();
            
            if (channelId && !currentUrl.includes(channelId)) {
              // 如果URL不包含频道ID，重新导航到频道页面
              const channelUrl = window.location.origin + '/#' + channelId;
              console.log('WebView: 导航到频道页面:', channelUrl);
              window.location.href = channelUrl;
            } else {
              // 否则直接刷新当前页面
              window.location.reload();
            }
          }, 1000);
        }
      });
      
      if (!foundJoinButton) {
        console.log('WebView: 未找到加入按钮，尝试其他方法');
        
        // 尝试查找包含"join"的链接
        const joinLinks = document.querySelectorAll('a[href*="join"], a[href*="t.me"]');
        if (joinLinks.length > 0) {
          console.log('WebView: 找到加入链接，点击:', joinLinks[0]);
          joinLinks[0].click();
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: '${WebViewMessageType.JOIN_CHANNEL_RESULT}',
            data: {
              channelId,
              success: true,
              error: null,
              method: 'link'
            }
          }));
          
          // 等待一段时间后刷新页面，确保保持在频道页面
          setTimeout(() => {
            console.log('WebView: 链接加入成功，刷新页面');
            const currentUrl = window.location.href;
            const channelId = getCurrentChannelId();
            
            if (channelId && !currentUrl.includes(channelId)) {
              // 如果URL不包含频道ID，重新导航到频道页面
              const channelUrl = window.location.origin + '/#' + channelId;
              console.log('WebView: 导航到频道页面:', channelUrl);
              window.location.href = channelUrl;
            } else {
              // 否则直接刷新当前页面
              window.location.reload();
            }
          }, 1000);
        } else {
          console.log('WebView: 未找到任何加入按钮或链接');
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: '${WebViewMessageType.JOIN_CHANNEL_RESULT}',
            data: {
              channelId,
              success: false,
              error: '未找到加入按钮或链接',
              method: 'none'
            }
          }));
        }
      }
      
    } catch (error) {
      console.error('WebView: 加入频道过程中发生错误:', error);
      
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: '${WebViewMessageType.JOIN_CHANNEL_RESULT}',
        data: {
          channelId,
          success: false,
          error: error.message || '加入频道时发生错误',
          method: 'error'
        }
      }));
    }
    
    prompt.remove();
  });
    
    // 关闭提示按钮事件
    document.getElementById('close-prompt-btn').addEventListener('click', function() {
      prompt.remove();
    });
  };
  
  // 获取当前频道ID
  window.getCurrentChannelId = function() {
    // 从URL中提取频道ID
    const url = window.location.href;
    const match = url.match(/#(-\\d+)/);
    return match ? match[1] : null;
  };
  
  // 加入频道相关函数
  window.joinChannelViaWebView = async (channelId) => {
    console.log('WebView: 尝试加入频道:', channelId);
    
    try {
      // 方法1: 查找并点击加入按钮
      const joinButton = document.querySelector('[data-testid="join-button"]') ||
                        document.querySelector('.join-button') ||
                        document.querySelector('button[data-testid*="join"]') ||
                        document.querySelector('button[class*="join"]') ||
                        document.querySelector('a[data-testid*="join"]') ||
                        document.querySelector('a[class*="join"]');
      
      if (joinButton) {
        console.log('WebView: 找到加入按钮，点击加入');
        joinButton.click();
        
        // 等待一段时间让操作完成
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 检查是否加入成功
        const isJoined = await window.checkJoinStatus(channelId);
        
        // 通知React Native结果
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: '${WebViewMessageType.JOIN_CHANNEL_RESULT}',
          data: {
            channelId,
            success: isJoined,
            error: isJoined ? null : '加入操作可能失败'
          }
        }));
        
        return isJoined;
      }
      
      // 方法2: 查找加入频道的链接
      const joinLink = document.querySelector('a[href*="join"]') ||
                      document.querySelector('a[href*="t.me"]') ||
                      document.querySelector('a[href*="telegram.me"]');
      
      if (joinLink) {
        console.log('WebView: 找到加入链接，点击加入');
        joinLink.click();
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const isJoined = await window.checkJoinStatus(channelId);
        
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: '${WebViewMessageType.JOIN_CHANNEL_RESULT}',
          data: {
            channelId,
            success: isJoined,
            error: isJoined ? null : '加入操作可能失败'
          }
        }));
        
        return isJoined;
      }
      
      // 方法3: 尝试通过URL直接加入
      console.log('WebView: 尝试通过URL加入频道');
      const joinUrl = \`https://t.me/\${channelId.replace('@', '')}\`;
      
      // 创建一个隐藏的iframe来触发加入
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = joinUrl;
      document.body.appendChild(iframe);
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const isJoined = await window.checkJoinStatus(channelId);
      
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: '${WebViewMessageType.JOIN_CHANNEL_RESULT}',
        data: {
          channelId,
          success: isJoined,
          error: isJoined ? null : '无法找到加入按钮或链接'
        }
      }));
      
      return isJoined;
      
    } catch (error) {
      console.error('WebView: 加入频道失败:', error);
      
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: '${WebViewMessageType.JOIN_CHANNEL_RESULT}',
        data: {
          channelId,
          success: false,
          error: error.message || '加入频道时发生错误'
        }
      }));
      
      return false;
    }
  };
  
  // 检查用户是否已加入频道
  window.checkJoinStatus = async (channelId) => {
    console.log('WebView: 检查频道加入状态:', channelId);
    
    try {
      // 方法1: 检查是否有"已加入"的标识
      const joinedIndicator = document.querySelector('[data-testid="joined-indicator"]') ||
                             document.querySelector('.joined-indicator') ||
                             document.querySelector('[class*="joined"]') ||
                             document.querySelector('[class*="member"]');
      
      if (joinedIndicator) {
        console.log('WebView: 检测到已加入标识');
        return true;
      }
      
      // 方法2: 检查是否有"离开频道"按钮
      const leaveButton = document.querySelector('[data-testid="leave-button"]') ||
                         document.querySelector('.leave-button') ||
                         document.querySelector('button[data-testid*="leave"]') ||
                         document.querySelector('button[class*="leave"]');
      
      if (leaveButton) {
        console.log('WebView: 检测到离开按钮，说明已加入');
        return true;
      }
      
      // 方法3: 检查页面内容是否显示为成员
      const memberText = document.body.innerText.toLowerCase();
      if (memberText.includes('member') || 
          memberText.includes('成员') || 
          memberText.includes('已加入') ||
          memberText.includes('joined')) {
        console.log('WebView: 页面内容显示已加入');
        return true;
      }
      
      // 方法4: 检查URL是否包含频道信息
      const currentUrl = window.location.href;
      if (currentUrl.includes(channelId) || currentUrl.includes('t.me')) {
        console.log('WebView: 当前在频道页面，可能已加入');
        // 进一步检查是否有权限访问
        const hasAccess = !document.querySelector('.text-not-allowed') &&
                         !document.querySelector('[data-testid="text-not-allowed"]');
        return hasAccess;
      }
      
      console.log('WebView: 未检测到已加入状态');
      return false;
      
    } catch (error) {
      console.error('WebView: 检查加入状态失败:', error);
      return false;
    }
  };
  
  // 页面加载完成后立即探索API
  setTimeout(function() {
    console.log('WebView: 页面加载完成，开始探索Telegram API...');
    const explorationResult = window.exploreTelegramAPI();
    console.log('WebView: API探索结果:', explorationResult);
    
    // 分析webpack chunk
    window.analyzeWebpackChunk();
    
    // 尝试获取真实API
    const realAPI = window.getRealTelegramAPI();
    if (realAPI) {
      console.log('WebView: 成功获取真实API:', realAPI);
      // 将真实API保存到全局变量中
      window.realTelegramAPI = realAPI;
    } else {
      console.log('WebView: 未找到真实API');
    }
  }, 2000);
  
  // 定期检测权限问题
  setInterval(function() {
    window.detectAndHandlePermissionIssue();
  }, 30000);
  
  document.addEventListener('message', function(event) {
    const data = JSON.parse(event.data);

    if(data?.type === '${WebViewMessageType.UPLOAD_TG_TOKEN}'){
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        window.localStorage.setItem('tgToken',data.data.token);
        console.log('tgToken已经修改完毕');
      }
    } else if(data?.type === '${WebViewMessageType.OPEN_SETTINGS}'){
      console.log('start')
      window?.openSettings()
    } else if(data?.type === '${WebViewMessageType.TO_CHANNEL}'){
      const url = window.location.origin + '/#' + data.channelId;
      console.log('url');
      console.log(url);
      history.pushState(null,'' ,url);
      location.reload();
    } else if(data?.type === '${WebViewMessageType.CHANNEL_SESSION_READY}'){
      console.log('频道会话准备就绪:', data.data);
      // 处理频道准备就绪的逻辑
      if (window.onChannelSessionReady) {
        window.onChannelSessionReady(data.data);
      }
    } else if(data?.type === '${WebViewMessageType.CHANNEL_INIT_FAILED}'){
      console.error('频道初始化失败:', data.data);
      // 处理频道初始化失败的逻辑
      if (window.onChannelInitFailed) {
        window.onChannelInitFailed(data.data);
      }
      
      // 如果是权限问题，显示加入频道提示
      if (data.data.error && data.data.error.includes('权限')) {
        console.log('检测到权限问题，显示加入频道提示');
        setTimeout(() => {
          window.detectAndHandlePermissionIssue();
        }, 1000);
      }
    }
    console.log('Received from React Native:', data);
  });
  
  window.ReactNativeWebView.postMessage(JSON.stringify({ type:'${WebViewMessageType.READY}' }));
  
  const originalLog = console.log;
  console.log = function(...args) {
    originalLog.apply(console, args);
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: '${WebViewMessageType.LOG}', data: args }));
  };
  
  window.setTgAuthData = (authData)=>{
    console.log('setTgAuthData called with:', authData);
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: '${WebViewMessageType.SEND_TG_AUTH_DATA}', data: authData }));
  }
  
  window.setShowAppTabs = (flag)=>{
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: '${WebViewMessageType.SET_SHOW_APP_TABS}', data: flag }));
  }
  
  window.logout = ()=>{
    window.localStorage.removeItem('tgToken');
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: '${WebViewMessageType.LOGOUT}', data: null }));
  }
  
  // 添加频道初始化相关的全局函数
  window.initializeChannel = (channelId) => {
    window.ReactNativeWebView.postMessage(JSON.stringify({ 
      type: '${WebViewMessageType.INITIALIZE_CHANNEL}', 
      data: { channelId } 
    }));
  }
  
  // 实际获取Telegram API的函数
  window.getRealTelegramAPI = function() {
    console.log('WebView: 尝试获取真实的Telegram API...');
    
    // 方法1: 检查webpack chunk中的API
    let api = null;
    
    // 检查webpackChunktelegram_t
    if (window.webpackChunktelegram_t) {
      console.log('WebView: 找到webpackChunktelegram_t:', window.webpackChunktelegram_t);
      
      // 遍历webpack chunk中的所有模块
      try {
        const chunk = window.webpackChunktelegram_t;
        if (Array.isArray(chunk)) {
          chunk.forEach((moduleArray, index) => {
            if (Array.isArray(moduleArray)) {
              moduleArray.forEach((module, moduleIndex) => {
                if (module && typeof module === 'object') {
                  console.log('ssssss:',module);
                  
                  // 查找包含API的对象
                  const findAPIInModule = (obj, path = '') => {
                    for (const [key, value] of Object.entries(obj)) {
                      if (key.toLowerCase().includes('api') || 
                          key.toLowerCase().includes('client') ||
                          key.toLowerCase().includes('gram') ||
                          key.toLowerCase().includes('telegram')) {
                        console.log('WebView:', value);
                        if (typeof value === 'object' && value !== null) {
                          return value;
                        }
                      }
                      if (value && typeof value === 'object' && path.length < 5) {
                        const found = findAPIInModule(value, path + '.' + key);
                        if (found) return found;
                      }
                    }
                    return null;
                  };
                  
                  const foundAPI = findAPIInModule(module);
                  if (foundAPI && !api) {
                    api = foundAPI;
                    console.log('WebView: 从webpack chunk中找到API:', api);
                  }
                }
              });
            }
          });
        }
      } catch (e) {
        console.log('WebView: 无法从webpack chunk获取API:', e);
      }
    }
    
    // 方法2: 检查全局变量
    if (!api) {
      const possibleAPIs = [
        'telegram', 'Telegram', 'tg', 'TG', 'gram', 'Gram',
        'api', 'API', 'client', 'Client', 'session', 'Session'
      ];
      
      for (const name of possibleAPIs) {
        if (window[name] && typeof window[name] === 'object') {
          console.log('WebView: 找到可能的API对象:', name, window[name]);
          api = window[name];
          break;
        }
      }
    }
    
    // 方法3: 尝试从React组件中获取
    if (!api) {
      try {
        // 查找React组件中的API
        const reactElements = document.querySelectorAll('[data-testid], [class*="react"], [id*="react"]');
        for (const element of reactElements) {
          if (element._reactInternalFiber) {
            const fiber = element._reactInternalFiber;
            if (fiber.memoizedProps && fiber.memoizedProps.api) {
              console.log('WebView: 从React组件中找到API:', fiber.memoizedProps.api);
              api = fiber.memoizedProps.api;
              break;
            }
          }
        }
      } catch (e) {
        console.log('WebView: 无法从React组件获取API:', e);
      }
    }
    
    // 方法4: 尝试从全局状态中获取
    if (!api) {
      try {
        // 检查是否有全局状态管理
        const globalStateKeys = Object.keys(window).filter(key => 
          key.includes('store') || key.includes('state') || key.includes('app')
        );
        
        for (const key of globalStateKeys) {
          const state = window[key];
          if (state && typeof state === 'object') {
            // 递归查找API
            const findAPI = (obj, path = '') => {
              for (const [k, v] of Object.entries(obj)) {
                if (k.toLowerCase().includes('api') || k.toLowerCase().includes('client')) {
                  console.log('WebView: 在状态中找到API:', path + '.' + k, v);
                  return v;
                }
                if (v && typeof v === 'object' && path.length < 10) {
                  const found = findAPI(v, path + '.' + k);
                  if (found) return found;
                }
              }
              return null;
            };
            
            const foundAPI = findAPI(state);
            if (foundAPI) {
              api = foundAPI;
              break;
            }
          }
        }
      } catch (e) {
        console.log('WebView: 无法从全局状态获取API:', e);
      }
    }
    
    // 方法5: 尝试监听和拦截API调用
    if (!api) {
      try {
        console.log('WebView: 尝试监听API调用...');
        
        // 监听fetch调用
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
          console.log('WebView: 拦截到fetch调用:', args);
          return originalFetch.apply(this, args);
        };
        
        // 监听XHR调用
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(...args) {
          console.log('WebView: 拦截到XHR调用:', args);
          return originalXHROpen.apply(this, args);
        };
        
        // 监听可能的API调用
        const originalPostMessage = window.postMessage;
        window.postMessage = function(...args) {
          console.log('WebView: 拦截到postMessage调用:', args);
          return originalPostMessage.apply(this, args);
        };
        
      } catch (e) {
        console.log('WebView: 无法监听API调用:', e);
      }
    }
    
    return api;
  };
  
  // 测试Telegram API的函数
  window.testTelegramAPI = async () => {
    console.log('WebView: 开始测试Telegram API');
    
    // 首先尝试获取真实的API
    const realAPI = window.getRealTelegramAPI();
    if (realAPI) {
      console.log('WebView: 找到真实API:', realAPI);
      
      // 尝试调用真实API的方法
      const methods = Object.getOwnPropertyNames(realAPI);
      console.log('WebView: 真实API的方法:', methods);
      
      // 尝试调用一些可能的方法
      const testMethods = ['getCurrentUser', 'getUser', 'getMe', 'getProfile'];
      for (const method of testMethods) {
        if (typeof realAPI[method] === 'function') {
          try {
            console.log('WebView: 尝试调用方法:', method);
            const result = await realAPI[method]();
            console.log('WebView: 方法调用成功:', method, result);
            return true;
          } catch (e) {
            console.log('WebView: 方法调用失败:', method, e);
          }
        }
      }
      
      return true;
    }
    
    if (!window.TelegramAPI || !window.TelegramAPI.isGramJSAvailable()) {
      console.log('WebView: GramJS不可用');
      return false;
    }
    
    try {
      // 测试获取当前用户
      console.log('WebView: 测试获取当前用户');
      const user = await window.TelegramAPI.getCurrentUser();
      console.log('WebView: 当前用户信息:', user);
      
      // 测试获取应用配置
      console.log('WebView: 测试获取应用配置');
      const config = await window.TelegramAPI.getAppConfig();
      console.log('WebView: 应用配置:', config);
      
      console.log('WebView: Telegram API测试成功');
      return true;
    } catch (error) {
      console.error('WebView: Telegram API测试失败:', error);
      return false;
    }
  };
  
  // 调试函数：在控制台中查看所有可用的API
  window.debugTelegramAPI = function() {
    console.log('WebView: === Telegram API 调试信息 ===');
    
    // 探索API
    const explorationResult = window.exploreTelegramAPI();
    console.log('WebView: API探索结果:', explorationResult);
    
    // 获取真实API
    const realAPI = window.getRealTelegramAPI();
    if (realAPI) {
      console.log('WebView: 真实API对象:', realAPI);
      console.log('WebView: 真实API方法:', Object.getOwnPropertyNames(realAPI));
      
      // 尝试获取API的原型链
      let proto = Object.getPrototypeOf(realAPI);
      while (proto) {
        console.log('WebView: API原型方法:', Object.getOwnPropertyNames(proto));
        proto = Object.getPrototypeOf(proto);
      }
    }
    
    // 检查GramJS
    if (window.GramJs) {
      console.log('WebView: GramJs对象:', window.GramJs);
      console.log('WebView: GramJs属性:', Object.getOwnPropertyNames(window.GramJs));
    }
    
    // 检查invoke函数
    if (window.invoke) {
      console.log('WebView: invoke函数:', window.invoke);
    }
    
    // 深入分析webpack chunk
    if (window.webpackChunktelegram_t) {
      console.log('WebView: === 深入分析webpackChunktelegram_t ===');
      const chunk = window.webpackChunktelegram_t;
      
      if (Array.isArray(chunk)) {
        chunk.forEach((moduleArray, index) => {
          console.log('WebView:', moduleArray);
          
          if (Array.isArray(moduleArray)) {
            moduleArray.forEach((module, moduleIndex) => {
              if (module && typeof module === 'object') {
                console.log('WebView: 类型:', typeof module);
                console.log('WebView: 模块 键:', Object.keys(module));
                
                // 查找函数
                const functions = Object.entries(module).filter(([key, value]) => typeof value === 'function');
                if (functions.length > 0) {
                  console.log('WebView: 模块  函数:', functions.map(([key]) => key));
                }
                
                // 查找对象
                const objects = Object.entries(module).filter(([key, value]) => typeof value === 'object' && value !== null);
                if (objects.length > 0) {
                  console.log('WebView: 模块  对象:', objects.map(([key]) => key));
                }
              }
            });
          }
        });
      }
    }
    
    console.log('WebView: === 调试信息结束 ===');
  };
  
  // 专门分析webpack chunk的函数
  window.analyzeWebpackChunk = function() {
    console.log('WebView: === 分析webpack chunk ===');
    
    if (!window.webpackChunktelegram_t) {
      console.log('WebView: 未找到webpackChunktelegram_t');
      return;
    }
    
    const chunk = window.webpackChunktelegram_t;
    console.log('WebView: webpackChunktelegram_t类型:', typeof chunk);
    console.log('WebView: webpackChunktelegram_t长度:', Array.isArray(chunk) ? chunk.length : '不是数组');
    
    if (Array.isArray(chunk)) {
      chunk.forEach((moduleArray, index) => {
        console.log('WebView: 模块数组  类型:', typeof moduleArray);
        console.log('WebView: 模块数组  长度:', Array.isArray(moduleArray) ? moduleArray.length : '不是数组');
        
        if (Array.isArray(moduleArray)) {
          moduleArray.forEach((module, moduleIndex) => {
            if (module && typeof module === 'object') {
              console.log('WebView: 模块  详细信息:');
              console.log('  - 类型:', typeof module);
              console.log('  - 键数量:', Object.keys(module).length);
              console.log('  - 所有键:', Object.keys(module));
              
              // 查找可能的API相关对象
              Object.entries(module).forEach(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                  if (key.toLowerCase().includes('api') || 
                      key.toLowerCase().includes('client') ||
                      key.toLowerCase().includes('gram') ||
                      key.toLowerCase().includes('telegram')) {
                    console.log('WebView: 发现可能的API对象 :', value);
                    console.log('WebView: API对象方法:', Object.getOwnPropertyNames(value));
                  }
                }
              });
            }
          });
        }
      });
    }
    
    console.log('WebView: === webpack chunk分析结束 ===');
  };
  
  // 直接加入频道的函数
  window.joinChannelDirectly = async (channelId) => {
    console.log('WebView: 直接加入频道:', channelId);
    
    // 首先尝试获取真实的API
    const realAPI = window.getRealTelegramAPI();
    if (realAPI) {
      console.log('WebView: 使用真实API加入频道');
      try {
        // 尝试调用真实API的加入频道方法
        let result = null;
        
        // 尝试不同的方法名
        const possibleMethods = ['joinChannel', 'join', 'subscribe', 'follow'];
        for (const method of possibleMethods) {
          if (typeof realAPI[method] === 'function') {
            console.log('WebView: 尝试调用方法:', method);
            result = await realAPI[method](channelId);
            break;
          }
        }
        
        if (result) {
          console.log('WebView: 真实API加入频道成功:', result);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: '${WebViewMessageType.JOIN_CHANNEL_RESULT}',
            data: {
              channelId,
              success: true,
              error: null,
              method: 'real-api'
            }
          }));
          return true;
        }
      } catch (error) {
        console.error('WebView: 真实API加入频道失败:', error);
      }
    }
    
    // 如果真实API不可用，尝试使用GramJS
    if (!window.TelegramAPI || !window.TelegramAPI.isGramJSAvailable()) {
      console.log('WebView: GramJS不可用，无法使用API加入频道');
      return false;
    }
    
    try {
      const result = await window.TelegramAPI.joinChannel(channelId);
      console.log('WebView: GramJS加入频道成功:', result);
      
      // 通知React Native
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: '${WebViewMessageType.JOIN_CHANNEL_RESULT}',
        data: {
          channelId,
          success: true,
          error: null,
          method: 'gramjs-api'
        }
      }));
      
      return true;
    } catch (error) {
      console.error('WebView: GramJS加入频道失败:', error);
      
      // 通知React Native
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: '${WebViewMessageType.JOIN_CHANNEL_RESULT}',
        data: {
          channelId,
          success: false,
          error: error.message || 'API加入频道失败',
          method: 'gramjs-api'
        }
      }));
      
      return false;
    }
  };
  
})();
true; // note: this is to ensure the script evaluates to true and completes
`; 