/*
 * @Author: baoJT
 * @Date: 2025-01-13 02:35:27
 * @LastEditTime: 2025-01-15 23:52:06
 */
import { useCallback, useEffect, useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import type { VersionInfo } from '@onekeyhq/shared/src/type/version';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backgroundApiProxy from '@onekeyhq/kit/src/background/instance/backgroundApiProxy';
import { appLocale } from '@onekeyhq/shared/src/locale/appLocale';
import { CUSTOM_NETWORK_URL } from '@onekeyhq/shared/src/config/appConfig';
const appVersion = DeviceInfo.getVersion();
const IGNORE_VERSION_KEY = 'IGNORE_VERSION_KEY';
// 语言代码映射表
const LANGUAGE_CODE_MAP: Record<string, string> = {
  'en': '1', // 英语
  'zh-CN': '2', // 简体中文
  'zh-HK': '3', // 繁体中文
  'ja': '4', // 日本语
  'ko': '5', // 韩文
  'bn': '6', // 孟加拉语
  'de': '7', // 德语
  'es': '8', // 西班牙语
  'fr': '9', // 法语
  'hi': '10', // 印地语
  'id': '11', // 印尼语
  'pt': '12', // 葡萄牙语
  'pt-BR': '13', // 巴西葡萄牙语
  'ru': '14', // 俄语
  'th': '15', // 泰语
  'uk': '16', // 乌克兰语
  'vi': '17', // 越南语
};

export const useVersionCheck = () => {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [ignoredVersion, setIgnoredVersion] = useState<string | null>(null);

  // 获取已忽略的版本号
  useEffect(() => {
    void AsyncStorage.getItem(IGNORE_VERSION_KEY).then((version) => {
      setIgnoredVersion(version);
    });
  }, []);

  const checkUpdate = useCallback(async () => {
    try {
      // 使用 appLocale 获取当前语言
      const currentLocale =
        await backgroundApiProxy.serviceSetting.getCurrentLocale();

      const langCode = LANGUAGE_CODE_MAP[currentLocale] || '1'; // 默认使用英语
      const params = new URLSearchParams({
        version_no: appVersion || '1.0.0',
        lang: langCode, // 添加语言参数
      });
      console.log(params.toString(), 'params.toString()>>')

      const response = await fetch(
        `${CUSTOM_NETWORK_URL}/api/bus/Version`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        }
      );
      const json = await response.json();
      console.log(json,appVersion,'responseresponseresponseresponse')
      if (json.code === 200 && json.data.status === 1) {
        const currentVersion = appVersion;
        const newVersion = json.data.data.newversion;
        // 只有当新版本大于当前版本，且不是被忽略的版本时才设置更新信息
        if (newVersion > currentVersion && newVersion !== ignoredVersion) {
          setVersionInfo(json.data.data);
        }
      }
    } catch (error) {
      console.error('检查更新失败:', error);
    }
  }, [ignoredVersion]);

  // 提供一个方法来设置忽略版本
  const ignoreVersion = useCallback(async (version: string) => {
    await AsyncStorage.setItem(IGNORE_VERSION_KEY, version);
    setIgnoredVersion(version);
    setVersionInfo(null);
  }, []);

  useEffect(() => {
    void checkUpdate();
  }, [checkUpdate]);

  return { versionInfo, ignoreVersion };
};