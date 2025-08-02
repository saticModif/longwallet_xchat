/*
 * @Author: baoJT
 * @Date: 2025-01-12 02:00:12
 * @LastEditTime: 2025-01-19 01:18:22
 */
import { UNSTABLE_usePreventRemove as usePreventRemove } from '@react-navigation/core';
import { useIntl } from 'react-intl';

import type { IPageScreenProps } from '@onekeyhq/components';
import {
  Badge,
  Heading,
  Icon,
  Markdown,
  Page,
  ScrollView,
  SizableText,
  XStack,
  YStack,
  Image,
} from '@onekeyhq/components';
import { ETranslations } from '@onekeyhq/shared/src/locale';
import platformEnv from '@onekeyhq/shared/src/platformEnv';
import type {
  EAppUpdateRoutes,
  IAppUpdatePagesParamList,
} from '@onekeyhq/shared/src/routes';

import { useAppChangeLog } from '../../../components/UpdateReminder/hooks';
import { UpdatePreviewActionButton } from '../components/UpdatePreviewActionButton';
import { ViewUpdateHistory } from '../components/ViewUpdateHistory';
import { CUSTOM_APP_NAME } from '@onekeyhq/shared/src/config/appConfig';
import DeviceInfo from 'react-native-device-info';
const ExtPluginText = platformEnv.isExtension
  ? () => {
    const intl = useIntl();
    return (
      <SizableText size="$bodyMd" color="$textSubdued">
        {intl.formatMessage({
          id: ETranslations.update_recommend_regular_check_and_update_plugin,
        })}
      </SizableText>
    );
  }
  : () => null;

function UpdatePreview({
  route,
}: IPageScreenProps<IAppUpdatePagesParamList, EAppUpdateRoutes.UpdatePreview>) {
  const intl = useIntl();
  const {
    latestVersion,
    isForceUpdate,
    autoClose = false,
  } = route.params || {};
  usePreventRemove(!!isForceUpdate, () => { });
  const changeLog = useAppChangeLog(latestVersion);
  const appVersion = DeviceInfo.getVersion();
  return (
    <Page>
      <Page.Header
        title={intl.formatMessage({ id: ETranslations.update_app_update })}
      />
      <Page.Body m="$5">
        {/* <YStack gap="$3">
          <Heading size="$heading2xl">
            {intl.formatMessage({ id: ETranslations.update_new_app_version })}
          </Heading>
          <ExtPluginText />
          <XStack gap="$2.5" alignItems="center">
            <Badge badgeType="default" badgeSize="lg">
              {platformEnv.version}
            </Badge>
            <Icon name="ArrowRightSolid" size="$4" />
            <Badge badgeType="info" badgeSize="lg">
              {latestVersion}
            </Badge>
          </XStack>
        </YStack>
        {changeLog ? (
          <ScrollView
            mt="$7"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{ pb: '$5' }}
          >
            <Markdown>{changeLog}</Markdown>
            <ViewUpdateHistory />
          </ScrollView>
        ) : null} */}
        <YStack mt="$10" alignItems='center' justifyContent='center' >
          <Image w={100} h={100} source={require('@onekeyhq/kit/assets/logo-decorated.png')} />
          <SizableText size="$headingXl" color="$textDefault" mt="$8">{CUSTOM_APP_NAME}</SizableText>
          <SizableText size="$bodyMd" color="$textSubdued" mt="$2">当前版本: {appVersion}</SizableText>
        </YStack>
      </Page.Body>
      {/* <UpdatePreviewActionButton autoClose={autoClose} /> */}
    </Page>
  );
}

export default UpdatePreview;
