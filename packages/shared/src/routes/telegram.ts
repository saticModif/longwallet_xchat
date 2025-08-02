export enum ETelegramRoutes {
  TgChatHome = 'TgChatHome',
  TgMe = 'TgMe',
  TgMyMoney = 'TgMyMoney',
  TgLuckMoneyDetail = 'TgLuckMoneyDetail',
  TgTransferIn = 'TgTransferIn',
  TgTransferOut = 'TgTransferOut',
  TgAboutUs = 'TgAboutUs',
  TgHotList = 'TgHotList',
  TgGame = 'TgGame',
  TgChannel = 'TgChannel',
  BusinessCooperation = 'BusinessCooperation',
  PrivacyPolicy = 'PrivacyPolicy',
  UserAgreement = 'UserAgreement',
  BotConfig = 'BotConfig',
}

export type ITelegramParamList = {
  [ETelegramRoutes.TgChatHome]: {
    action?: 'openSettings' | 'toChannel' | 'Signed In' | 'logout' | '321' | '123';
    channelId?: string;
  };
  [ETelegramRoutes.TgMe]: undefined;
  [ETelegramRoutes.TgMyMoney]: undefined;
  [ETelegramRoutes.TgLuckMoneyDetail]: undefined;
  [ETelegramRoutes.TgTransferIn]: undefined;
  [ETelegramRoutes.TgTransferOut]: undefined;
  [ETelegramRoutes.TgAboutUs]: undefined;
  [ETelegramRoutes.TgHotList]: undefined;
  [ETelegramRoutes.TgGame]: undefined;
  [ETelegramRoutes.TgChannel]: undefined;
  [ETelegramRoutes.BusinessCooperation]: undefined;
  [ETelegramRoutes.PrivacyPolicy]: undefined;
  [ETelegramRoutes.UserAgreement]: undefined;
  [ETelegramRoutes.BotConfig]: undefined;
}; 