export enum EDiscoveryModalRoutes {
  MobileTabList = 'MobileTabList',
  SearchModal = 'SearchModal',
  BookmarkListModal = 'BookmarkListModal',
  HistoryListModal = 'HistoryListModal',
  Browsernative1 = 'Browsernative1',
  AnnouncementDetails = 'AnnouncementDetails',
}

export type IDiscoveryModalParamList = {
  [EDiscoveryModalRoutes.MobileTabList]: undefined;
  [EDiscoveryModalRoutes.SearchModal]: {
    tabId?: string;
    useCurrentWindow?: boolean;
    url: string;
    isBrowsernative?:boolean
  };
  [EDiscoveryModalRoutes.BookmarkListModal]: undefined;
  [EDiscoveryModalRoutes.HistoryListModal]: undefined;
  [EDiscoveryModalRoutes.Browsernative1]: undefined;
  [EDiscoveryModalRoutes.AnnouncementDetails]: {
    id?: number;
    title?: string;
    descript: string;
    content?: string,
    created_at: Date
  };
};
