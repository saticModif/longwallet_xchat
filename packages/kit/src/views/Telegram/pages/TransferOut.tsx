import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Page,
  Stack,
  Icon,
  XStack,
  useMedia,
  useSafeAreaInsets,
  Image,
  Button,
  QRCode,
  Input,
  Label,
  Toast
} from '@onekeyhq/components';
import { ListItem } from '@onekeyhq/kit/src/components/ListItem';
import useAppNavigation from '@onekeyhq/kit/src/hooks/useAppNavigation';
import * as Clipboard from 'expo-clipboard';
import { useRoute } from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { wrap } from 'lodash';
import { CUSTOM_NETWORK_URL } from '@onekeyhq/shared/src/config/appConfig';


const submitApi = async (params) => {
  const token = await AsyncStorage.getItem('tgToken');

  if (!token) {
    alert('用户没有有效的token信息');
    return;
  }
  const apiUrl = `${CUSTOM_NETWORK_URL}/userinfo/userWithdrawalByToken`; // 替换为你的用户信息接口地址
  
  try {
 
    const response = await fetch(apiUrl, {
      method: 'POST', // 如果接口要求其他请求方法，比如 POST，请更改此处
      headers: {
        'Authorization': `${token}`, // 使用 Bearer 方式传递 Token
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({
          "tokenId": 3,
          ...params
      })
    });

    if (!response.ok) {
      // 处理非 2xx 响应
      const errorInfo = await response.json();
      console.error('转出', errorInfo);
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const userInfo = await response.json(); // 解析响应数据
    console.log('转出 info', userInfo);
    return userInfo; // 返回用户信息
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error; // 将错误抛出以便外部捕获
  } 
};

function MobileBrowser() {
  const navigation = useAppNavigation();
  const route = useRoute();
  const { desc, logo, depositAddress } = route.params;
  const [toAddress,setToAddress] = useState()
  const [amount,setAmount] = useState()
  const [loading,setLoading] = useState(false)

  const submit = async ()=>{
    setLoading(true)
    try {
      const res = await submitApi({amount,toAddress})
      if(res.code == 200){
        alert('转出成功')
      }
    } catch (error) {
      
    } finally {
      setLoading(false)
    }
  }


  return (
    <Page fullPage>
      <Page.Header headerShown={false} shouldPopOnClickBackdrop />
      <Page.Body>
        <Stack flex={1} style={{}}>
          <View
            style={{
              paddingVertical: 40,
              backgroundColor: 'black',
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
                  navigation.pop(1);
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
                  {`转出 ${desc}`}
                </Text>
              </View>
              <Icon
                color="white"
                name="ArrowLeftOutline"
                style={{ opacity: 0 }}
              ></Icon>
            </View>
          </View>
          <View style={{ paddingHorizontal: 20 }}>
            <Label size="$10">转出地址：</Label>

            <Input value={toAddress}
              onChangeText={text=>setToAddress(text)}
            ></Input>
            <Label size="$10">转出金额：</Label>

            <Input
              value={amount}
              onChangeText={text=>setAmount(text)}
            ></Input>
            <Button loading={loading} onPress={submit} style={{marginTop:20}}>确认</Button>
          </View>
        </Stack>
      </Page.Body>
    </Page>
  );
}

export default MobileBrowser;
