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
  Swiper,
  YStack,
} from '@onekeyhq/components';

import {
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  View,
  Text,
  TouchableOpacity,
  Touchable,
  StyleSheet,
  ScrollView,
  Image,
  Pressable
} from 'react-native';
import { wrap } from 'lodash';
import { useIntl } from 'react-intl';
import { ETranslations } from '@onekeyhq/shared/src/locale';
import { CUSTOM_NETWORK_URL } from '@onekeyhq/shared/src/config/appConfig';


const mockList = [
  {
    name: '链捕手 ChainCatcher',
    time: '2024-12-02 02:31 PM',
    desc: 'HashKey Global推出全行业最低挂单费率的流动性激励计划',
    id: '1',
  },
  {
    name: '链捕手 ChainCatcher',
    time: '2024-12-02 02:31 PM',
    id: '2',
    desc: 'IALCHEMIST Al: Azarus Alchemicus 将仅由 ALCH 代币提供支持，且不会发行新代币】Foresight News 消息，无代码开发平台 ALCHEMIST AI发推表示，AI代理 AzarusAlchem',
  },
  {
    name: '链捕手 ChainCatcher',
    time: '2024-12-02 02:31 PM',
    id: '3',
    desc: 'HashKey Global推出全行业最低挂单费率的流动性激励计划',
  },
  {
    name: '链捕手 ChainCatcher',
    time: '2024-12-02 02:31 PM',
    id: '4',
    desc: 'HashKey Global推出全行业最低挂单费率的流动性激励计划',
  },
  {
    name: '链捕手 ChainCatcher',
    time: '2024-12-02 02:31 PM',
    id: '5',
    desc: '123321123',
  },
  {
    name: '链捕手 ChainCatcher',
    id: '6',
    time: '2024-12-02 02:31 PM',
    desc: 'HashKey Global推出全行业最低挂单费率的流动性激励计划HashKey Global推出全行业最低挂单费率的流动性激励计划HashKey Global推出全行业最低挂单费率的流动性激励计划HashKey Global推出全行业最低挂单费率的流动性激励计划HashKey Global推出全行业最低挂单费率的流动性激励计划HashKey Global推出全行业最低挂单费率的流动性激励计划',
  },
];

function MobileBrowser() {
  const intl = useIntl();
  const isFocused = useIsFocused();

  const [list,setList] = useState([])

  const fetchList = async () => {
    const token = await AsyncStorage.getItem('tgToken');

    if (!token) {
      alert('用户没有有效的token信息');
      return;
    }
    const apiUrl = `${CUSTOM_NETWORK_URL}/hot/Recommend`; // 替换为你的用户信息接口地址

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
      fetchList()
        .then((res) => {
          if (res.code === 200) {
           setList(
            res.data.map(d=>({
              name : d.name,
              time: d.createTime,
              id:d.id,
              desc:d.title,
              profilePicture:d.profilePicture,
              channelId : d.channelId || '-1002475865118'
            }))
           )
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isFocused]);
  const navigation = useAppNavigation();
  return (
    <Page fullPage>
      <Page.Header headerShown={false} />
      <Page.Body>
        <Stack
          flex={1}
          style={
            {
              backgroundColor: '#F6F5FA',
            }
          }
        >
          <View
            style={{
              display:'flex',
              flexDirection:'row',
              justifyContent:'center',
              marginVertical:20
              
            }}
          >
            <Text style={{fontSize:18}}>{intl.formatMessage({ id: ETranslations.telegram_channels_channels })}</Text>
          </View>
          <ScrollView style={{}} showsVerticalScrollIndicator={false}  bounces={false} overScrollMode='never'>
            {/* list */}

            {list.map((data,index) => (

              <Pressable
                key={index}
                onPress={()=>{
                  navigation.navigate('telegram',{
                    screen : 'TgChat',
                   
                    params:{
                      screen : 'TgChatHome',
                      params: {
                        action : 'toChannel',
                        channelId : data.channelId
                      }
                    }
                
                    
                  })
                }}
              >

              <View style={{
                borderTopColor:'rgba(0,0,0,.1)',
                borderTopWidth: index ===0?0:6 ,
                paddingHorizontal: 0
              }}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: 16,
                    gap: 16,
                  }}
                >
                  <View>
                    <Image
                      source={
                        {
                          uri: data.profilePicture
                        }
                      }
                      style={{
                        width: 40,
                        height: 40,
                       
                        borderRadius: 20,
                      }}
                    ></Image>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        height: 40,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color: 'rgba(0,0,0,.4)',
                          fontWeight: '500',
                          fontSize: 16,
                        }}
                      >
                        {data.name}
                      </Text>
                      <Text
                        style={{
                          color: 'rgba(0,0,0,.3)',
                          fontSize:13
                        }}
                      >
                        {data.time}
                      </Text>
                    </View>
                    <Text style={{ marginTop: 8 }}>{data.desc}</Text>
                  </View>
                </View>
              </View>
              </Pressable>
            ))}

            {/* head */}
          </ScrollView>
        </Stack>
      </Page.Body>
    </Page>
  );
}

const styles = StyleSheet.create({
  mask: {
    position: 'absolute',
    top: '50%', // 垂直中心
    left: '50%', // 水平中心
    width: 50,
    height: 50,
    transform: [{ translateY: -25 }, { translateX: -25 }],
  },
});
export default MobileBrowser;
