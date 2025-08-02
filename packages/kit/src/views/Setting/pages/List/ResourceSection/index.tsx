import { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { Badge } from '@onekeyhq/components';
import { ListItem } from '@onekeyhq/kit/src/components/ListItem';
import { Section } from '@onekeyhq/kit/src/components/Section';
import { useAppUpdateInfo } from '@onekeyhq/kit/src/components/UpdateReminder/hooks';
import useAppNavigation from '@onekeyhq/kit/src/hooks/useAppNavigation';
import { useHelpLink } from '@onekeyhq/kit/src/hooks/useHelpLink';
import { ETranslations } from '@onekeyhq/shared/src/locale';
import platformEnv from '@onekeyhq/shared/src/platformEnv';
import { EModalRoutes } from '@onekeyhq/shared/src/routes';
import { EModalShortcutsRoutes } from '@onekeyhq/shared/src/routes/shortcuts';

import { UrlExternalListItem } from '../../../components/UrlExternalListItem';

import { CustomNetworkConfigItem } from './CustomNetworkConfigItem';
import { RateAppItem } from './RateAppItem';
import { StateLogsItem } from './StateLogsItem';

function ListVersionItem() {
  const intl = useIntl();
  const appUpdateInfo = useAppUpdateInfo();
  const handleToUpdatePreviewPage = useCallback(() => {
    appUpdateInfo.toUpdatePreviewPage();
  }, [appUpdateInfo]);
  return (
    <ListItem
      onPress={handleToUpdatePreviewPage}
      icon="InfoCircleOutline"
      title={intl.formatMessage({
        id: ETranslations.settings_app_update_available,
      })}
      drillIn
    />
  )
}

function ListShortcutsItem() {
  const intl = useIntl();
  const navigation = useAppNavigation();
  const toShortcutsPage = useCallback(() => {
    navigation.pushModal(EModalRoutes.ShortcutsModal, {
      screen: EModalShortcutsRoutes.ShortcutsPreview,
    });
  }, [navigation]);
  return <ListItem
    onPress={toShortcutsPage}
    icon="PeopleBehindOutline"
    title={intl.formatMessage({ id: ETranslations.settings_shortcuts })}
    drillIn
  />
}

export const ResourceSection = () => {
  const userAgreementUrl = useHelpLink({ path: 'articles/360002014776' });
  const privacyPolicyUrl = useHelpLink({ path: 'articles/360002003315' });
  const requestUrl = useHelpLink({ path: 'requests/new' });
  const helpCenterUrl = useHelpLink({ path: '' });
  const intl = useIntl();

  return (
    <Section
      title={intl.formatMessage({ id: ETranslations.settings_resources })}
    >
      <ListShortcutsItem />
      <ListVersionItem />
      {/* <UrlExternalListItem
        icon="HelpSupportOutline"
        title={intl.formatMessage({ id: ETranslations.settings_help_center })}
        url={helpCenterUrl}
        drillIn
      /> */}
      {/* <UrlExternalListItem
        icon="EditOutline"
        title={intl.formatMessage({
          id: ETranslations.settings_submit_request,
        })}
        url={requestUrl}
        drillIn
      /> */}
      {/* <RateAppItem /> */}
      {/* <UrlExternalListItem
        icon="PeopleOutline"
        title={intl.formatMessage({
          id: ETranslations.settings_user_agreement,
        })}
        url={userAgreementUrl}
        drillIn
      /> */}
      {/* <UrlExternalListItem
        icon="FileTextOutline"
        title={intl.formatMessage({
          id: ETranslations.settings_privacy_policy,
        })}
        url={privacyPolicyUrl}
        drillIn
      /> */}
      {/* <CustomNetworkConfigItem />
      <StateLogsItem /> */}
    </Section>
  );
};
