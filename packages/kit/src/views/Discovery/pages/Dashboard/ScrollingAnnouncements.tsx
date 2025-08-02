import { useEffect, useState, useRef, useCallback } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { XStack, SizableText } from '@onekeyhq/components';
import axios from 'axios';
import { CUSTOM_NETWORK_URL } from '@onekeyhq/shared/src/config/appConfig';
import { useSettingsPersistAtom } from '@onekeyhq/kit-bg/src/states/jotai/atoms';
import useAppNavigation from '@onekeyhq/kit/src/hooks/useAppNavigation';
import {
  EDiscoveryModalRoutes,
  EModalRoutes,
} from '@onekeyhq/shared/src/routes';
import * as Localization from 'expo-localization';
import { useLocaleOptions } from '../../../Setting/hooks';

const ITEM_HEIGHT = 20;

export function ScrollingAnnouncements() {
  const [settings] = useSettingsPersistAtom();
  const [announcements, setAnnouncements] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const indexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigation = useAppNavigation();

  useEffect(() => {
    
    const localeMap: Record<string, number> = {
        'en-US': 1,
        'zh-CN': 2,
        'zh-HK': 3,
        'ja-JP': 4,
        'ko-KR': 5,
        'bn-BD': 6,
        'de-DE': 7,
        'es-ES': 8,
        'fr-FR': 9,
        'hi-IN': 10,
        'it-IT': 11,
        'pt-PT': 12,
        'ms-MY': 13,
        'ru-RU': 14,
        'th-TH': 15,
        'uk-UA': 16,
        'vi-VN': 17,
      };

    const localeCodeNumber = localeMap[Localization.locale];
    
    async function fetchData() {
      try {
        const response = await axios.get(
          `${CUSTOM_NETWORK_URL}/api/bus/Notice`,
          {
            params: {
              lang: settings.localeCodeNumber ?? localeCodeNumber,
            },
          },
        );
        const list = response.data?.data?.data || [];
        // 加一条第一项的副本在末尾，实现“无缝循环”
        if (list.length > 1) {
          setAnnouncements([...list, list[0]]);
        } else {
          setAnnouncements(list);
        }
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      }
    }
    fetchData();
  }, []);

  const AnnouncementDetails = useCallback(
    (
      id: number,
      title: string,
      content: string,
      descript: string,
      created_at: Date,
    ) => {
      navigation.pushModal(EModalRoutes.DiscoveryModal, {
        screen: EDiscoveryModalRoutes.AnnouncementDetails,
        params: {
          id: id,
          title: title,
          content: content,
          descript: descript,
          created_at: created_at,
        },
      });
    },
    [navigation],
  );

  useEffect(() => {
    if (announcements.length <= 1) return;

    intervalRef.current = setInterval(() => {
      indexRef.current += 1;

      Animated.timing(scrollY, {
        toValue: -indexRef.current * ITEM_HEIGHT,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // 如果到最后一条（也就是第一条副本），立刻跳回 scrollY = 0
        if (indexRef.current === announcements.length - 1) {
          scrollY.setValue(0);
          indexRef.current = 0;
        }
      });
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [announcements]);

  if (!announcements.length) return null;

  console.log(announcements);

  return (
    <XStack
      height={ITEM_HEIGHT}
      overflow="hidden"
      justifyContent="center"
      alignItems="center"
      mt="$2"
    >
      <View style={styles.container}>
        <Animated.View
          style={{
            transform: [{ translateY: scrollY }],
          }}
        >
          {announcements.map((item, idx) => (
            <View key={idx} style={styles.item}>
              <SizableText
                color="$textSubdued"
                size="$bodySm"
                numberOfLines={1}
                onPress={() =>
                  AnnouncementDetails(
                    item.id,
                    item.title,
                    item.content,
                    item.descript,
                    item.created_at,
                  )
                }
              >
                {item.title}
              </SizableText>
            </View>
          ))}
        </Animated.View>
      </View>
    </XStack>
  );
}

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT,
    justifyContent: 'flex-start',
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
  },
});
