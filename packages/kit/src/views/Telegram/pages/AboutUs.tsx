import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Pressable,
  Linking,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { Page } from '@onekeyhq/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import RenderHTML from 'react-native-render-html';
import * as Clipboard from 'expo-clipboard';
import { useIntl } from 'react-intl';
import { ETranslations } from '@onekeyhq/shared/src/locale';
import { CUSTOM_NETWORK_URL } from '@onekeyhq/shared/src/config/appConfig';
import useAppNavigation from '@onekeyhq/kit/src/hooks/useAppNavigation';
import { result } from 'lodash';

export default function AboutUs() {
  const intl = useIntl();

  const { width } = useWindowDimensions();

  const isFocused = useIsFocused();

  const [showMask, setShowMask] = useState(false);

  const [updateContent, setUpdateContent] = useState();

  const [url, setUrl] = useState('');

  const [version, setVersion] = useState('');

  const navigation = useAppNavigation();

  const [about, setAbout] = useState([
    {
      id: 0,
      name: ETranslations.telegram_my_useragreement,
      img: require('../images/jumpRight.png'),
    },
    {
      id: 1,
      name: ETranslations.telegram_my_privacypolicy,
      img: require('../images/jumpRight.png'),
    },
    {
      id: 2,
      name: ETranslations.telegram_my_checkupdate,
      img: require('../images/jumpRight.png'),
    },
  ]);

  const [channel, setChannel] = useState([]);

  const handleCopy = async (copyWord: string) => {
    await Clipboard.setStringAsync(copyWord);
    Alert.alert('复制成功' + '内容已复制到剪贴板');
  };

  const join =async(url:string)=>{
    if(url.startsWith('http')){
      await Linking.openURL(url);
    }else{
      navigation.navigate('telegram', {
        screen: 'TgChat',
  
        params: {
          screen: 'TgChatHome',
          params: {
            action: 'toChannel',
            channelId: url,
          },
        },
      });
    }
  }

  const content = {
    strong: {
      color: '#3467FE',
      fontSize: 16,
    },
  };

  const handleClick = (id:number) => {
    if(id===0){
      navigation.push('UserAgreement');
    }else if(id===1){
      navigation.push('PrivacyPolicy')
    }else{
      setShowMask(!showMask);
    }
  };

  const renew = async () => {
    const token = await AsyncStorage.getItem('tgToken');

    if (!token) {
      alert('用户没有有效的token信息');
      return;
    }

    const apiUrl = `${CUSTOM_NETWORK_URL}/communal/getVersionInfo`;
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorInfo = await response.json();
        console.error('Failed to fetch AboutUs info:', errorInfo);
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const AboutUsInfo = await response.json();
      console.log('AboutUs Info:', AboutUsInfo);
      return AboutUsInfo;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  };

  const getchannelInformation = async () => {
    const token = await AsyncStorage.getItem('tgToken');

    if (!token) {
      alert('用户没有有效的token信息');
      return;
    }
    const apiUrl = `${CUSTOM_NETWORK_URL}/communal/getPromotionInformation`;
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorInfo = await response.json();
        console.error('Failed to fetch AboutUs info:', errorInfo);
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const AboutUsInfo = await response.json();
      console.log('AboutUs Info:', AboutUsInfo);
      return AboutUsInfo;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (isFocused) {
      getchannelInformation().then(async (res) => {
       const result = res.data.map((item: any, index: number) => {
          return {
            id: index,
            telegramImg: item.logo,
            name: item.name,
            copyWord: item.copyUrl,
            copyButton: require('../images/copy.png'),
            joinCommunity: ETranslations.telegram_my_join,
            url: item.url
          };
        });
        setChannel(result)
      });

      renew().then(async (res) => {
        if (res.code == 200) {
          setUrl(res.data.url);
          setVersion(res.data.version);
          setUpdateContent(res.data.content);
          console.log(res.data);
        }
      });
    }
  }, [isFocused]);

  const updatedVersion = async () => {
    const versionName = DeviceInfo.getVersion();

    if (versionName !== version) {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        alert(`无法打开该链接: ${url}`);
      }
    } else {
      alert('当前已是最新版本');
    }
  };
  return (
    <Page fullPage>
      <Page.Header title="关于我们" />
      <View style={styles.main}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('../images/logo.png')} />
          <Text style={styles.logoName}>Xchat</Text>
        </View>
        <View>
          {about.map((item, index) => {
            return (
              <View key={index}>
                <Pressable onPress={()=> handleClick(item.id)}>
                  <View style={styles.logoContent}>
                    <Text style={styles.logoContentName}>
                      {intl.formatMessage({ id: item.name })}
                    </Text>
                    <Image style={styles.logoContentImg} source={item.img} />
                  </View>
                </Pressable>
                {item.id !== 2 ? <View style={styles.underLine}></View> : ''}
              </View>
            );
          })}
        </View>
        <View style={styles.channel}>
          <View style={styles.verticalLine} />
          <Text style={styles.channelName}>
            {intl.formatMessage({
              id: ETranslations.telegram_my_followxchatchannel,
            })}
          </Text>
        </View>
        <View>
          {channel.map((item, index) => (
            <View style={styles.telegram} key={index}>
              <View style={styles.telegramContent}>
                <Image
                  style={[
                    styles.telegramImg,
                    item.id == 3 ? { width: 25, height: 25 } : null,
                  ]}
                  source={{uri:item.telegramImg}}
                />
                <View>
                  <Text style={styles.telegramName}>{item.name}</Text>
                  <View style={styles.copyContent}>
                    <Text style={styles.copyWord}>{item.copyWord}</Text>
                    <Pressable onPress={() => handleCopy(item.copyWord)}>
                      <Image
                        style={styles.copyButton}
                        source={item.copyButton}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
              <Pressable onPress={()=>join(item.url)}>
              <Text style={styles.joinCommunity}>
                {intl.formatMessage({ id: item.joinCommunity })}
              </Text>
              </Pressable>
            </View>
          ))}
        </View>
      </View>
      {showMask ? <View style={styles.mask}></View> : ''}
      {showMask ? (
        <Image
          style={styles.maskTitleImg}
          source={require('../images/maskTitle.png')}
        />
      ) : (
        ''
      )}
      {showMask ? (
        <Text style={styles.version}>
          {intl.formatMessage({
            id: ETranslations.telegram_my_newversionfound,
          })}
        </Text>
      ) : (
        ''
      )}
      {showMask ? (
        <View style={styles.titleContent}>
          <RenderHTML
            contentWidth={width}
            source={{ html: updateContent || '' }}
            tagsStyles={content}
          />
          <Text style={styles.btn} onPress={() => updatedVersion()}>
            {intl.formatMessage({
              id: ETranslations.telegram_my_upgradeversion,
            })}
          </Text>
        </View>
      ) : (
        ''
      )}
      {showMask ? (
        <Pressable onPress={() => handleClick()} style={styles.maskDetele}>
          <Image
            style={styles.maskDeteleImg}
            source={require('../images/maskDetele.png')}
          />
        </Pressable>
      ) : (
        ''
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: '5%',
    position: 'relative',
  },
  mask: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#000',
    opacity: 0.6,
    zIndex: 99,
  },
  maskTitleImg: {
    width: 350,
    height: 390,
    position: 'absolute',
    top: '24%',
    left: '5%',
    zIndex: 100,
  },
  version: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    position: 'absolute',
    top: '29.25%',
    left: '25%',
    zIndex: 100,
  },
  titleContent: {
    width: '50%',
    position: 'absolute',
    top: '40%',
    left: '25%',
    zIndex: 100,
  },
  updateTitle: {
    color: '#3467FE',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    marginLeft: '25%',
  },
  btn: {
    width: '90%',
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    borderRadius: 8,
    paddingVertical: 15,
    backgroundColor: '#3467FE',
    position: 'absolute',
    top: '130%',
    left: '5%',
    zIndex: 100,
  },
  maskDetele: {
    position: 'absolute',
    top: '80%',
    left: '45%',
    zIndex: 100,
  },
  maskDeteleImg: {
    width: 40,
    height: 40,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 50,
  },
  logo: {
    width: 100,
    height: 100,
  },
  logoName: {
    fontSize: 30,
    fontWeight: '600',
    color: '#0F0F0F',
    marginTop: 20,
  },
  logoContent: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContentName: {
    color: '#000',
    fontSize: 16,
  },
  logoContentImg: {
    width: 14,
    height: 14,
  },
  underLine: {
    backgroundColor: '#F2F3F5',
    width: '100%',
    height: 0.5,
    marginVertical: 15,
  },
  channel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  verticalLine: {
    width: 3,
    height: 18,
    backgroundColor: '#3467FE',
    marginRight: 6,
    borderRadius: 1.5,
  },
  channelName: {
    fontSize: 14,
    color: '#333',
  },
  telegram: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  telegramContent: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  telegramImg: {
    width: 30,
    height: 25,
    marginRight: 20,
  },
  telegramName: {
    color: '#000',
    fontSize: 14,
    marginBottom: 5,
  },
  copyContent: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  copyWord: {
    width: 200,
    color: '#666',
    fontSize: 12,
    marginRight: 10,
  },
  copyButton: {
    width: 14,
    height: 14,
  },
  joinCommunity: {
    color: '#fff',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#3467FE',
  },
});
