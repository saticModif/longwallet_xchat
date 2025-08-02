import type { ReactElement } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import NumberSizeableTextWrapper from '../NumberSizeableTextWrapper';
import { useSettingsPersistAtom } from '@onekeyhq/kit-bg/src/states/jotai/atoms';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useIntl } from 'react-intl';
import { useWindowDimensions } from 'react-native';

import type { IListViewProps } from '@onekeyhq/components';
import {
  SectionList,
  SizableText,
  Stack,
  XStack,
  renderNestedScrollView,
  NumberSizeableText,
  ListView
} from '@onekeyhq/components';
import { ListItem } from '@onekeyhq/kit/src/components/ListItem';
import { useSafeAreaInsets } from '@onekeyhq/components/src/hooks';
import { ETranslations } from '@onekeyhq/shared/src/locale';
import platformEnv from '@onekeyhq/shared/src/platformEnv';
import { formatDate } from '@onekeyhq/shared/src/utils/dateUtils';
import {
  convertToSectionGroups,
  getFilteredHistoryBySearchKey,
} from '@onekeyhq/shared/src/utils/historyUtils';
import type {
  IAccountHistoryTx,
  IHistoryListSectionGroup,
} from '@onekeyhq/shared/types/history';
import { EDecodedTxStatus } from '@onekeyhq/shared/types/tx';

import { useTabListScroll } from '../../hooks/useTabListScroll';
import { useSearchKeyAtom } from '../../states/jotai/contexts/historyList';
import useActiveTabDAppInfo from '../../views/DAppConnection/hooks/useActiveTabDAppInfo';
import { EmptySearch } from '../Empty';
import { EmptyHistory } from '../Empty/EmptyHistory';
import { HistoryLoadingView } from '../Loading';

import { TxHistoryListHeader } from './TxHistoryListHeader';
import { TxHistoryListItem } from './TxHistoryListItem';

type IProps = {
  data: IAccountHistoryTx[];
  isLoading?: boolean;
  tableLayout?: boolean;
  ListHeaderComponent?: ReactElement;
  showHeader?: boolean;
  showIcon?: boolean;
  onPressHistory?: (history: IAccountHistoryTx) => void;
  initialized?: boolean;
  inTabList?: boolean;
  contentContainerStyle?: IListViewProps<IAccountHistoryTx>['contentContainerStyle'];
  hideValue?: boolean;
  tokenInfo: {
    address: string,
    symbol: string
  }
};

const DECIMALS = 18
const ListFooterComponent = () => {
  const { result: extensionActiveTabDAppInfo } = useActiveTabDAppInfo();
  const addPaddingOnListFooter = useMemo(
    () => !!extensionActiveTabDAppInfo?.showFloatingPanel,
    [extensionActiveTabDAppInfo?.showFloatingPanel],
  );
  return (
    <>
      <Stack h="$5" />
      {addPaddingOnListFooter ? <Stack h="$16" /> : null}
    </>
  );
};

function TxHistoryListViewSectionHeader(props: IHistoryListSectionGroup) {
  const { title, titleKey, data } = props;
  // const intl = useIntl();
  const titleText = title || intl.formatMessage({ id: titleKey }) || '';

  if (data[0] && data[0].decodedTx.status === EDecodedTxStatus.Pending) {
    return (
      <XStack h="$9" px="$5" alignItems="center" bg="$bgApp" space="$2">
        <Stack
          w="$2"
          height="$2"
          backgroundColor="$textCaution"
          borderRadius="$full"
        />
        <SizableText numberOfLines={1} size="$headingSm" color="$textCaution">
          {intl.formatMessage({ id: ETranslations.global_pending })}
        </SizableText>
      </XStack>
    );
  }

  return <SectionList.SectionHeader title={titleText} />;
}

