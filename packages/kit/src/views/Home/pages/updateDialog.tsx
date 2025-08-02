/*
 * @Author: baoJT
 * @Date: 2025-01-13 02:19:55
 * @LastEditTime: 2025-01-15 00:08:55
 */
import { useCallback, useEffect } from 'react';
import { BackHandler, Linking } from 'react-native';
import { Dialog, Button, Stack } from '@onekeyhq/components';
import platformEnv from '@onekeyhq/shared/src/platformEnv';
import { useVersionCheck } from './hooks/userVersionCheck';
import { useIntl } from 'react-intl';
import { ETranslations } from '@onekeyhq/shared/src/locale';

export const UpdateDialog = () => {
  const { versionInfo, ignoreVersion } = useVersionCheck();
  const intl = useIntl();
  useEffect(() => {
    let dialogInstance: any;

    if (versionInfo) {
      const handleUpdate = () => {
        const downloadUrl = platformEnv.isNativeIOS
          ? versionInfo.ios_link
          : versionInfo.android_link;
        void Linking.openURL(downloadUrl);
      };

      // 强制更新时禁用返回按钮
      if (versionInfo.enforce === 1) {
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          () => true,
        );
        return () => backHandler.remove();
      }

      dialogInstance = Dialog.show({
        tone: 'gradient',
        title: versionInfo.title || '发现新版本',
        description: versionInfo.content,
        dismissOnOverlayPress: !versionInfo.enforce,
        // showFooter: true,
        showExitButton: !versionInfo.enforce,
        onConfirm: ({ close }) => {
          handleUpdate();
          if (!versionInfo.enforce) {
            void close();
          }
        },
        onCancel: async ({ close }) => {
          // 点击稍后再说时，记录当前版本号
          await ignoreVersion(versionInfo.newversion);
          void close();
        },
        // 定义确认按钮的渲染
        confirmButtonProps: {
          variant: "gradient"
        },
        // onConfirmText: '立即更新',
        showCancelButton: !versionInfo.enforce,
        onCancelText: intl.formatMessage({ id: ETranslations.global_later }),
      });
      // dialogInstance = Dialog.show({
      //   title: versionInfo.title || '发现新版本',
      //   description: versionInfo.content,
      //   showFooter: false, // 不显示默认的底部按钮
      //   dismissOnOverlayPress: !versionInfo.enforce,
      //   showExitButton: !versionInfo.enforce,
      //   renderContent: (
      //     <Stack space="$4" py="$4">
      //       <Button
      //         size="large"
      //         variant="gradient"
      //         onPress={() => {
      //           handleUpdate();
      //           if (!versionInfo.enforce) {
      //             void dialogInstance.close();
      //           }
      //         }}
      //       >
      //         立即更新
      //       </Button>
      //       {!versionInfo.enforce && (
      //         <Button
      //           size="large"
      //           tone="neutral"
      //           variant="secondary"
      //           onPress={async () => {
      //             await ignoreVersion(versionInfo.newversion);
      //             void dialogInstance.close();
      //           }}
      //         >
      //           稍后再说
      //         </Button>
      //       )}
      //     </Stack>
      //   ),
      // });
    }

    return () => {
      if (dialogInstance && !versionInfo?.enforce) {
        dialogInstance.close();
      }
    };
  }, [versionInfo, ignoreVersion]);

  return null;
};