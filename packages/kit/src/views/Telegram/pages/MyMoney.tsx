import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Page,
  Stack,
  Icon,
  XStack,
  useMedia,
  useSafeAreaInsets,
} from '@onekeyhq/components';
import { ListItem } from '@onekeyhq/kit/src/components/ListItem';
import useAppNavigation from '@onekeyhq/kit/src/hooks/useAppNavigation';
import {
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  View,
  Image,
  Text,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { wrap } from 'lodash';
import { useIntl } from 'react-intl';
import { ETranslations } from '@onekeyhq/shared/src/locale';
import { CUSTOM_NETWORK_URL } from '@onekeyhq/shared/src/config/appConfig';


export const TOKENDATA = [
  {
    src: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/btc.png',
    title: 'BTC',
    subtitle: '30.00 BTC',
    price: '$900,000.00',
    onePrice: '30,000.00',
 
  },
  {
    src: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/eth.png',
    title: 'Ethereum',
    subtitle: '2.35 ETH',
    price: '$3,836.97',
    onePrice: '--',
 
  },

];
function MobileBrowser() {
  const intl = useIntl();
  const navigation = useAppNavigation();
  const [totalAmount,setTotalAmount] = useState('')
  const [data,setData] = useState([])
  const fetchData = async () => {
    const token = await AsyncStorage.getItem('tgToken')
   
    if(!token){
     alert('用户没有有效的token信息') 
     return
    }
    const apiUrl = `${CUSTOM_NETWORK_URL}/userinfo/getToken`; 
  
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
  
      const data = await response.json(); // 解析响应数据
      if(data.code ===200){
        console.log('[Telegram] User token (truncated):', data.data.List[0].userToken.slice(0,6) + '...');
        const {List,totalAmount} = data.data;
        setTotalAmount(totalAmount)
        setData(List?.map(l=>({
          src : l.tokenLogo,
          title: l.tokenSymbol,
          subtitle: l.userToken.amount,
          price : `$${l.userToken.price}`,
          onePrice: `$${l.price}`,
          total: `$${l.userToken.amount * l.price}`,
          id: l.id,
          amount:l.userToken.amount || 0,
          ...l
        })))
      }
      console.log('data:', data.data);
      return data; // 返回用户信息
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error; // 将错误抛出以便外部捕获
    }
  };
  useEffect(() => {fetchData()}, []);

  return (
    <Page fullPage>
      <Page.Header headerShown={false} shouldPopOnClickBackdrop />
      <Page.Body>
        <Stack flex={1} style={{}}>
          <View
            style={{
              paddingVertical: 40,
              backgroundColor: '#3467FE',
              paddingHorizontal: 12,
            }}
          >
            {/* Header */}
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                // backgroundColor:'red',
              }}
            >
              <Pressable
                onPress={() => {
                  navigation.replace('TgMe');
                }}
              >
                <Icon color="white" name="ArrowLeftOutline"></Icon>
              </Pressable>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                    verticalAlign: 'top',
                    textAlignVertical: 'top',
                    lineHeight: 18,
                  }}
                >
                {intl.formatMessage({ id: ETranslations.telegram_my_wallet })}
                </Text>
              </View>
              <Icon color="white" name="PlusLargeOutline"></Icon>
            </View>
            {/* 余额 */}
            <View>
              <Text
                style={{
                  color: 'white',
                  fontSize: 12,
                  fontWeight: '400',
                  textAlign: 'center',
                  marginTop: 20,
                }}
              >
              {intl.formatMessage({ id: ETranslations.telegram_my_balance })}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 26,
                  fontWeight: '500',
                  textAlign: 'center',
                  marginTop: 20,
                }}
              >
                {`$${totalAmount}`}
              </Text>
            </View>
          </View>
            {/* 币列 */}
            <View
              style={{marginTop:20}}
            >
              {data.map((item) => (
                <ListItem
                  key={item.id}
                  title={item.title}
                  subtitle={item.onePrice}
                  avatarProps={{
                    src: item.src,
               
                  }}
                  onPress={() => {
                    navigation.replace('TgLuckMoneyDetail',{
                      id: item.id,
                      unit: item.title,
                      amount: item.amount,
                      price : item.userToken.price,
                      desc : `${item.title}(${item.netType})`,
                      logo: item.tokenLogo,
                      depositAddress : item.depositAddress
                    })
                  }}
                >
                  <ListItem.Text
                    align="right"
                    primary={item.amount}
                    secondary={item.total}
                    // secondaryTextProps={{
                    //   color:
                    //     parseFloat(item.change) >= 0
                    //       ? '$textSuccess'
                    //       : '$textCritical',
                    // }}
                  />
                </ListItem>
              ))}
            </View>
        </Stack>
      </Page.Body>
    </Page>
  );
}

export default MobileBrowser;
