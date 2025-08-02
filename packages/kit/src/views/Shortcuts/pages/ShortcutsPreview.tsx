import { useMemo, useEffect, useState } from 'react';

import { useIntl } from 'react-intl';
import { Dimensions, Platform } from 'react-native';

import { Page, Shortcut, Stack, QRCode, Image, Spinner, SizableText } from '@onekeyhq/components';
import { ListItem } from '@onekeyhq/kit/src/components/ListItem';
import { Section } from '@onekeyhq/kit/src/components/Section';
import { ETranslations } from '@onekeyhq/shared/src/locale';
import {
  EShortcutEvents,
  shortcutsMap,
} from '@onekeyhq/shared/src/shortcuts/shortcuts.enum';
import { shortcutsKeys } from '@onekeyhq/shared/src/shortcuts/shortcutsKeys.enum';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Svg, { Rect } from 'react-native-svg';
import { getBrandImage, versionService } from './service';

const { width, height } = Dimensions.get('window');

const sections = [
  {
    titleId: ETranslations.global_general,
    items: [
      {
        titleId: ETranslations.shortcuts_account_selector,
        shortcutKey: EShortcutEvents.AccountSelector,
      },
      {
        titleId: ETranslations.shortcuts_network_selector,
        shortcutKey: EShortcutEvents.NetworkSelector,
      },
      {
        titleId: ETranslations.settings_settings,
        keys: [shortcutsKeys.CmdOrCtrl, ','],
      },
      {
        titleIds: [
          ETranslations.shortcut_show_sidebar,
          ETranslations.shortcut_hide_sidebar,
        ],
        shortcutKey: EShortcutEvents.SideBar,
      },
      {
        titleId: ETranslations.shortcuts_go_to_wallet_tab,
        shortcutKey: EShortcutEvents.TabWallet,
      },
      {
        titleId: ETranslations.shortcuts_go_to_earn_tab,
        shortcutKey: EShortcutEvents.TabEarn,
      },
      {
        titleId: ETranslations.shortcuts_go_to_swap_tab,
        shortcutKey: EShortcutEvents.TabSwap,
      },
      {
        titleId: ETranslations.shortcuts_go_to_market_tab,
        shortcutKey: EShortcutEvents.TabMarket,
      },
      {
        titleId: ETranslations.shortcuts_go_to_browser_tab,
        shortcutKey: EShortcutEvents.TabBrowser,
      },
      {
        titleId: ETranslations.settings_lock_now,
        keys: [shortcutsKeys.CmdOrCtrl, shortcutsKeys.Shift, 'L'],
      },
      {
        titleId: ETranslations.global_quit,
        keys: [shortcutsKeys.CmdOrCtrl, 'Q'],
      },
    ],
  },
  {
    titleId: ETranslations.global_browser,
    items: [
      {
        titleId: ETranslations.explore_new_tab,
        shortcutKey: EShortcutEvents.NewTab,
      },
      {
        titleId: ETranslations.global_refresh,
        shortcutKey: EShortcutEvents.Refresh,
      },
      {
        titleId: ETranslations.shortcut_go_forward,
        shortcutKey: EShortcutEvents.GoForwardHistory,
      },
      {
        titleId: ETranslations.shortcut_go_back,
        shortcutKey: EShortcutEvents.GoBackHistory,
      },
      {
        titleId: ETranslations.global_copy_url,
        shortcutKey: EShortcutEvents.CopyAddressOrUrl,
      },
      {
        titleId: ETranslations.shortcuts_close_current_tab,
        shortcutKey: EShortcutEvents.CloseTab,
      },
      {
        titleId: ETranslations.explore_bookmarks,
        shortcutKey: EShortcutEvents.ViewBookmark,
      },
      {
        titleIds: [
          ETranslations.explore_add_bookmark,
          ETranslations.explore_remove_bookmark,
        ],
        shortcutKey: EShortcutEvents.AddOrRemoveBookmark,
      },
      {
        titleId: ETranslations.explore_history,
        shortcutKey: EShortcutEvents.ViewHistory,
      },
      {
        titleIds: [
          ETranslations.global_pin_to_top,
          ETranslations.global_unpin_from_top,
        ],
        shortcutKey: EShortcutEvents.PinOrUnpinTab,
      },
      {
        titleId: ETranslations.global_copy_url,
        shortcutKey: EShortcutEvents.CopyAddressOrUrl,
      },
    ],
  },
];

function ShortcutItem({
  titleId,
  titleIds,
  keys,
  shortcutKey,
}: {
  titleId?: ETranslations;
  titleIds?: ETranslations[];
  keys?: string[];
  shortcutKey?: EShortcutEvents;
}) {
  const intl = useIntl();
  const title = useMemo(
    () =>
      titleIds
        ? titleIds.map((id) => intl.formatMessage({ id })).join(' / ')
        : intl.formatMessage({ id: titleId }),
    [intl, titleId, titleIds],
  );
  const sKeys = useMemo(
    () => (shortcutKey ? shortcutsMap[shortcutKey].keys : keys),
    [keys, shortcutKey],
  );
  return (
    <ListItem title={title}>
      <Shortcut>
        {sKeys?.map((key) => (
          <Shortcut.Key key={key}>{key}</Shortcut.Key>
        ))}
      </Shortcut>
    </ListItem>
  );
}

interface OpenUrlQRCodeProps {
  url: string;
  size?: number;
}


function ShortcutsPreview() {
  const intl = useIntl();

  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [brandImage, setBrandImage] = useState<string>({});
  const [logo, setLogo] = useState<string>('');
  useEffect(() => {
    const fetchVersionInfo = async () => {
      setIsLoading(true);
      try {
        const info = await versionService.getVersionInfo();
        console.log('info233', info);
        setDownloadUrl(info.downqrcode);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchVersionInfo();

    const fetchBrandImage = async () => {
      const imageContent = await getBrandImage({
        img_type: '2',
      });
      setBrandImage(imageContent);
    };

    void fetchBrandImage();


  }, []);

  return (
    <Page scrollEnabled={false}>
      <Page.Header
        headerTitle={intl.formatMessage({
          id: ETranslations.settings_shortcuts,
        })}
      />
      <Page.Body userSelect="none">
        <Stack position="relative">
          {/* logo和文字放一排居中 */}

          {/* <Stack
            position="absolute"
            zIndex={1000}
            top='1%'
            w="100%"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            <SizableText
              size="$heading2xl"
              color="white"
              fontWeight="bold"
              ml="$2"
              mt="$3"
            >
              {brandImage.app_name}
            </SizableText>
          </Stack> */}
          <Image
            w="100%"
            h={height}
            resizeMode="cover"
            source={{ uri: brandImage.image }}
            marginTop={-40}
          />
        </Stack>
        <Stack position="absolute" bottom="9%" flex={1} w={'100%'} alignItems='center'>
          {isLoading ? (
            <Spinner size="small" />
          ) : downloadUrl ? (
            // <QRCode value={downloadUrl} size={100} />
            //修复图片URL
            <>
              <Image w={100} h={100} source={{ uri: downloadUrl }} />
              <SizableText
                size="$headingXxs"
                color="#FFFF"
                mt="$2"
              >
                {'Scan QR & download'}
              </SizableText>
            </>
          ) : (
            <Stack width={100} height={100} />
          )}

        </Stack>
      </Page.Body>
    </Page>
  );
}

export default ShortcutsPreview;
