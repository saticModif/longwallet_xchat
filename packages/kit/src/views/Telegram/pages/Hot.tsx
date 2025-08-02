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
  ImageBackground,
  ScrollView,
  Linking,
} from 'react-native';
import { set, wrap } from 'lodash';
import url from '@onekeyhq/kit-bg/src/services/ServiceScanQRCode/utils/parseQRCode/handlers/url';
import { useIntl } from 'react-intl';
import { ETranslations } from '@onekeyhq/shared/src/locale';
import { CUSTOM_NETWORK_URL } from '@onekeyhq/shared/src/config/appConfig';


const mockList = [
  {
    name: '刘一',
    index: '4',
    favoriteCount: '9w',
    id: '4',
  },
  {
    name: '刘二',
    index: '5',
    favoriteCount: '8w',
    id: '5',
  },
  {
    name: '刘三',
    index: '6',
    favoriteCount: '7w',
    id: '6',
  },
  {
    name: '刘四',
    index: '7',
    favoriteCount: '6w',
    id: '7',
  },
  {
    name: '刘五',
    index: '8',
    favoriteCount: '5w',
    id: '8',
  },
];
const title = [
  {
    id: 0,
    name: ETranslations.telegram_hot_Trending
  },
  {
    id: 1,
    name: ETranslations.telegram_hot_discover,
  },
];

const chainCoins = [
  {
    id: 0,
    img: require('../images/btc.png'),
    name: 'BTC',
  },
  {
    id: 1,
    img: require('../images/tron.png'),
    name: 'POL',
  },
  {
    id: 2,
    img: require('../images/eos.png'),
    name: 'ETH',
  },
  {
    id: 3,
    img: require('../images/iost.png'),
    name: 'BNB',
  },
  {
    id: 4,
    img: require('../images/optimism.png'),
    name: 'TRX',
  },
];

const circlesAndAttention = [
  {
    id: 0,
    name: '申请圈子',
    img: require('../images/jumpRight.png'),
  },
  {
    id: 1,
    name: '我的关注',
    img: require('../images/jumpRight.png'),
  },
];