function TxHistoryListView(props: IProps) {
  const {
    data,
    isLoading,
    showHeader,
    ListHeaderComponent,
    showIcon,
    onPressHistory,
    tableLayout,
    initialized,
    contentContainerStyle,
    inTabList = false,
    hideValue,
    tokenInfo
  } = props;

  const [searchKey] = useSearchKeyAtom();
  const [sectionsIspay, setSectionsIspay] = useState([])
  const [settings] = useSettingsPersistAtom();
  const [ispayPrice, setIspayPrice] = useState(0)
  const intl = useIntl();
  AsyncStorage.getItem('ispayPrice').then((value) => {
    setIspayPrice(value)
  })

  const filteredHistory = useMemo(
    () =>
      getFilteredHistoryBySearchKey({
        history: data,
        searchKey,
      }),
    [data, searchKey],
  );

  const { bottom, top } = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const sections = useMemo(
    () =>
      convertToSectionGroups({
        items: filteredHistory,
        formatDate: (date: number) =>
          formatDate(new Date(date), {
            hideTimeForever: true,
          }),
      }),
    [filteredHistory],
  );
  useEffect(() => {
    if (tokenInfo.symbol == 'ISPAY') {
      const newaccountId = tokenInfo?.address ?? ""
      axios({
        method: 'get',
        url: `https://scan-api.ispay.vip/api/v2/addresses/${newaccountId}/transactions`
      }).then((res) => {
        const newRes = []
        const result = res?.data ?? [];
        const arr = result?.items ?? []
        arr.forEach((v, i) => {
          let title = v.timestamp
          title = title.split("T")[0].replace(/-/gi, "/")
          newRes.push({ data: v, title })
        })
        let map = {}
        let dest = []
        for (var i = 0; i < newRes.length; i++) {
          var ai = newRes[i];
          if (!map[ai.title]) {
            dest.push({
              title: ai.title,
              data: [ai.data]
            });
            map[ai.title] = ai.title;
          } else {
            for (var j = 0; j < dest.length; j++) {
              var dj = dest[j];
              if (dj.title == ai.title) {
                dj.data.push(ai.data)
                break;
              }
            }
          }
        }
        setSectionsIspay(dest)
      })
    }
  }, [tokenInfo])

  // console.error(">>>sections>>>>", sections)
  // console.error(">>>>>>>", sectionsIspay)

  const renderItem = useCallback(
    (info: { item: IAccountHistoryTx; index: number }) => (
      <TxHistoryListItem
        hideValue={hideValue}
        index={info.index}
        historyTx={info.item}
        showIcon={showIcon}
        onPress={onPressHistory}
        tableLayout={tableLayout}
      />
    ),
    [hideValue, onPressHistory, showIcon, tableLayout],
  );
  const myRenderItem = ({ item, index }) => {
    let itemData = item.data
    let itemArr = []
    itemData.forEach(element => {
      let title = ""
      let adress = ''
      let price = (element.value / (10 ** DECIMALS)).toFixed(2)
      let priceValue = ((element.value / (10 ** DECIMALS)) * ispayPrice).toFixed(2)
      let unit = ""
      let fromHash = element.from.hash.toLowerCase()
      let toHash = element.to.hash.toLowerCase()
      if (fromHash == tokenInfo.address.toLowerCase()) {
        // 发送
        title = intl.formatMessage({ id: ETranslations.global_send });
        adress = toHash
        unit = "-"
      } else {
        // 接收
        title = intl.formatMessage({ id: ETranslations.global_receive });
        adress = fromHash
        unit = "+"
      }
      itemArr.push({ title, adress, price, priceValue, unit })
    });

    return (
      <ListItem
        testID="tx-action-common-list-view"
        gap="$2"
        flexDirection="column"
        alignItems="flex-start"
        userSelect="none"
        key={index}
      >
        <XStack>
          <SizableText
            numberOfLines={1}
            flexShrink={1}
            size="$bodyLgMedium"
            color="$textSubdued"
          >
            {item.title}
          </SizableText>
        </XStack>
        {/* Content */}
        {itemArr.map((items, indexs) => (
            <XStack gap="$3" alignSelf="stretch" mt="$1" key={`item_${indexs}`}>
              {/* token, title and subtitle */}
              <XStack
                flex={1}
                gap="$3"
                justifyContent='space-between'
              // onPress={() => {
              //   onPressHistory?.(items,'ISPAY')
              // }}

              >
                {/* {showIcon ? (
              <TxActionCommonAvatar
                avatar={avatar}
                tableLayout={tableLayout}
                networkLogoURI={networkLogoURI}
              />
            ) : null} */}
                <XStack maxWidth="50%" justifyContent='center' flexDirection='column' alignItems="flex-start">
                  <SizableText
                    numberOfLines={1}
                    flexShrink={1}
                    size="$bodyLgMedium"
                  >
                    {items.title}
                  </SizableText>
                  <SizableText
                    numberOfLines={1}
                    flexShrink={1}
                    size="$bodyMd"
                    color="$textSubdued"
                  >
                    {items.adress}
                  </SizableText>
                </XStack>
                {/* </Stack> */}
                <XStack alignItems="flex-end" flexDirection='column'>
                  <NumberSizeableTextWrapper
                    size="$bodyLgMedium"
                    formatter="balance"
                    formatterOptions={{ tokenSymbol: tokenInfo.symbol, currency: items.unit }}
                    {...(items.unit == '+' && {
                      color: '$textSuccess',
                    })}
                  >
                    {items.price}
                  </NumberSizeableTextWrapper>
                  <NumberSizeableTextWrapper
                    size="$bodyMd"
                    color="$textSubdued"
                    formatter="value"
                    formatterOptions={{ currency: settings.currencyInfo.symbol }}
                  >
                    {items.priceValue}
                  </NumberSizeableTextWrapper>
                </XStack>
              </XStack>
            </XStack>
          )
        )}
      </ListItem >
    )
  }
  const renderSectionHeader = useCallback(
    ({
      section: { title, titleKey, data: tx },
    }: {
      section: IHistoryListSectionGroup;
    }) => (
      <TxHistoryListViewSectionHeader
        title={title}
        titleKey={titleKey}
        data={tx}
      />
    ),
    [],
  );

  const { listViewProps, listViewRef, onLayout } =
    useTabListScroll<IAccountHistoryTx>({
      inTabList,
    });

  if (!initialized && isLoading) {
    return (
      <Stack {...contentContainerStyle}>
        {ListHeaderComponent}
        <HistoryLoadingView tableLayout={tableLayout} />
      </Stack>
    );
  }
  if (tokenInfo.symbol == 'ISPAY') {
    return (
      <ListView
        {...(listViewProps as any)}
        renderScrollComponent={renderNestedScrollView}
        h={platformEnv.isNative ? screenHeight - top - bottom - 90 : '100%'}
        estimatedItemSize={platformEnv.isNative ? 60 : 56}
        ref={listViewRef}
        onLayout={onLayout}
        data={sectionsIspay}
        //     ListHeaderComponent={
        //       showHeader && data?.length > 0 ? (
        //         <TxHistoryListHeader filteredHistory={filteredHistory} />
        //       ) : (
        //         ListHeaderComponent
        //       )
        //     }
        ListEmptyComponent={searchKey ? EmptySearch : EmptyHistory}
        renderItem={myRenderItem}
        ListFooterComponent={ListFooterComponent}
      />
    );
  }
  return (
    <SectionList
      {...(listViewProps as any)}
      renderScrollComponent={renderNestedScrollView}
      ref={listViewRef}
      contentContainerStyle={{
        ...contentContainerStyle,
      }}
      h={platformEnv.isNative ? screenHeight - top - bottom - 90 : '100%'}
      onLayout={onLayout}
      sections={sections}
      ListEmptyComponent={searchKey ? EmptySearch : EmptyHistory}
      estimatedItemSize={platformEnv.isNative ? 60 : 56}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      ListFooterComponent={ListFooterComponent}
      ListHeaderComponent={
        showHeader && data?.length > 0 ? (
          <TxHistoryListHeader filteredHistory={filteredHistory} />
        ) : (
          ListHeaderComponent
        )
      }
      keyExtractor={(tx, index) =>
        (tx as IAccountHistoryTx).id || index.toString(10)
      }
    />
  );
}

export { TxHistoryListView };
