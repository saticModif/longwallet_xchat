import { useRoute } from '@react-navigation/core';
import { useIntl } from 'react-intl';

import { AccountSelectorProviderMirror } from '@onekeyhq/kit/src/components/AccountSelector';
import { ETranslations } from '@onekeyhq/shared/src/locale';
import type {
  EModalFiatCryptoRoutes,
  IModalFiatCryptoParamList,
} from '@onekeyhq/shared/src/routes';
import { EAccountSelectorSceneName } from '@onekeyhq/shared/types';

import { HomeTokenListProviderMirror } from '../../../Home/components/HomeTokenListProvider/HomeTokenListProviderMirror';
import SellOrBuy from '../../components/SellOrBuy';
import { TokenDataContainer } from '../../components/TokenDataContainer';
import backgroundApiProxy from '../../../../background/instance/backgroundApiProxy';
import { useSelectedAccount } from '../../../../states/jotai/contexts/accountSelector';

import type { RouteProp } from '@react-navigation/core';
import {
  Stack,
  SectionList,
  Divider,
  Image,
  SizableText,
} from '@onekeyhq/components';
import { ListItem } from '../../../../components/ListItem';

const BuyPage = () => {
  const route =
    useRoute<
      RouteProp<IModalFiatCryptoParamList, EModalFiatCryptoRoutes.BuyModal>
    >();
  const { networkId, accountId, tokens = [], map = {} } = route.params;
  const intl = useIntl();
  // const { selectedAccount } = useSelectedAccount({ num: 0 });

  const options = [
    {
      data: [
        {
          title: intl.formatMessage({
            id: ETranslations.wallet_details_export_mnemonic,
          }),
          onPress: async () => {},
          testID: 'wallet_details_export_mnemonic',
        },
        {
          title: intl.formatMessage({ id: ETranslations.wallet_details_export_private_key }),
          onPress: () => {},
          testID: 'wallet_details_export_private_key',
        },
        {
          title: intl.formatMessage({ id: ETranslations.wallet_details_gesture_passwords }),
          onPress: () => {},
          testID: 'wallet_details_gesture_passwords',
        },
        {
          title: intl.formatMessage({ id: ETranslations.wallet_details_change_password }),
          onPress: () => {},
          testID: 'wallet_details_change_password',
        },
        {
          title: intl.formatMessage({ id: ETranslations.wallet_details_reset_password }),
          onPress: () => {},
          testID: 'wallet_details_reset_password',
        },
        {
          title: intl.formatMessage({ id: ETranslations.wallet_details_password_tip }),
          onPress: () => {},
          testID: 'wallet_details_password_tip',
        },
      ],
    },
  ];
  return (
    <AccountSelectorProviderMirror
      config={{
        sceneName: EAccountSelectorSceneName.home,
        sceneUrl: '',
      }}
      enabledNum={[0]}
    >
      <HomeTokenListProviderMirror>
        <TokenDataContainer
          networkId={networkId}
          accountId={accountId}
          initialMap={map}
          initialTokens={tokens}
        >
          <SellOrBuy
            title={intl.formatMessage({ id: ETranslations.global_buy })}
            type="buy"
            networkId={networkId}
            accountId={accountId}
          />
        </TokenDataContainer>
        {/* {options.map(({ sectionTitle, data }, index) => (
          <Stack
            key={sectionTitle || index}
            // {...(index !== 0 && { mt: '$5' })}
            // {...(index === options.length - 1 && { pb: '$5' })}
          >
            {sectionTitle ? (
              <SectionList.SectionHeader title={sectionTitle} />
            ) : null}
            {index !== 0 ? <Divider m="$5" /> : null}
            {data.map(
              ({
                title,
                onPress,
                testID,
              }) => (
                <ListItem
                  key={title}
                  onPress={onPress}
                  drillIn
                >
                  <ListItem.Text
                    userSelect="none"
                    flex={1}
                    primary={title}
                  />
                </ListItem>
              ),
            )}
          </Stack>
        ))} */}
      </HomeTokenListProviderMirror>
    </AccountSelectorProviderMirror>
  );
};

export default BuyPage;
