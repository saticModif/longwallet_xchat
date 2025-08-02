import { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import type {
  IKeyOfIcons,
  IPageScreenProps,
  IXStackProps,
} from '@onekeyhq/components';
import {
  Anchor,
  Divider,
  Group,
  Heading,
  Icon,
  IconButton,
  Image,
  LinearGradient,
  Page,
  SizableText,
  Spinner,
  Stack,
  ThemeableStack,
  View,
  XStack,
  useSafeAreaInsets,
  Button,
} from '@onekeyhq/components';
import { MultipleClickStack } from '@onekeyhq/kit/src/components/MultipleClickStack';
import { useHelpLink } from '@onekeyhq/kit/src/hooks/useHelpLink';
import { ETranslations } from '@onekeyhq/shared/src/locale';
import { defaultLogger } from '@onekeyhq/shared/src/logger/logger';
import platformEnv from '@onekeyhq/shared/src/platformEnv';
import type { IOnboardingParamList } from '@onekeyhq/shared/src/routes';
import {
  EModalRoutes,
  EOnboardingPages,
  ERootRoutes,
} from '@onekeyhq/shared/src/routes';
import { openUrlExternal } from '@onekeyhq/shared/src/utils/openUrlUtils';

import backgroundApiProxy from '../../../background/instance/backgroundApiProxy';
import useAppNavigation from '../../../hooks/useAppNavigation';

import type { FormatXMLElementFn } from 'intl-messageformat';

type IActionsGroupItem = {
  iconName: IKeyOfIcons;
  label: string;
  primary?: boolean;
  isLoading?: boolean;
} & IXStackProps;

type IActionsProp = {
  items: IActionsGroupItem[];
};

function ActionsGroup({ items }: IActionsProp) {
  return (
    <Group
      borderRadius="$3"
      $gtMd={{
        borderRadius: '$2',
      }}
      separator={<Divider />}
    >
      {items.map((item: IActionsGroupItem, index) => (
        <Group.Item key={index}>
          <XStack
            flexDirection="row"
            py="$3.5"
            px="$4"
            bg={item.primary ? '$bgPrimary' : '$bgStrong'}
            $gtMd={{
              py: '$2',
            }}
            hoverStyle={{
              bg: item.primary ? '$bgPrimaryHover' : '$bgStrongHover',
            }}
            pressStyle={{
              bg: item.primary ? '$bgPrimaryActive' : '$bgStrongActive',
            }}
            focusVisibleStyle={{
              outlineColor: '$focusRing',
              outlineStyle: 'solid',
              outlineWidth: 2,
            }}
            focusable
            userSelect="none"
            borderCurve="continuous"
            onPress={item.onPress}
            testID={item.testID}
          >
            <Icon
              name={item.iconName}
              color={item.primary ? '$iconInverse' : '$icon'}
            />
            <SizableText
              pl="$3"
              size="$bodyLgMedium"
              color={item.primary ? '$textInverse' : '$text'}
            >
              {item.label}
            </SizableText>
            {item?.isLoading ? (
              <XStack ml="$2">
                <Spinner />
              </XStack>
            ) : null}
          </XStack>
        </Group.Item>
      ))}
    </Group>
  );
}

export function GetStarted({
  route,
}: IPageScreenProps<IOnboardingParamList, EOnboardingPages.GetStarted>) {
  const navigation = useAppNavigation();
  const intl = useIntl();
  const { top } = useSafeAreaInsets();
  let { showCloseButton } = route.params || {};
  if (process.env.NODE_ENV !== 'production') {
    showCloseButton = true;
  }

  const handleCreateWalletPress = async () => {
    await backgroundApiProxy.servicePassword.promptPasswordVerify();
    navigation.push(EOnboardingPages.BeforeShowRecoveryPhrase);
    defaultLogger.account.wallet.onboard({ onboardMethod: 'createWallet' });
  };

  const handleImportWalletPress = async () => {
    navigation.push(EOnboardingPages.ImportWalletOptions);
    defaultLogger.account.wallet.onboard({ onboardMethod: 'importWallet' });
  };

  const handleConnectHardwareWallet = async () => {
    navigation.push(EOnboardingPages.ConnectYourDevice);
    defaultLogger.account.wallet.onboard({ onboardMethod: 'connectHWWallet' });
  };

  const handleConnectWalletPress = async () => {
    navigation.push(EOnboardingPages.ConnectWalletSelectNetworks);
    defaultLogger.account.wallet.onboard({
      onboardMethod: 'connect3rdPartyWallet',
    });
  };

  const handleTrackAnyAddressPress = async () => {
    navigation.push(EOnboardingPages.ImportAddress);
  };

  const termsLink = useHelpLink({ path: 'articles/360002014776' });
  const privacyLink = useHelpLink({ path: 'articles/360002003315' });

  const isDappMode = platformEnv.isWebDappMode;

  const renderAnchor = useCallback(
    (link: string, chunks: string[]) =>
      // Due to bugs such as the onPress event of the Text component,
      //  only the last of multiple Anchors will take effect.
      platformEnv.isNative ? (
        <View
          onPress={() => {
            openUrlExternal(link);
          }}
        >
          <SizableText
            left={platformEnv.isNativeIOS ? 20.5 : undefined}
            top={platformEnv.isNativeIOS ? 2.5 : 3.5}
            size="$bodySm"
          >
            {chunks[0]}
          </SizableText>
        </View>
      ) : (
        <Anchor
          href={link}
          size="$bodySm"
          color="$text"
          target="_blank"
          textDecorationLine="none"
        >
          {chunks}
        </Anchor>
      ),
    [],
  );

  const renderTermsTag: FormatXMLElementFn<string, any> = useCallback(
    (chunks: string[]) => renderAnchor(termsLink, chunks),
    [renderAnchor, termsLink],
  );

  const renderPrivacyTag: FormatXMLElementFn<string, any> = useCallback(
    (chunks: string[]) => renderAnchor(privacyLink, chunks),
    [privacyLink, renderAnchor],
  );

  return (
    <Page safeAreaEnabled>
      <Page.Header headerShown={false} />
      <Page.Body>
        <Stack flex={1}>
          <ThemeableStack
            fullscreen
            alignItems="center"
            justifyContent="center"
          >
            <MultipleClickStack
              onPress={() => {
                void navigation.popStack();
              }}
            >
              <Image
                w={300}
                h={300}
                source={require('@onekeyhq/kit/assets/start.png')}
              />
            </MultipleClickStack>
            <Stack px="$5" pt="$5" mt="$6">
              <Stack zIndex={1}>
                <Heading size="$headingSm" textAlign="center">
                  {intl.formatMessage({
                    id: ETranslations.onboarding_welcome_message,
                  })}
                </Heading>
                <SizableText size="$headingSm" textAlign="center" mt="$2">
                  {intl.formatMessage({
                    id: ETranslations.onboarding_welcome_description,
                  })}
                </SizableText>
              </Stack>
            </Stack>
            <Stack
              py="$16"
              px="$5"
              gap="$6"
              $gtMd={{
                maxWidth: '$96',
              }}
              alignSelf="center"
              width="100%"
            >
              <Button variant="gradient" onPress={handleCreateWalletPress}>
                {intl.formatMessage({
                  id: ETranslations.global_create_wallet,
                })}
              </Button>
              <Button variant="outline" onPress={handleImportWalletPress}>
                {intl.formatMessage({
                  id: ETranslations.global_import_wallet,
                })}
              </Button>
            </Stack>
          </ThemeableStack>
        </Stack>
        {showCloseButton ? (
          <View position="absolute" left="$5" top={top || '$5'}>
            <Page.Close>
              <IconButton icon="CrossedLargeOutline" variant="tertiary" />
            </Page.Close>
          </View>
        ) : null}
      </Page.Body>
    </Page>
  );
}

export default GetStarted;

export const openOnBoardingFromExt = () => {
  // eslint-disable-next-line unicorn/prefer-global-this
  if (platformEnv.isExtension && typeof window !== 'undefined') {
    return globalThis.location.hash.includes('fromExt=true');
  }
  return false;
};

export const useToOnBoardingPage = () => {
  const navigation = useAppNavigation();
  return useMemo(
    () =>
      async ({
        isFullModal = false,
        params,
      }: {
        isFullModal?: boolean;
        params?: IOnboardingParamList[EOnboardingPages.GetStarted];
      } = {}) => {
        if (platformEnv.isExtensionUiPopup) {
          await backgroundApiProxy.serviceApp.openExtensionExpandTab({
            routes: [
              isFullModal ? ERootRoutes.iOSFullScreen : ERootRoutes.Modal,
              EModalRoutes.OnboardingModal,
              EOnboardingPages.GetStarted,
            ],
            params: {
              ...params,
              fromExt: true,
            },
          });
        } else if (params) {
          navigation[isFullModal ? 'pushFullModal' : 'pushModal'](
            EModalRoutes.OnboardingModal,
            {
              screen: EOnboardingPages.GetStarted,
              params,
            },
          );
        }
        else {
          navigation[isFullModal ? 'pushFullModal' : 'pushModal'](
            EModalRoutes.OnboardingModal,
            {
              // screen: EOnboardingPages.GetStarted,
              screen: EOnboardingPages.OnboardingCarousel,
              params,
            },
          );
        }
      },
    [navigation],
  );
};
