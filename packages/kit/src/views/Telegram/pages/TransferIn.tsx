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

function MobileBrowser() {
  const navigation = useAppNavigation();
  const route = useRoute()
  const {desc,logo,depositAddress} = route.params
  useEffect(() => {}, []);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(depositAddress)
  
  };
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
                  {`转入 ${desc}`}
                </Text>
              </View>
              <Icon
                color="white"
                name="ArrowLeftOutline"
                style={{ opacity: 0 }}
              ></Icon>
            </View>
          </View>
          <View
            style={{
              marginHorizontal: 12,
            }}
          >
            {/* QRCODE */}
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'row',
                marginTop: 60,
              }}
            >
              <QRCode
                logo={{
                  uri: logo
                }}
                value={depositAddress}
                size={200}
              ></QRCode>
            </View>
            <Text style={{marginTop:20,textAlign:'center',fontWeight:'600'}}>转入地址</Text>
            <Text style={{marginTop:40,textAlign:'center',fontWeight:'500'}}>{depositAddress}</Text>
            <Button 
              onPress={()=>{
                handleCopy()
              }}
              pressStyle={{opacity:0.8}}
              backgroundColor="#FFAA00"
              style={{
                marginTop:40,
                
                color:'white'
              }}
            >复制地址</Button>
            <Text style={{fontWeight:'600',marginVertical:10}}>温馨提示</Text>
            <Text>
              此地址只支持充值
              <Text style={{color:'blue'}}>{desc}</Text>
              ，其他任何资产充值将不可找回
            </Text>
          </View>
        </Stack>
      </Page.Body>
    </Page>
  );
}

export default MobileBrowser;
