import { useState, useMemo, useEffect } from 'react';

import { getTokenValue, useMedia } from '@onekeyhq/components';
import type {
  ITabNavigatorConfig,
  ITabNavigatorExtraConfig,
} from '@onekeyhq/components/src/layouts/Navigation/Navigator/types';
import { useDevSettingsPersistAtom } from '@onekeyhq/kit-bg/src/states/jotai/atoms';
import { ETranslations } from '@onekeyhq/shared/src/locale';
import platformEnv from '@onekeyhq/shared/src/platformEnv';
import { TTabRoutes, ETabRoutes } from '@onekeyhq/shared/src/routes';
import { EShortcutEvents } from '@onekeyhq/shared/src/shortcuts/shortcuts.enum';

import { developerRouters } from '../../views/Developer/router';
import { homeRouters, meRouters, hotListRouters, gameListRouters, channelRoutes } from '../../views/Telegram/router';
import { Text } from 'react-native';
import { discoveryRouters } from '../Tab/Discovery/router';
import { multiTabBrowserRouters } from '../Tab/MultiTabBrowser/router';
import AsyncStorage from '@react-native-async-storage/async-storage';




type IGetTabRouterParams = {
  freezeOnBlur?: boolean;
};

const useIsShowDesktopDiscover = () => {
  const { gtMd } = useMedia();
  return useMemo(
    () => platformEnv.isDesktop || (platformEnv.isNative && gtMd),
    [gtMd],
  );
};

const getDiscoverRouterConfig = (
  params?: IGetTabRouterParams,
  tabBarStyle?: ITabNavigatorConfig<TTabRoutes>['tabBarStyle'],
) => {
  const discoverRouterConfig: ITabNavigatorConfig<TTabRoutes> = {
    name:  TTabRoutes.Chat,
    rewrite: '/',
    exact: true,
    tabBarIcon: (focused?: boolean) =>
      focused ? 'CompassCircleSolid' : 'CompassCircleOutline',
    translationId: ETranslations.global_browser,
    freezeOnBlur: params?.freezeOnBlur ?? false,
    shortcutKey: EShortcutEvents.TabBrowser,
    children: discoveryRouters,
    tabBarStyle,
  };
  return discoverRouterConfig;
};

export const useTabRouterConfig = (params?: IGetTabRouterParams) => {
  const { md } = useMedia();  
  const isShowDesktopDiscover = useIsShowDesktopDiscover();

  const isShowMDDiscover = useMemo(
    () =>
      !isShowDesktopDiscover &&
      !platformEnv.isExtensionUiPopup &&
      !(platformEnv.isExtensionUiSidePanel && md),
    [isShowDesktopDiscover, md],
  );
  return useMemo(
    () =>
      [
        {
          name: TTabRoutes.Chat,
          tabBarIcon: (focused?: boolean) =>
            focused ? 'TgChat' : 'TgChat',
          translationId: ETranslations.telegram_module_chat,
          freezeOnBlur: params?.freezeOnBlur !== undefined ? params.freezeOnBlur : false,
          shortcutKey: EShortcutEvents.TabWallet,
     
          exact: true,
          children: homeRouters,
        },
        {
          name: TTabRoutes.Game,
          tabBarIcon: (focused?: boolean) =>
            focused ? 'TgGame' : 'TgGame',
          translationId: ETranslations.telegram_module_game,
          freezeOnBlur: params?.freezeOnBlur ?? false,
          shortcutKey: EShortcutEvents.TabWallet,
          rewrite: '/',
          exact: true,
          children: gameListRouters,
        },
        {
          name: TTabRoutes.Channel,
          tabBarIcon: (focused?: boolean) =>
            focused ? 'TgChannel' : 'TgChannel',
          translationId: ETranslations.telegram_module_channel,
          freezeOnBlur: Boolean(params?.freezeOnBlur),
          shortcutKey: EShortcutEvents.TabWallet,
          rewrite: '/Channel',
          exact: true,
          children: channelRoutes
        },
        {
          name: TTabRoutes.HotList,
          tabBarIcon: (focused?: boolean) =>
            focused ? 'TgHot' : 'TgHot',
          translationId: ETranslations.telegram_module_hotlist,
          freezeOnBlur: Boolean(params?.freezeOnBlur),
          shortcutKey: EShortcutEvents.TabWallet,
          rewrite: '/HotList',
          exact: true,
          children: hotListRouters
        },
        {
          name: TTabRoutes.Me,
          tabBarIcon: (focused?: boolean) =>
            focused ? 'TgMe' : 'TgMe',
          translationId: ETranslations.telegram_module_me,
          freezeOnBlur: Boolean(params?.freezeOnBlur),
          shortcutKey: EShortcutEvents.TabWallet,
          rewrite: '/Me',
          exact: true,
          children: meRouters
        },
        

      ].filter<ITabNavigatorConfig<TTabRoutes>>(
        (i) => !!i as unknown as ITabNavigatorConfig<TTabRoutes>,
      ),
    [isShowDesktopDiscover, isShowMDDiscover, params],
  );
};

export const tabExtraConfig: ITabNavigatorExtraConfig<ETabRoutes> | undefined =
  {
    name: ETabRoutes.MultiTabBrowser,
    children: multiTabBrowserRouters,
  };