function MobileBrowser() {
  const intl = useIntl();
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const [titleId, setTitleId] = useState(0);
  const [nameId, setNameId] = useState(0);
  const [popularId, setPopularId] = useState(0);
  const [showhideStatus, setShowhideStatus] = useState(false);
  const [popularChainCoinsTitleName, setPopularChainCoinsTitleName] =
    useState('');
  const [popularChainCoinsTitle, setPopularChainCoinsTitle] = useState([]);
  const [popularChainCoins, setPopularChainCoins] = useState([]);
  const [popularCommunities, setPopularCommunities] = useState('');
  const [popularCommunitiesTitle, setPopularCommunitiesTitle] = useState([]);
  const [popularCommunitiesContent, setPopularCommunitiesContent] = useState(
    [],
  );

  const handleTitle = (id: number) => {
    setTitleId(id);
  };

  const handleSelectName = (id: number) => {
    setNameId(id);
  };

  const handlepopularCommunities = (id: number) => {
    setPopularId(id);
  };

  const showhide = () => {
    setShowhideStatus(!showhideStatus);
  };

  const handlePopularChainCoins = async (url: any) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      alert(`无法打开该链接: ${url}`);
    }
  };

  const fetchUserInfo = async () => {
    const token = await AsyncStorage.getItem('tgToken');
    console.log('[Telegram] Token received (truncated):', token.slice(0,6) + '...');
    if (!token) {
      alert('用户没有有效的token信息');
      return;
    }
    const apiUrl = `${CUSTOM_NETWORK_URL}/hot/getRank`; // 替换为你的用户信息接口地址

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

  const discover = async () => {
    const token = await AsyncStorage.getItem('tgToken');
    console.log('[Telegram] Token processed (truncated):', token.slice(0,6) + '...');
    if (!token) {
      alert('用户没有有效的token信息');
      return;
    }
    const apiUrl = `${CUSTOM_NETWORK_URL}/hot/getHotListClassify`;

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
        console.error('Failed to fetch discover info:', errorInfo);
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const discoverInfo = await response.json();
      console.log('discover Info:', discoverInfo);
      return discoverInfo;
    } catch (error) {
      console.error('Error fetching discover info:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (isFocused) {
      discover().then((res) => {
        console.log(res);
        if (res.code === 200) {
          const popularCoins = res.data[0].childList.map(
            (item: any, index: number) => {
              return {
                id: index,
                name: item.classifyName,
              };
            },
          );
          setPopularChainCoinsTitleName(res.data[0].classifyName);
          setPopularCommunities(res.data[1].classifyName);
          setPopularChainCoinsTitle(popularCoins);

          const popularCommunities = res.data[1].childList.map(
            (item: any, index: number) => {
              return {
                id: index,
                name: item.classifyName,
              };
            },
          );
          setPopularCommunitiesTitle(popularCommunities);
          let newCoins: any = [];
          let popularCommunitiesCoins: any = [];

          popularCoins.map((item: any) => {
            for (let i = 0; i < res.data[0].childList.length; i++) {
              if (res.data[0].childList[i].classifyName == item.name) {
                if (nameId == i) {
                  newCoins = res.data[0].childList[i].itemList.map(
                    (item: any, index: number) => {
                      return {
                        id: index,
                        img: { uri: item.avatar },
                        name: item.communityName,
                        url: item.communityUrl,
                      };
                    },
                  );

                  console.log(newCoins);
                }
              }
            }
          });
          setPopularChainCoins(newCoins);

          popularCommunities.map((item: any) => {
            for (let i = 0; i < res.data[1].childList.length; i++) {
              if (res.data[1].childList[i].classifyName == item.name) {
                if (popularId == i) {
                  popularCommunitiesCoins = res.data[1].childList[
                    i
                  ].itemList.map((item: any, index: number) => {
                    return {
                      id: index,
                      img: { uri: item.avatar },
                      name: item.communityName,
                      collect: require('../images/collect.png'),
                      quantity:
                        '+' +
                        parseFloat((item.likeCount / 10000).toFixed(1)) +
                        'w',
                      communityUrl: item.communityUrl,
                    };
                  });
                  console.log(popularCommunitiesCoins);
                }
              }
            }
          });
          setPopularCommunitiesContent(popularCommunitiesCoins);
        }
      });
    }
  }, [nameId, popularId,isFocused]);

  useEffect(() => {
    if (isFocused) {
      fetchUserInfo()
        .then((res) => {
          console.log(res);
          if (res.code === 200) {
            const tmpArr = res.data;
            setData(
              tmpArr.map((t, i) => ({
                index: i + 1,
                name: t.name,
                favoriteCount: t.likeCount,
                profilePicture: t.profilePicture,
                id: t.id,
                channelId: t.channelId || '-1002475865118',
              })),
            );
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
        <View style={styles.title}>
          {title.map((item, index) => (
            <Pressable key={index} onPress={() => handleTitle(item.id)}>
              <Text
                style={[
                  titleId == item.id
                    ? styles.selectTitleName
                    : styles.defaultTitleName,
                  item.id == 0 ? { marginRight: 20 } : null,
                ]}
              >
                {intl.formatMessage({ id: item.name })}
              </Text>
            </Pressable>
          ))}
        </View>
        {data.length > 0 && titleId == 0 && (
          <Stack
            flex={1}
            style={{
              backgroundColor: '#fff',
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              overScrollMode="never"
            >
              <View
                style={{
                  height: 300,
                  backgroundColor: '#3467FE',
                  position: 'relative',
                }}
              >
                {/* top2 */}
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: -110,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  <View style={{ position: 'relative' }}>
                    <Pressable
                      onPress={() => {
                        navigation.navigate('telegram', {
                          screen: 'TgChat',

                          params: {
                            screen: 'TgChatHome',
                            params: {
                              action: 'toChannel',
                              channelId: data[1].channelId,
                            },
                          },
                        });
                      }}
                    >
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        <Image
                          //  src={data[1].profilePicture}

                          source={{
                            uri: data[1].profilePicture,
                          }}
                          style={{ borderRadius: 20, width: 40, height: 40 }}
                        ></Image>
                        <Image
                          source={require('../images/secondMask.png')}
                          style={styles.mask}
                        ></Image>
                      </View>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#fff',
                          marginBottom: 10,
                        }}
                      >
                        {data[1].name}
                      </Text>
                    </Pressable>
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 50,
                        width: '100%',
                      }}
                    >
                      <Text
                        style={{
                          color: '#3467FE',
                          zIndex: 10,
                          fontWeight: '600',
                          textAlign: 'center',
                        }}
                      >
                        TOP.2
                      </Text>
                    </View>
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 95,
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                      }}
                    >
                      <Icon
                        name="HeartSolid"
                        width={14}
                        height={14}
                        color="red"
                      />
                      <Text style={{ fontSize: 12, fontWeight: '600' }}>
                        {`+${data[1].favoriteCount}`}
                      </Text>
                    </View>
                    <Image
                      style={{
                        width: 80,
                        height: 120,
                      }}
                      source={require('../images/box.png')}
                    ></Image>
                  </View>
                </View>
                {/* top1 */}
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  <View style={{ position: 'relative' }}>
                    <Pressable
                      onPress={() => {
                        navigation.navigate('telegram', {
                          screen: 'TgChat',

                          params: {
                            screen: 'TgChatHome',
                            params: {
                              action: 'toChannel',
                              channelId: data[0].channelId,
                            },
                          },
                        });
                      }}
                    >
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        <Image
                          source={{
                            uri: data[0].profilePicture,
                          }}
                          style={{ borderRadius: 20, width: 40, height: 40 }}
                        ></Image>
                        <Image
                          source={require('../images/firstMask.png')}
                          style={styles.mask}
                        ></Image>
                      </View>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#fff',
                          marginBottom: 10,
                        }}
                      >
                        {data[0].name}
                      </Text>
                    </Pressable>
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 70,
                        width: '100%',
                      }}
                    >
                      <Text
                        style={{
                          color: '#3467FE',
                          zIndex: 10,
                          fontWeight: '600',
                          textAlign: 'center',
                        }}
                      >
                        TOP.1
                      </Text>
                    </View>
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 120,
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 100,
                      }}
                    >
                      <Icon
                        name="HeartSolid"
                        width={16}
                        height={16}
                        color="red"
                      />
                      <Text style={{ fontSize: 14, fontWeight: '600' }}>
                        {`+${data[0].favoriteCount}`}
                      </Text>
                    </View>
                    <Image
                      style={{
                        width: 100,
                        height: 150,
                      }}
                      source={require('../images/box.png')}
                    ></Image>
                  </View>
                </View>
                {/* top3 */}
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 110,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  <View style={{ position: 'relative' }}>
                    <Pressable
                      onPress={() => {
                        navigation.navigate('telegram', {
                          screen: 'TgChat',

                          params: {
                            screen: 'TgChatHome',
                            params: {
                              action: 'toChannel',
                              channelId: data[2].channelId,
                            },
                          },
                        });
                      }}
                    >
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        <Image
                          source={{
                            uri: data[2].profilePicture,
                          }}
                          style={{ borderRadius: 20, width: 40, height: 40 }}
                        ></Image>
                        <Image
                          source={require('../images/thirdMask.png')}
                          style={styles.mask}
                        ></Image>
                      </View>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#fff',
                          marginBottom: 10,
                        }}
                      >
                        {data[2].name}
                      </Text>
                    </Pressable>
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 35,
                        width: '100%',
                      }}
                    >
                      <Text
                        style={{
                          color: '#3467FE',
                          zIndex: 10,
                          fontWeight: '600',
                          textAlign: 'center',
                        }}
                      >
                        TOP.3
                      </Text>
                    </View>
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 70,
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                      }}
                    >
                      <Icon
                        name="HeartSolid"
                        width={12}
                        height={12}
                        color="red"
                      />
                      <Text style={{ fontSize: 10, fontWeight: '600' }}>
                        {`+${data[2].favoriteCount}`}
                      </Text>
                    </View>
                    <Image
                      style={{
                        width: 80,
                        height: 90,
                      }}
                      source={require('../images/box.png')}
                    ></Image>
                  </View>
                </View>
              </View>
              <View
                style={{
                  borderRadius: 12,

                  paddingTop: 10,
                  backgroundColor: '#fff',
                  transform: [{ translateY: -18 }],
                }}
              >
                {data.slice(3).map((m) => (
                  <Pressable
                    key={m.id}
                    onPress={() => {
                      navigation.navigate('telegram', {
                        screen: 'TgChat',

                        params: {
                          screen: 'TgChatHome',
                          params: {
                            action: 'toChannel',
                            channelId: m.channelId,
                          },
                        },
                      });
                    }}
                  >
                    <View
                      key={m.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: '#F6F5FA',
                      }}
                    >
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 20, marginRight: 8 }}>
                          {m.index}
                        </Text>
                        <Image
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                          }}
                          source={{
                            uri: m.profilePicture,
                          }}
                        ></Image>
                        <Text
                          style={{
                            fontWeight: '600',
                            fontSize: 16,
                            marginLeft: 8,
                          }}
                        >
                          {m.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Icon
                          name="HeartSolid"
                          width={18}
                          height={18}
                          color="red"
                        />
                        <Text style={{ fontSize: 16, fontWeight: '600' }}>
                          {`+${m.favoriteCount}`}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </Stack>
        )}
        {titleId == 1 && (
          <View style={styles.discover}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              overScrollMode="never"
            >
              <ImageBackground
                source={require('../images/gate.png')}
                resizeMode="stretch"
                style={styles.discoverBg}
              />
              {/* <View style={styles.networkNode}>
                {chainCoins.map((item, index) => (
                  <View key={index}>
                    <Image style={styles.chainCoinsImg} source={item.img} />
                    <Text style={styles.chainCoinsName}>{item.name}</Text>
                  </View>
                ))}
              </View> */}
              <View style={styles.chainCurrency}>
                <Image
                  style={styles.chainCurrency_img}
                  source={require('../images/chainCurrency_img.png')}
                />
                <Text style={styles.chainCurrencyName}>
                {intl.formatMessage({ id: ETranslations.telegram_hot_populartokens })}
                </Text>
              </View>
              <View style={styles.popularChainCoinsTitle}>
                {popularChainCoinsTitle.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      item.id != 3 ? { marginRight: 40 } : null,
                      { alignItems: 'center' },
                    ]}
                  >
                    <Text
                      style={
                        nameId == item.id
                          ? styles.selectName
                          : styles.defaultName
                      }
                      onPress={() => handleSelectName(item.id)}
                    >
                      {item.name}
                    </Text>
                    <View
                      style={
                        nameId == item.id
                          ? styles.selectUnderline
                          : styles.defaultUnderline
                      }
                    />
                  </View>
                ))}
              </View>
              <View style={styles.popularChainCoins}>
                {popularChainCoins.map((item, index) => (
                  <Pressable
                    onPress={() => handlePopularChainCoins(item.url)}
                    key={index}
                    style={[
                      { width: '31%' },
                      item.id != 2 ? { marginRight: 10 } : null,
                    ]}
                  >
                    <View style={[styles.popularChainCoinsContent]}>
                      <Image style={styles.chainCoinsImg} source={item.img} />
                      <Text style={styles.chainCoinsName}>{item.name}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
              <View style={styles.chainCurrencyContent}>
                <View style={styles.chainCurrency}>
                  <Image
                    style={styles.chainCurrency_img}
                    source={require('../images/popularCommunities.png')}
                  />
                  <Text style={styles.chainCurrencyName}>
                  {intl.formatMessage({ id: ETranslations.telegram_hot_popularcommunities })}
                  </Text>
                </View>
                <Pressable onPress={() => showhide()}>
                  <Image
                    style={styles.addCircle}
                    source={require('../images/addCircle.png')}
                  />
                </Pressable>
                {showhideStatus && (
                  <View style={styles.circlesAndAttention}>
                    {circlesAndAttention.map((item, index) => (
                      <View
                        style={[
                          styles.circlesAndAttentionContent,
                          item.id == 0 ? { marginBottom: 20 } : null,
                        ]}
                        key={index}
                      >
                        <Text style={styles.circlesAndAttentionName}>
                          {item.name}
                        </Text>
                        <Image style={styles.jumpRight} source={item.img} />
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.popularChainCoinsTitle}>
                {popularCommunitiesTitle.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.popularCommunitiesContent,
                      item.id != 6 ? { marginRight: 15 } : null,
                    ]}
                  >
                    <Text
                      style={
                        popularId == item.id
                          ? styles.selectName
                          : styles.defaultName
                      }
                      onPress={() => handlepopularCommunities(item.id)}
                    >
                      {item.name}
                    </Text>
                    <View
                      style={
                        popularId == item.id
                          ? styles.selectUnderline
                          : styles.defaultUnderline
                      }
                    />
                  </View>
                ))}
              </View>
              <View style={styles.PopularCommunities}>
                {popularCommunitiesContent.map((item, index) => (
                  <Pressable
                    key={index}
                    style={{ width: '31%' }}
                    onPress={() =>
                      navigation.navigate('telegram', {
                        screen: 'TgChat',

                        params: {
                          screen: 'TgChatHome',
                          params: {
                            action: 'toChannel',
                            channelId: item.communityUrl,
                          },
                        },
                      })
                    }
                  >
                    <View key={index} style={styles.popularChainCoinsContent}>
                      <Image style={styles.chainCoinsImg} source={item.img} />
                      <Text style={styles.chainCoinsName}>{item.name}</Text>
                      <Text style={styles.identifier}>{item.identifier}</Text>
                      <View style={styles.collectionQuantity}>
                        <Image source={item.collect} style={styles.collect} />
                        <Text style={styles.quantity}>{item.quantity}</Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
              <View style={styles.loadMore}>
                <Image
                  style={styles.loadMoreImg}
                  source={require('../images/loadMore.png')}
                />
                <Text style={styles.loadMoreName}>加载更多</Text>
              </View>
            </ScrollView>
          </View>
        )}
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
  title: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 15,
  },
  defaultTitleName: {
    color: '#0F0F0F',
    marginTop: 20,
    marginLeft: 12,
    fontSize: 16,
  },
  selectTitleName: {
    color: '#0F0F0F',
    marginTop: 20,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  discover: {
    backgroundColor: '#F6F5FA',
    width: '100%',
    height: '100%',
    paddingHorizontal: 12,
    flex: 1,
  },
  discoverBg: {
    width: '100%',
    height: 200,
    marginTop: 15,
  },
  networkNode: {
    width: '100%',
    backgroundColor: '#fff',
    marginTop: 15,
    borderRadius: 8,
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  defaultName: {
    color: '#313131',
    fontSize: 16,
  },
  selectName: {
    color: '#313131',
    fontSize: 16,
    fontWeight: '600',
  },
  defaultUnderline: {
    height: 4,
    marginTop: 6,
  },
  selectUnderline: {
    width: 18,
    height: 4,
    backgroundColor: '#000',
    marginTop: 6,
    borderRadius: 2,
  },
  chainCurrency: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  chainCurrency_img: {
    width: 22,
    height: 21,
    marginRight: 10,
  },
  chainCurrencyName: {
    color: '#0F0F0F',
    fontSize: 16,
    fontWeight: '600',
  },
  popularChainCoinsTitle: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  popularCommunitiesContent: {
    alignItems: 'center',
  },
  PopularCommunities: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  popularChainCoins: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 15,
  },
  popularChainCoinsContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 20,
    marginTop: 15,
  },
  chainCoinsImg: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  chainCoinsName: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
  },
  chainCurrencyContent: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  addCircle: {
    width: 24,
    height: 24,
  },
  circlesAndAttention: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    position: 'absolute',
    top: 50,
    right: 0,
    zIndex: 100,
  },
  circlesAndAttentionContent: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circlesAndAttentionName: {
    color: '#313131',
    fontSize: 14,
  },
  jumpRight: {
    width: 14,
    height: 14,
  },
  identifier: {
    width: 60,
    color: '#000',
    fontSize: 13,
  },
  collectionQuantity: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  collect: {
    width: 16,
    height: 14,
    marginRight: 5,
  },
  quantity: {
    color: '#666',
    fontSize: 12,
  },
  loadMore: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  loadMoreImg: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  loadMoreName: {
    color: '#666',
    fontSize: 14,
  },
});
export default MobileBrowser;
