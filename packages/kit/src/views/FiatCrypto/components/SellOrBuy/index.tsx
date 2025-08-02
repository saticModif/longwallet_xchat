import type { PropsWithChildren } from 'react';
import { useCallback, useMemo } from 'react';

import BigNumber from 'bignumber.js';

import type { IPageNavigationProp } from '@onekeyhq/components';
import { Page, Spinner, Stack, Dialog } from '@onekeyhq/components';
import backgroundApiProxy from '@onekeyhq/kit/src/background/instance/backgroundApiProxy';
import { useAccountData } from '@onekeyhq/kit/src/hooks/useAccountData';
import useAppNavigation from '@onekeyhq/kit/src/hooks/useAppNavigation';
import { withBrowserProvider } from '@onekeyhq/kit/src/views/Discovery/pages/Browser/WithBrowserProvider';
import { TokenList } from '@onekeyhq/kit/src/views/FiatCrypto/components/TokenList';
import { useGetTokensList } from '@onekeyhq/kit/src/views/FiatCrypto/hooks';
import type {
  EModalFiatCryptoRoutes,
  IModalFiatCryptoParamList,
} from '@onekeyhq/shared/src/routes';
import accountUtils from '@onekeyhq/shared/src/utils/accountUtils';
import networkUtils from '@onekeyhq/shared/src/utils/networkUtils';
import { openUrlExternal } from '@onekeyhq/shared/src/utils/openUrlUtils';
import type {
  IFiatCryptoToken,
  IFiatCryptoType,
} from '@onekeyhq/shared/types/fiatCrypto';

import { NetworkContainer } from '../NetworkContainer';
import { useTokenDataContext } from '../TokenDataContainer';
import { useIntl } from 'react-intl';
import { ETranslations } from '@onekeyhq/shared/src/locale';
import { ListItem } from '../../../../components/ListItem';
import { useSelectedAccount } from '../../../../states/jotai/contexts/accountSelector';
import { usePromiseResult } from '../../../../hooks/usePromiseResult';
import { EReasonForNeedPassword } from '@onekeyhq/shared/types/setting';
import PasswordUpdateContainer from '../../../../components/Password/container/PasswordUpdateContainer';

type ISellOrBuyProps = {
  title: string;
  type: IFiatCryptoType;
  networkId: string;
  accountId?: string;
};

const SellOrBuy = ({ title, type, networkId, accountId }: ISellOrBuyProps) => {
  const appNavigation =
    useAppNavigation<
      IPageNavigationProp<
        IModalFiatCryptoParamList,
        EModalFiatCryptoRoutes.BuyModal
      >
    >();
  const { result: tokens, isLoading } = useGetTokensList({
    networkId,
    accountId,
    type,
  });
  const { getTokenFiatValue } = useTokenDataContext();
  const { account } = useAccountData({ networkId, accountId });

  const fiatValueTokens = useMemo(() => {
    if (!networkUtils.isAllNetwork({ networkId })) {
      return tokens;
    }
    let result = tokens.map((token) => ({
      ...token,
      fiatValue: getTokenFiatValue({
        networkId: token.networkId,
        tokenAddress: token.address.toLowerCase(),
      })?.fiatValue,
      balanceParsed: getTokenFiatValue({
        networkId: token.networkId,
        tokenAddress: token.address.toLowerCase(),
      })?.balanceParsed,
    }));
    if (type === 'sell') {
      result = result.filter(
        (o) => o.balanceParsed && Number(o.balanceParsed) !== 0,
      );
    }
    if (account && accountUtils.isOthersAccount({ accountId: account.id })) {
      result = result.filter((o) =>
        accountUtils.isAccountCompatibleWithNetwork({
          account,
          networkId: o.networkId,
        }),
      );
    }
    return result.sort((a, b) => {
      const num1 = a.fiatValue ?? '0';
      const num2 = b.fiatValue ?? '0';
      return BigNumber(num1).gt(num2) ? -1 : 1;
    });
  }, [tokens, getTokenFiatValue, networkId, type, account]);

  const networkIds = useMemo(
    () => Array.from(new Set(fiatValueTokens.map((o) => o.networkId))),
    [fiatValueTokens],
  );

  const intl = useIntl();
  const { selectedAccount } = useSelectedAccount({ num: 0 });
  const isOthers = selectedAccount?.focusedWallet === '$$others';
  const isOthersWallet = Boolean(
    selectedAccount?.focusedWallet &&
      accountUtils.isOthersWallet({
        walletId: selectedAccount?.focusedWallet,
      }),
  );
  const isOthersUniversal = isOthers || isOthersWallet;
  // const account = useMemo(
  //   () => (isOthersUniversal ? (item as IDBAccount) : undefined),
  //   [isOthersUniversal, item],
  // );

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
          title: intl.formatMessage({
            id: ETranslations.wallet_details_export_private_key,
          }),
          onPress: () => {},
          testID: 'wallet_details_export_private_key',
        },
        {
          title: intl.formatMessage({
            id: ETranslations.wallet_details_gesture_passwords,
          }),
          onPress: () => {},
          testID: 'wallet_details_gesture_passwords',
        },
        {
          title: intl.formatMessage({
            id: ETranslations.wallet_details_change_password,
          }),
          onPress: async () => {
            const oldEncodedPassword =
              await backgroundApiProxy.servicePassword.promptPasswordVerify({
                reason: EReasonForNeedPassword.Security,
              });
            const dialog = Dialog.show({
              title: intl.formatMessage({
                id: ETranslations.wallet_details_change_password,
              }),
              renderContent: (
                <PasswordUpdateContainer
                  oldEncodedPassword={oldEncodedPassword.password}
                  onUpdateRes={async (data) => {
                    if (data) {
                      await dialog.close();
                    }
                  }}
                />
              ),
              showFooter: false,
            });
          },
          testID: 'wallet_details_change_password',
        },
        {
          title: intl.formatMessage({
            id: ETranslations.wallet_details_reset_password,
          }),
          onPress: () => {},
          testID: 'wallet_details_reset_password',
        },
        {
          title: intl.formatMessage({
            id: ETranslations.wallet_details_password_tip,
          }),
          onPress: () => {},
          testID: 'wallet_details_password_tip',
        },
      ],
    },
  ];

  return (
    <Page safeAreaEnabled={false}>
      {/* <Page.Header title={title} /> */}
      <Page.Body>
        {/* <NetworkContainer networkIds={networkIds}>
          {isLoading ? (
            <Stack minHeight={300} justifyContent="center" alignItems="center">
              <Spinner size="large" />
            </Stack>
          ) : (
            <TokenList items={fiatValueTokens} onPress={onPress} />
          )}
        </NetworkContainer> */}
        {options.map(({ sectionTitle, data }, index) => (
          <Stack
            key={sectionTitle || index}
            // {...(index !== 0 && { mt: '$5' })}
            // {...(index === options.length - 1 && { pb: '$5' })}
          >
            {data.map(({ title, onPress, testID }) => (
              <ListItem key={title} onPress={onPress} drillIn>
                <ListItem.Text userSelect="none" flex={1} primary={title} />
              </ListItem>
            ))}
          </Stack>
        ))}
      </Page.Body>
    </Page>
  );
};

export default withBrowserProvider<PropsWithChildren<ISellOrBuyProps>>(
  SellOrBuy,
);
