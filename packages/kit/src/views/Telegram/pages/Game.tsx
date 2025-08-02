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
  Image,
  LinearGradient,
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
  Pressable,
  ImageBackground,
} from 'react-native';
import { wrap } from 'lodash';
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

const battleRoyale = [
  {
    id: 0,
    title: ETranslations.telegram_entertainment_xchatgames,
    titleImg: require('../images/title_xchatGram.png'),
    name: '15 Games',
    arrowRightImg: require('../images/jumpRight.png'),
    content: [
      {
        id: 0,
        img: require('../images/xchatGram_one.png'),
        name: ETranslations.telegram_entertainment_douyuanchang,
      },
      {
        id: 1,
        img: require('../images/xchatGram_two.png'),
        name: ETranslations.telegram_entertainment_seafishing,
      },
      {
        id: 2,
        img: require('../images/xchatGram_three.png'),
        name: ETranslations.telegram_entertainment_conqueror,
      },
    ]
  },
  {
    id: 1,
    title: ETranslations.telegram_entertainment_battleroyale,
    titleImg: require('../images/battleRoyale.png'),
    name: '15 Games',
    arrowRightImg: require('../images/jumpRight.png'),
    content: [
      {
        id: 0,
        img: require('../images/battleRoyale_one.png'),
        name: ETranslations.telegram_entertainment_bankdefense,
      },
      {
        id: 1,
        img: require('../images/battleRoyale_two.png'),
        name: ETranslations.telegram_entertainment_monkeyescape,
      },
      {
        id: 2,
        img: require('../images/battleRoyale_three.png'),
        name: ETranslations.telegram_entertainment_monkeyking,
      }
    ]

  },
  {
    id: 2,
    title: ETranslations.telegram_entertainment_mininggame,
    titleImg: require('../images/miningGame.png'),
    name: '13 Games',
    arrowRightImg: require('../images/jumpRight.png'),
    content: [
      {
        id: 0,
        img: require('../images/miningGame_one.png'),
        name: ETranslations.telegram_entertainment_undergroundmine,
      },
      {
        id: 1,
        img: require('../images/miningGame_two.png'),
        name: ETranslations.telegram_entertainment_brawlstars,
      },
      {
        id: 2,
        img: require('../images/miningGame_three.png'),
        name: ETranslations.telegram_entertainment_clashofclans,
      }
    ]

  }

];
const support = [
  {
    id: 0,
    img: require('../images/ios.png'),
    application: 'Application',
    name: 'for IOS',
    rightwardsWhiteArrow: require('../images/rightwardsWhiteArrow.png'),
  },
  {
    id: 1,
    img: require('../images/android.png'),
    application: 'Application',
    name: 'for Android',
    rightwardsWhiteArrow: require('../images/rightwardsWhiteArrow.png'),
  }
];
const socialImg = [
  {
    id: 0,
    img: require('../images/telegram.png'),
  },
  {
    id: 1,
    img: require('../images/youTube.png'),
  },
  {
    id: 2,
    img: require('../images/instagram.png'),
  },
  {
    id: 3,
    img: require('../images/twitter.png'),
  },
  {
    id: 4,
    img: require('../images/whatsApp.png'),
  },
  {
    id: 5,
    img: require('../images/Social_last_img.png'),
  },
];

const onlinePayment = [
  {
    id: 0,
    img: require('../images/visa.png')
  },
  {
    id: 1,
    img: require('../images/astro_pay.png')
  },
  {
    id: 2,
    img: require('../images/apple_pay.png')
  },
  {
    id: 3,
    img: require('../images/btc_pay.png')
  },
];

const networkNode = [
  {
    id: 0,
    img: require('../images/jcb_pay.png'),
  },
  {
    id: 1,
    img: require('../images/tron_network.png'),
  },
  {
    id: 2,
    img: require('../images/t_network.png'),
  },
  {
    id: 3,
    img: require('../images/discVer.png'),
  }
];

const platformPayment = [
  {
    id: 0,
    img: require('../images/skrill.png')
  },
  {
    id: 1,
    img: require('../images/google_pay.png')
  },
];

const gameTitle = [
  { 
    id: 0, 
    name: ETranslations.telegram_entertainment_all 
  },
  { 
    id: 1, 
    name: ETranslations.telegram_entertainment_recommend 
  },
  { 
    id: 2, 
    name: ETranslations.telegram_entertainment_battleroyale 
  },
  { 
    id: 3, 
    name: ETranslations.telegram_entertainment_live 
  },
  { 
    id: 4, 
    name: ETranslations.telegram_entertainment_mining 
  },
  { 
    id: 5, 
    name: ETranslations.telegram_entertainment_media 
  },
  { 
    id: 6, 
    name: ETranslations.telegram_entertainment_minigame 
  },
];


