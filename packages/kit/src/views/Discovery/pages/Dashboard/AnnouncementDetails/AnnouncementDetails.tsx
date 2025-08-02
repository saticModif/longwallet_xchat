import React,{useState, useEffect} from 'react';
import { Text, View, StyleSheet, useColorScheme, useWindowDimensions } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/core';
import type { IDiscoveryModalParamList } from '@onekeyhq/shared/src/routes';
import { useIntl } from 'react-intl';
import { ETranslations } from '@onekeyhq/shared/src/locale';
import { EDiscoveryModalRoutes } from '@onekeyhq/shared/src/routes';
import { getFontSize, Page, SizableText } from '@onekeyhq/components';
import RenderHTML from 'react-native-render-html';
import { useSettingsPersistAtom } from '@onekeyhq/kit-bg/src/states/jotai/atoms';
import { color } from '@tamagui/themes';



export default function AnnouncementDetails() {
  const intl = useIntl();
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme(); 
  const [backgroundColor] = useSettingsPersistAtom();
  const route =
    useRoute<
      RouteProp<
        IDiscoveryModalParamList,
        EDiscoveryModalRoutes.AnnouncementDetails
      >
    >();
  const { id, title, content, descript, created_at } = route.params ?? {};
  const userPref = backgroundColor?.localeBackgroundColor?.toLowerCase();
  const isDarkMode =
  userPref && userPref !== 'system'
  ? (userPref === 'dark' ? '#fff' : '#000')
  : (colorScheme === 'dark' ? '#fff' : '#000');
  const contentStyle = {
    p:{
      color: userPref==undefined?'#fff':isDarkMode,
      fontSize: 12, 
    },
    strong:{
      color: userPref==undefined?'#fff':isDarkMode,
      fontSize: 12,
    }
  }

  return (
    <Page>
      <Page.Header
        title={intl.formatMessage({ id: ETranslations.global_details })}
      ></Page.Header>
      <Page.Body marginLeft={20}>
          <SizableText size="$headingSm" marginBottom={15}>
            {title}
          </SizableText>
          <SizableText color="$textSubdued" size="$bodySm">
            {created_at}
          </SizableText>
          <RenderHTML contentWidth={width} source={{ html: content || '' }} tagsStyles={contentStyle}/>
      </Page.Body>
    </Page>
  );
}

const styles = StyleSheet.create({});
