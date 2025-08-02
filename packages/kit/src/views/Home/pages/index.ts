/*
 * @Author: baoJT
 * @Date: 2025-01-13 02:33:27
 * @LastEditTime: 2025-01-18 10:36:09
 */
import { useCallback, useEffect, useState } from 'react';
import platformEnv from '@onekeyhq/shared/src/platformEnv';
import type { VersionInfo } from '@onekeyhq/shared/src/type/version';
import { CUSTOM_NETWORK_URL } from '@onekeyhq/shared/src/config/appConfig';
export const useVersionCheck = () => {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);

  const checkUpdate = useCallback(async () => {
    try {
      const response = await fetch(`${CUSTOM_NETWORK_URL}/api/bus/Version`);
      const json = await response.json();
      if (json.code === 200 && json.data.status === 1) {
        const currentVersion = platformEnv.version;
        const newVersion = json.data.data.newversion;
        if (newVersion > currentVersion) {
          setVersionInfo(json.data.data);
        }
      }
    } catch (error) {
      console.error('检查更新失败:', error);
    }
  }, []);

  useEffect(() => {
    void checkUpdate();
  }, [checkUpdate]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return versionInfo;
};