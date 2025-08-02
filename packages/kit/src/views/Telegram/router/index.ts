import type { ITabSubNavigatorConfig } from '@onekeyhq/components';
import { ETabHomeRoutes } from '@onekeyhq/shared/src/routes';

import { LazyLoadPage } from '../../../components/LazyLoadPage';
// import { urlAccountLandingRewrite } from '../pages/urlAccount/urlAccountUtils';

const HomePageContainer = LazyLoadPage(
  () => import('../pages/page'),
);

const MePageContainer = LazyLoadPage(
  () => import('../pages/Me'),
);

const MyMoneyPageContainer = LazyLoadPage(
  () => import('../pages/MyMoney'),
);
const MyLuckMoneyDetailPageContainer = LazyLoadPage(
  () => import('../pages/LuckMoneyDetail'),
);

const TransferInPageContainer = LazyLoadPage(
  () => import('../pages/TransferIn'),
);

const TransferOutPageContainer = LazyLoadPage(
  () => import('../pages/TransferOut'),
);

const HotPage = LazyLoadPage(
  ()=> import('../pages/Hot')
)

const GamePage = LazyLoadPage(
  ()=> import('../pages/Game')
)

const ChannelPage = LazyLoadPage(
  ()=>import('../pages/Channel')
)

const AboutUsPage = LazyLoadPage(
  () => import('../pages/AboutUs')
);

const PrivacyPolicy = LazyLoadPage(
  () => import('../pages/PrivacyPolicy')
);

const UserAgreement = LazyLoadPage(
  () => import('../pages/UserAgreement')
);

const BusinessCooperation = LazyLoadPage(
  ()=> import('../pages/BusinessCooperation')
);

const BotConfig = LazyLoadPage(
  () => import('../pages/BotConfig')
);
// const UrlAccountPageContainer = LazyLoadPage(async () => {
//   const { UrlAccountPageContainer: UrlAccountPageContainerModule } =
//     await import('../pages/urlAccount/UrlAccountPage');
//   return { default: UrlAccountPageContainerModule };
// });

// const UrlAccountLanding = LazyLoadPage(async () => {
//   const { UrlAccountLanding: UrlAccountLandingModule } = await import(
//     '../pages/urlAccount/UrlAccountPage'
//   );
//   return { default: UrlAccountLandingModule };
// });

export const homeRouters: ITabSubNavigatorConfig<any, any>[] = [
  {
    name: 'TgChatHome',
    component: HomePageContainer,
  
    // translationId: 'wallet__wallet',
    // rewrite: '/',
    // exact: true,
  },


];

export const meRouters: ITabSubNavigatorConfig<any, any>[] = [
  {
    name: 'TgMe',
    component: MePageContainer,
    // translationId: 'wallet__wallet',
    rewrite: '/',
    // exact: true,
  },
  {
    name: 'TgMyMoney',
    component: MyMoneyPageContainer,
    // translationId: 'wallet__wallet',
    rewrite: '/TgMyMoney',
    exact: true,
  },
  {
    name: 'TgLuckMoneyDetail',
    component: MyLuckMoneyDetailPageContainer,
    // translationId: 'wallet__wallet',
    rewrite: '/TgLuckMoneyDetail',
    exact: true,
  },

  {
    name: 'TgTransferIn',
    component: TransferInPageContainer,
    // translationId: 'wallet__wallet',
    rewrite: '/TgTransferIn',
    exact: true,
  },

  {
    name: 'TgTransferOut',
    component: TransferOutPageContainer,
    // translationId: 'wallet__wallet',
    rewrite: '/TgTransferOut',
    exact: true,
  },

  {
    name: 'TgAboutUs',
    component: AboutUsPage,
    rewrite: '/TgAboutUs',
    exact: true,
  },

  {
    name: 'BusinessCooperation',
    component: BusinessCooperation,
    rewrite: '/BusinessCooperation',
    exact: true,
  },
  {
    name: 'PrivacyPolicy',
    component: PrivacyPolicy,
    rewrite: '/PrivacyPolicy',
    exact: true,
  },
  {
    name: 'UserAgreement',
    component: UserAgreement,
    rewrite: '/UserAgreement',
    exact: true,
  },
  {
    name: 'BotConfig',
    component: BotConfig,
    rewrite: '/BotConfig',
    exact: true,
  },
];

export const hotListRouters: ITabSubNavigatorConfig<any, any>[] = [
  {
    name: 'TgHotList',
    component: HotPage,
    // translationId: 'wallet__wallet',
    rewrite: '/TgHotList',
    // exact: true,
  },




];

export const gameListRouters: ITabSubNavigatorConfig<any, any>[] = [
  {
    name: 'TgGame',
    component: GamePage,
    // translationId: 'wallet__wallet',
    rewrite: '/TgGame',
    // exact: true,
  },




];


export const channelRoutes: ITabSubNavigatorConfig<any, any>[] = [
  {
    name: 'TgChannel',
    component: ChannelPage,
    // translationId: 'wallet__wallet',
    rewrite: '/TgChannel',
    // exact: true,
  },




];