const bannerData = [
  {
    imgUrl:
      'https://asset.onekey-asset.com/portal/803ff853ecdd7808b35fdf6f837ae1af514aad56/static/shop-hero-animation-poster-8e1206b59d2201dfaa8cd72a8134179f.jpg',
    title: 'title1',
    onPress: () => console.log('clicked 0'),
  },
  {
    imgUrl:
      'https://asset.onekey-asset.com/portal/803ff853ecdd7808b35fdf6f837ae1af514aad56/static/shop-hero-animation-poster-8e1206b59d2201dfaa8cd72a8134179f.jpg',
    title: 'title2',
    onPress: () => console.log('clicked 1'),
  },
];

function MobileBrowser() {
  const intl = useIntl();
  const isFocused = useIsFocused();
  const [userInfo, setUserInfo] = useState({
    nick: '',
    profilePicture: '',
    username: '',
  });

  const [nameId, setNameId] = useState(0);

  const handleSelectName = (id:number)=>{
    setNameId(id);
  }


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
  const navigation = useAppNavigation();
  const onPress = ()=>{
    alert('功能暂未开放')
  }
  return (
    <Page fullPage >
      <Page.Header headerShown={false} />
      <Page.Body >
        <Stack flex={1} >
            <LinearGradient
      
              colors={['#FEF9F1', '#FBF1FA', '#EBF4FD','#EFFCF3']}
              style={{ paddingHorizontal: 16,flex:1}}
     
            >
          <View style={{ marginVertical: 30 }}>
            <Text
              style={{
                fontSize: 20,
                textAlign: 'center',
                fontWeight: '600',
              }}
            >
           {intl.formatMessage({ id: ETranslations.telegram_entertainment_gameplaza })}
            </Text>
          </View>    
               <View style={styles.popularChainCoinsTitle}>
                {
                  gameTitle.map((item,index)=>(
                    <View key={index} style={[styles.popularCommunitiesContent,item.id%3!==gameTitle.length-1?{marginRight: 15}:null]}>
                      <Text style={nameId == item.id ? styles.selectName : styles.defaultName} onPress={() => handleSelectName(item.id)}>{intl.formatMessage({ id: item.name })}</Text>
                      <View style={nameId == item.id ? styles.selectUnderline : styles.defaultUnderline} />
                    </View>
                  ))
                }
              </View>
            <ScrollView showsVerticalScrollIndicator={false}  bounces={false} overScrollMode='never'>
              <View>
                <Swiper
                  autoplay
                  autoplayDelayMs={2000}
                  autoplayLoop
                  height="$56"
                  data={bannerData}
                  renderItem={({ item }) => (
                    <YStack onPress={item.onPress} alignItems="center">
                      <Image
                        style={{borderRadius:12}}
                        width="100%"
                        height="$52"
                        source={require('../images/gameHome1.png')}
                      />
                    </YStack>
                  )}
                  renderPagination={({ currentIndex }) => (
                    <XStack
                      gap="$1"
                      position="absolute"
                      right="$5"
                      bottom="$24"
                    >
                      {bannerData.map((_, index) => (
                        <Stack
                          key={index}
                          w="$3"
                          $gtMd={{
                            w: '$4',
                          }}
                          h="$1"
                          borderRadius="$full"
                          bg="$whiteA12"
                          opacity={currentIndex === index ? 1 : 0.5}
                        />
                      ))}
                    </XStack>
                  )}
                />
                <View
                  style={{
                    display: 'flex',
                    height: 80,
                    flexDirection: 'row',
                  }}
                >

             
                  <Pressable style={{ height: '100%', flex: 1, marginRight: 5,position:'relative' }} onPress={onPress}>
                    <Image
                      
                      style={{borderRadius:8, borderTopRightRadius: 16 }}
                      source={require('../images/receiveImg.png')}
                    />
                    <Text style={{color:'#fff',position:'absolute',left:12,top:16,fontSize:18,fontWeight:'600'}}>{intl.formatMessage({ id: ETranslations.telegram_entertainment_claimcoins })}</Text>
                  </Pressable>

                  <Pressable style={{ height: '100%', flex: 1, marginLeft: 5,position:'relative' }} onPress={onPress}>
                    <Image
                      style={{borderRadius:8, borderTopLeftRadius: 16 }}
                      source={require('../images/cooperate.png')}
                    />
                    <Text style={{color:'#fff',position:'absolute',left:12,top:16,fontSize:18,fontWeight:'600'}}>{intl.formatMessage({ id: ETranslations.telegram_entertainment_promotion })}</Text>
                  </Pressable>
                </View>
                <View style={{ height: 100, marginVertical: 15 }}>
                  <Image
                    style={{borderRadius:8}}
                    source={require('../images/TableGames.png')}
                  />
                </View>
                {
                  battleRoyale.map((item,index)=>(
                    <View style={styles.games} key={index}>
                      <View style={styles.titleContent}>
                        <View style={styles.titleContentLeft}>
                          <Image source={item.titleImg} style={styles.titleImg}/>
                          <Text style={styles.title}>{intl.formatMessage({ id: item.title })}</Text>
                        </View>
                        <View style={styles.titleContentRight}>
                          <Text style={styles.titleName}>{item.name}</Text>
                          <Image source={item.arrowRightImg} style={styles.arrowRightImg}/>
                        </View>
                      </View>
                      <View style={styles.content}>
                        {
                          item.content.map((item,index)=>(
                            <View key={index} style={styles.contentItem}>
                              <Image source={item.img} style={styles.ContentImg}/>
                              <Text style={styles.contentName}>{intl.formatMessage({ id: item.name })}</Text>
                            </View>
                          ))
                        }
                      </View>
                    </View>
                  ))
                }
                <ImageBackground source={require('../images/gameNow.png')} resizeMode= 'stretch' style={styles.bgImg}>
                  <Image source={require('../images/gameDoubt.png')} style={styles.gameDoubt}/>
                  <Text style={styles.gameBtn}>{intl.formatMessage({ id: ETranslations.telegram_entertainment_getitnow })}</Text>
                </ImageBackground>
                <View style={styles.infomation}>
                  <Text style={styles.infomationTitle}>{intl.formatMessage({ id: ETranslations.telegram_entertainment_information })}</Text>
                  <View style={styles.infomationRulesAndProgram}>
                    <Text style={styles.rules}>{intl.formatMessage({ id: ETranslations.telegram_entertainment_rules })}</Text>
                    <Text style={styles.Program}>{intl.formatMessage({ id: ETranslations.telegram_entertainment_affiliate })}</Text>
                  </View>
                  <View style={styles.infomationBonuses}>
                    <Text style={styles.bonuses}>{intl.formatMessage({ id: ETranslations.telegram_entertainment_bonuses })}</Text>
                    <Image style={styles.downArrow} source={require('../images/downArrow.png')}/>
                  </View>
                </View>
                <View style={styles.support}>
                  <View style={styles.Allsupport}>
                  {
                    support.map((item,index)=>(
                        <View style={styles.supportContent} key={index}>
                          <Image source={item.img} style={[styles.supportImg,item.id==0?{height: 25}:{height: 20}]}/>
                          <View>
                            <Text style={styles.application}>{item.application}</Text>
                            <Text style={styles.name}>{item.name}</Text>
                          </View>
                          <Image style={styles.rightwardsWhiteArrow} source={item.rightwardsWhiteArrow}/>
                        </View>
                    ))
                  }
                  </View>
                  <Text style={styles.supportName}>{intl.formatMessage({ id: ETranslations.telegram_entertainment_support })}</Text>
                  <View style={styles.chatQuestion}>
                    <View style={styles.chatQuestionContent}>
                      <Text style={styles.question}>{intl.formatMessage({ id: ETranslations.telegram_entertainment_writeus })}</Text>
                      <Text style={styles.chat}>{intl.formatMessage({ id: ETranslations.telegram_entertainment_chat })}</Text>
                    </View>
                    <Image style={styles.downArrow} source={require('../images/downArrow.png')}/>
                  </View>
                </View>
                <View style={styles.social}>
                  <Text style={styles.socialName}>{intl.formatMessage({ id: ETranslations.telegram_entertainment_social })}</Text>
                  <View style={styles.socialContent}>
                    {
                      socialImg.map((item,index)=>(
                        <Image key={index} style={[
                          item.id==0
                          ?
                          {width:35,height:30}:
                          (item.id==1?
                            {width: 45,height:30}:
                            (item.id==5?{width: 35, height: 40}:{width: 35,height:35}))]} source={item.img}/>
                      ))
                    }
                  </View>
                </View>
                <View style={styles.payment}>
                  <View style={styles.onlinePayment}>
                    {
                      onlinePayment.map((item,index)=>(
                        <Image style={[styles.onlinePaymentImg,
                          item.id==2?
                          {width:45,height:20}:
                          (item.id==3?
                            {width: 25, height: 25}:null)]} source={item.img} key={index}/>
                      ))
                    }
                  </View>
                  <View style={styles.networkNode}>
                    {
                      networkNode.map((item,index)=>(
                        <Image style={[
                          item.id==0?
                          {width:40,height:30}:
                          (item.id==1?
                            {width: 22,height: 35}:
                            (item.id==2?
                              {width: 30,height:30}:
                              {width: 90,height:15}))]} source={item.img} key={index}/>
                      ))
                    }
                  </View>
                  <View style={styles.platformPayment}>
                    {
                      platformPayment.map((item,index)=>(
                        <Image style={[
                          item.id==0?
                          {width: 60, height: 20, marginRight: 50}:
                          {width: 55,height: 20}]} source={item.img} key={index}/>
                      ))
                    }
                  </View>
                </View>
              </View>
            {/* head */}
          </ScrollView>
            </LinearGradient>
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
  games:{
    backgroundColor:'#fff',
    paddingVertical:16,
    paddingHorizontal:12,
    marginBottom:10,
    borderRadius:12,
  },
  popularChainCoinsTitle:{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
  },
  popularCommunitiesContent:{
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
    backgroundColor: "#000",
    marginTop: 6,
    borderRadius: 2,
  },
  titleContent:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:10,
  },
  titleContentLeft:{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleImg:{
    width: 26,
    height: 20,
  },
  title:{
    color: '#0F0F0F',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  titleContentRight:{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  titleName:{
    color: '#000',
    fontSize: 14,
  },
  arrowRightImg:{
    width: 12,
    height: 12,
    marginLeft: 10,
  },
  content:{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentItem:{
    width: '32%',
  },
  ContentImg:{
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  contentName:{
    color: '#0F0F0F',
    fontSize: 10, 
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bgImg:{
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 10,
    position:'relative',
  },
  gameDoubt:{
    width: 30,
    height: 30,
    position:'absolute',
    top: 20,
    right: 20,
  },
  gameBtn:{
    width: '90%',
    height: 40,
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 40,
    position:'absolute',
    bottom: 10,
    left: '5%',
    backgroundColor: '#01F0FC',
    borderRadius: 8,
  },
  infomation:{
    backgroundColor:'#fff',
    paddingVertical:16,
    paddingHorizontal:12,
    borderRadius:12,
    marginBottom:10,
  },
  infomationTitle:{
    color: '#666',
    fontSize: 12,
    marginBottom: 20,
  },
  infomationRulesAndProgram:{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rules:{
    color: '#0F0F0F',
    fontSize: 16,
    fontWeight: '600',
  },
  Program:{
    color: '#0F0F0F',
    fontSize: 16,
    fontWeight: '600',
  },
  infomationBonuses:{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bonuses:{
    color: '#0F0F0F',
    fontSize: 16,
  },
  support:{
    backgroundColor:'#fff',
    paddingVertical:16,
    paddingHorizontal:12,
    borderRadius:12,
    marginBottom:10,
  },
  Allsupport:{
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  supportContent:{
    width: '47%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  downArrow:{
    width: 6,
    height: 12,
  },
  supportImg:{
    width: 20,
  },
  application:{
    color: '#fff',
    fontSize: 12,
  },
  name:{
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  rightwardsWhiteArrow:{
    width: 12,
    height: 12,
  },
  supportName:{
    color: '#0F0F0F',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  chatQuestion:{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatQuestionContent:{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  question:{
    color: '#666',
    fontSize: 12,
  },
  chat:{
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: '#3467FE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginLeft: 10,
  },
  social:{
    backgroundColor:'#fff',
    paddingVertical:16,
    paddingHorizontal:12,
    borderRadius:12,
    marginBottom: 10,
  },
  socialContent:{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  socialName:{
    color: '#0F0F0F',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  },
  payment:{
    backgroundColor:'#fff',
    paddingVertical:16,
    paddingHorizontal:12,
    borderRadius:12,
    marginBottom: 20,
  },
  onlinePayment:{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  onlinePaymentImg:{
    width: 50,
    height: 15,
  },
  networkNode:{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  platformPayment:{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
export default MobileBrowser;
