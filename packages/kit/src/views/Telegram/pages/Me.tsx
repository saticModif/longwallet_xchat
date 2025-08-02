import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAppNavigation from '@onekeyhq/kit/src/hooks/useAppNavigation';
import { useIsFocused } from '@react-navigation/native';

import {
  Page,
  Stack,
  Icon,
  XStack,
  useMedia,
  useSafeAreaInsets,
} from '@onekeyhq/components';

import {
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  View,
  Image,
  Text,
  TouchableOpacity,
  Touchable,
  StyleSheet,
  Pressable,
} from 'react-native';
import { wrap } from 'lodash';
import { useIntl } from 'react-intl';
import { ETranslations } from '@onekeyhq/shared/src/locale';
import { CUSTOM_NETWORK_URL } from '@onekeyhq/shared/src/config/appConfig';


function MobileBrowser() {
  const intl = useIntl();
  const isFocused = useIsFocused();
  const [userInfo, setUserInfo] = useState({
    nick: '',
    profilePicture: '',
    username: '',
  });

  const mySettings = [
    {
      id: 0,
      img: require('../images/LuckMoneyImg.png'),
      name: ETranslations.telegram_my_redpacket,
      arrowRightImg: require('../images/jumpRight.png'),
    },
    {
      id: 1,
      img: require('../images/about.png'),
      name: ETranslations.telegram_my_aboutus,
      arrowRightImg: require('../images/jumpRight.png'),
    },
    {
      id: 2,
      img: require('../images/SettingImg.png'),
      name: ETranslations.telegram_my_settings,
      arrowRightImg: require('../images/jumpRight.png'),
    },
    {
      id: 3,
      img: require('../images/businessCooperation.png'),
      name: ETranslations.telegram_my_businesscooperation,
      arrowRightImg: require('../images/jumpRight.png'),
    },
  ];
  const navigation = useAppNavigation();

  const fetchUserInfo = async () => {
    const token = await AsyncStorage.getItem('tgToken');

    if (!token) {
      alert('用户没有有效的token信息');
      return;
    }
    const apiUrl = `${CUSTOM_NETWORK_URL}/userinfo/get`; // 替换为你的用户信息接口地址

    try {
      const response = await fetch(apiUrl, {
        method: 'GET', // 如果接口要求其他请求方法，比如 POST，请更改此处
        headers: {
          'Authorization': `${token}`, // 使用 Bearer 方式传递 Token
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // 处理非 2xx 响应
        const errorInfo = await response.json();
        console.error('Failed to fetch user info:', errorInfo);
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const userInfo = await response.json(); // 解析响应数据
      console.log('User Info:', userInfo);
      return userInfo; // 返回用户信息
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error; // 将错误抛出以便外部捕获
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchUserInfo()
        .then((res) => {
          if (res.code === 200) {
            setUserInfo({
              nick: res.data.nick,
              profilePicture: res.data.profilePicture,
              username: res.data.username,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isFocused]);
  
  return (
    <Page fullPage>
      <Page.Header headerShown={false}  />
      <Page.Body>
        <Stack
          flex={1}
          style={{
            backgroundColor: '#F6F5FA',
          }}
        >
          {/* head */}

          <Text
            style={{
              textAlign: 'center',
              fontWeight: '600',
              fontSize: 20,
              paddingTop: 20,
              paddingBottom: 26,
              backgroundColor: 'white',
              // paddingBottom:16,
            }}
          >
          {intl.formatMessage({ id: ETranslations.telegram_my_mine })}
          </Text>

          {/* 用户信息 */}
          <Pressable
            onPress={()=>{
            
              navigation.navigate('telegram',{
                screen : 'TgChat',
               
                params:{
                  screen : 'TgChatHome',
                  params: {
                    action : 'openSettings'
                  }
                }
            
                
              })
            }}
          >

          <View
            style={{
              display: 'flex',
              // height: 48,
              flexDirection: 'row',
              backgroundColor: 'white',
              alignItems: 'center',
              // justifyContent: 'space-between',
              margin: 16,
              padding: 12,
              borderRadius: 12,
            }}
          >
            <Image
              src={userInfo.profilePicture}
              style={{
                height: 48,
                width: 48,
                borderRadius: 24,
              }}
            ></Image>
            <View>
              <Text
                style={{
                  fontSize: 17,
                  marginTop: 0,
                  marginLeft: 8,
                }}
              >
                {userInfo.nick || 'Nick'}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: 0,
                  marginLeft: 8,
                  color: 'rgba(0,0,0,.4)',
                }}
              >
                {`@ ${userInfo.username}`}
              </Text>
            </View>
          </View>
          </Pressable>
          {/* 进入钱包 */}
          <TouchableOpacity
            style={{
              marginHorizontal: 12,
              // marginTop: 30,
            }}
            activeOpacity={0.8}
            onPress={() => {
              navigation.push('main');
            }}
          >
            <View
              style={{
                height: 70,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#3467FE',
                borderRadius: 12,
                paddingHorizontal: 16,
              }}
            >
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  height: '100%',
                }}
              >
                <Icon size="$12" color="white" name="WalletCardSolid"></Icon>
                <Text
                  style={{
                    color: 'white',
                    textAlignVertical: 'center',
                    height: 20,
                    lineHeight: 20,
                    marginLeft: 4,
                  }}
                >
                {intl.formatMessage({ id: ETranslations.telegram_my_xchatwallet })}
                </Text>
              </View>

              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  height: '100%',
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    textAlignVertical: 'center',
                    height: 20,
                    lineHeight: 20,
                    marginRight: 4,
                  }}
                >
                {intl.formatMessage({ id: ETranslations.telegram_my_usewallet })}
                </Text>
                <Icon size="$4" color="white" name="ArrowRightOutline"></Icon>
              </View>
            </View>
          </TouchableOpacity>
          {
            mySettings.map((item,index)=>(
              <Pressable key={index} onPress={item.id==0?()=>navigation.push('TgMyMoney'):(item.id==2?()=>{
                navigation.navigate('telegram',{screen : 'TgChat',params:{screen : 'TgChatHome',params: {action : 'openSettings'}}})
              }:item.id==1?()=>navigation.push('TgAboutUs'):()=>navigation.push('BusinessCooperation'))}>
                <View style={styles.mySettings}>
                  <View style={styles.mySettingsContent}>
                    <Image style={styles.mySettingsImg} source={item.img}/>
                    <Text style={styles.mySettingsName}>{intl.formatMessage({ id: item.name })}</Text>
                  </View>
                  <Image source={item.arrowRightImg} style={{width: 14,height: 14}}/>
                </View>
              </Pressable>
            ))
          }     
        </Stack>
      </Page.Body>
    </Page>
  );
}

const styles = StyleSheet.create({
  itemCard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
  },
  itemCardText: {
    fontWeight: '600',
  },
  mySettings:{
    width: '95%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 15,
    marginLeft: '2.5%',
    padding: 12,
    borderRadius: 8,
  },
  mySettingsContent:{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  mySettingsImg:{
    width: 24,
    height: 24,
    marginRight: 10,
  },
  mySettingsName:{
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  }
});
export default MobileBrowser;
