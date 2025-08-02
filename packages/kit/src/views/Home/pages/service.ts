import axios from 'axios';
import backgroundApiProxy from '@onekeyhq/kit/src/background/instance/backgroundApiProxy';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import accountUtils from '@onekeyhq/shared/src/utils/accountUtils';
import { useCallback, useState, useEffect } from 'react'
import { defaultLogger } from '@onekeyhq/shared/src/logger/logger';
import useDappApproveAction from '@onekeyhq/kit/src/hooks/useDappApproveAction';
import useDappQuery from '@onekeyhq/kit/src/hooks/useDappQuery';
import {
  useAccountSelectorActions,
  useActiveAccount,
} from '@onekeyhq/kit/src/states/jotai/contexts/accountSelector';
// import { EditableChainSelectorContext } from './context';
import platformEnv from '@onekeyhq/shared/src/platformEnv';
import { CUSTOM_NETWORK_URL } from '@onekeyhq/shared/src/config/appConfig';
interface INetworkResponse {
  code: number;
  msg: string;
  time: string;
  data: {
    network_name: string;
    rpc_url: string;
    chain_id: string;
    symbol: string;
    block_browser_url: string;
    image: string;
  }[];
}
// 添加置顶网络的函数
const pinNetworkToTop = async (networkId: string) => {
  try {
    // 获取当前置顶的网络列表
    const pinnedNetworkIds = await backgroundApiProxy.serviceNetwork.getNetworkSelectorPinnedNetworkIds();

    // 如果该网络已经在置顶列表中，则不需要操作
    if (pinnedNetworkIds.includes(networkId)) {
      return;
    }

    // 将新网络添加到置顶列表开头
    const newPinnedNetworkIds = [networkId, ...pinnedNetworkIds];

    // 更新置顶列表
    await backgroundApiProxy.serviceNetwork.setNetworkSelectorPinnedNetworkIds({
      networkIds: newPinnedNetworkIds,
    });

    console.log(`Network ${networkId} pinned to top successfully`);
  } catch (error) {
    console.error('Failed to pin network to top:', error);
  }
};
const LANGUAGE_INITIALIZED_KEY = '@onekey_language_initializedsec';
export function useInitLanguage() {
  const { getItem, setItem } = useAsyncStorage(LANGUAGE_INITIALIZED_KEY);
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);

  // 检查是否已初始化
  useEffect(() => {
    const checkInitialized = async () => {
      try {
        const value = await getItem();
        setIsInitialized(value === 'true');
      } catch (error) {
        console.error('Failed to check language initialization status:', error);
        setIsInitialized(false);
      }
    };
    void checkInitialized();
  }, [getItem]);

  const initLanguage = useCallback(async () => {
    if (isInitialized) {
      console.log('Language already initialized, skipping...');
      return true;
    }

    try {
      await backgroundApiProxy.serviceSetting.setLocale('en-US');
      
      if (platformEnv.isDesktop) {
        globalThis.desktopApi.changeLanguage('en-US');
      }
      
      await setItem('true');
      setIsInitialized(true);
      
      setTimeout(() => {
        // backgroundApiProxy.serviceApp.restartApp();
      }, 0);

      return true;
    } catch (error) {
      console.error('Failed to initialize language:', error);
      throw error;
    }
  }, [isInitialized, setItem]);

  // 重置初始化状态的方法（用于测试或手动重置）
  const resetLanguageInitialization = useCallback(async () => {
    try {
      await setItem('false');
      setIsInitialized(false);
      console.log('Language initialization status reset');
    } catch (error) {
      console.error('Failed to reset language initialization status:', error);
    }
  }, [setItem]);

  return {
    initLanguage,
    resetLanguageInitialization,
    isInitialized,
  };
}
export async function checkVersion() {
  const response = await axios.get(`${CUSTOM_NETWORK_URL}/api/bus/Version`)
  const data = response.data.data;
  return data;
}
const NETWORK_INITIALIZED_KEY = '@onekey_network_initialized';

export function useAutoAddNetwork() {
  const { getItem, setItem } = useAsyncStorage(NETWORK_INITIALIZED_KEY);
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);


  const { $sourceInfo, networkInfo } = useDappQuery<{
    networkInfo: IAddEthereumChainParameter;
  }>();

  const dappApprove = useDappApproveAction({
    id: $sourceInfo?.id ?? '',
    closeWindowAfterResolved: true,
  });
  const actions = useAccountSelectorActions();

  // 检查是否已初始化
  useEffect(() => {
    const checkInitialized = async () => {
      try {
        const value = await getItem();
        setIsInitialized(value === 'true');
      } catch (error) {
        console.error('Failed to check network initialization status:', error);
        setIsInitialized(false);
      }
    };
    void checkInitialized();
  }, [getItem]);

  const addNetwork = useCallback(async () => {
    // 如果已经初始化过，直接返回
    if (isInitialized) {
      console.log('Networks already initialized, skipping...');
      return true;
    }
    try {
      // 从接口获取网络配置
      const response = await axios.get<INetworkResponse>(
        `${CUSTOM_NETWORK_URL}/api/bus/Network`
      );

      if (response.data.code !== 200) {
        throw new Error(response.data.msg || '获取网络配置失败');
      }
      console.log(response.data.data, ">>>response.data.data")
      const networks = response.data.data;
      let addedCount = 0;
      let finalChainId = 0;
      // 遍历并添加所有网络
      for (const network of networks) {
        console.log(network, ">>>network")
        // 构建网络参数
        finalChainId = parseInt(network.chain_id, 10);
        const params = {
          networkName: network.network_name,
          rpcUrl: network.rpc_url,
          chainId: finalChainId,
          symbol: network.symbol,
          blockExplorerUrl: network.block_browser_url,
          logoURI: network.image
        };

        try {
          // 添加或更新自定义网络
          await backgroundApiProxy.serviceCustomRpc.upsertCustomNetwork(params);
          console.log(`Network added successfully: ${network.network_name}`);
          addedCount += 1;
        } catch (error) {
          console.error(`Failed to add network ${network.network_name}:`, error);
        }
      }

      // 只有当至少添加了一个网络时，才标记为已初始化
      if (addedCount > 0) {
        const networkId = accountUtils.buildCustomEvmNetworkId({
          chainId: finalChainId.toString(),
        });
        const network = await backgroundApiProxy.serviceNetwork.getNetwork({
          networkId,
        });
        void dappApprove.resolve({ result: network });
        // 添加成功了之后，自动将添加的网络置顶
        await pinNetworkToTop(networkId);
        setTimeout(() => {
          // void actions.current.updateSelectedAccountNetwork({
          //   num: 0,
          //   networkId: network.id,
          // });
          defaultLogger.account.wallet.customNetworkAdded({
            chainID: String(finalChainId),
          });
        }, 500);

        await setItem('true');
        setIsInitialized(true);
        console.log('Networks initialized successfully');
      }

      return true;
    } catch (error) {
      console.error('Auto add networks failed:', error);
      throw error;
    }
  }, [isInitialized, setItem]);

  // 重置初始化状态的方法（用于测试或手动重置）
  const resetNetworkInitialization = useCallback(async () => {
    try {
      await setItem('false');
      setIsInitialized(false);
      console.log('Network initialization status reset');
    } catch (error) {
      console.error('Failed to reset network initialization status:', error);
    }
  }, [setItem]);

  return {
    addNetwork,
    resetNetworkInitialization,
    isInitialized
  };
}