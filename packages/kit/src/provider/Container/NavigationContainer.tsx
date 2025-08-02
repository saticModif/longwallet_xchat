import type { PropsWithChildren } from 'react';
import { memo, useEffect, useRef, useState } from 'react';
import {
  NavigationContainer as NavigationContainerComponent,
  RouterEventProvider,
} from '@onekeyhq/components';
import { RootNavigator } from '@onekeyhq/kit/src/routes';
import { useRouterConfig } from '../../routes/config';
import { TabFreezeOnBlurContainer } from './TabFreezeOnBlurContainer';
import { useNavigation } from '@react-navigation/native';
import { useIntl } from 'react-intl';

import { ETranslations } from '@onekeyhq/shared/src/locale';
import platformEnv from '@onekeyhq/shared/src/platformEnv';

import {Text, Image, StyleSheet, Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Tab, Stack } from '@onekeyhq/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appGlobals from '@onekeyhq/shared/src/appGlobals';
import { Animated } from 'react-native';


const PageHeader = (props: any) => {
  const intl = useIntl();
  const fadeAnimMenu = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = appGlobals.$navigationRef;
  const [isShow, setIsShow] = useState(false);
  const [currentTab,setCurrentTab] = useState();
  const tabRef = useRef();
  const [showhideStatus, setShowhideStatus] = useState(false);
  const [selectId, setSelectId] = useState(0);
  const wechatImg = require('../../../assets/wechat.png');
  const WalletImg = require('../../../assets/wallet.png');
  const defaultImg = require('../../../assets/arrowRight.png');
  const selectImg = require('../../../assets/arrowLeft.png');
  const jumpWay = [
    {
      id: 0,
      name: ETranslations.telegram_my_chat,
      img: require('../../../assets/wechat.png'),
      selectImg: require('../../../assets/select.png'),
    },
    {
      id: 1,
      name: ETranslations.telegram_my_wallet,
      img: require('../../../assets/wallet.png'),
      selectImg: require('../../../assets/select.png'),
    }
  ]

  const showhide = ()=>{
    if (!showhideStatus) {
      fadeAnimMenu.setValue(0);
      translateYAnim.setValue(20);
      setMenuVisible(true);
      setShowhideStatus(true);
      Animated.parallel([
        Animated.timing(fadeAnimMenu, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnimMenu, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 20,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setMenuVisible(false);
        setShowhideStatus(false);
      });
    }
    setShowhideStatus(!showhideStatus);
  }

  

  const jump = (id:number)=>{
    if (id === 0) {
      navigation?.current?.navigate('telegram');
    } else {
      navigation?.current?.navigate('main');
    }
    setShowhideStatus(!showhideStatus);
    setSelectId(id);
    Animated.parallel([
      Animated.timing(fadeAnimMenu, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 20,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMenuVisible(false);
      setShowhideStatus(false);
    });    
  }


  useEffect( () => {
    
    
    window.setTimeout(async() => {
      if (navigation) {

        const { name } = navigation.current?.getCurrentRoute();
        const isLogin = await AsyncStorage.getItem('tgToken');
        if (name?.startsWith('Tg') && isLogin) {
          // tabRef?.current?._itemDidTouch('1',0,false)
          // setCurrentTab(0)
          setIsShow(false)
        }else{
          
          setIsShow(true)
        }
        navigation.current?.addListener('state', async (a) => {
         
          const { name } = navigation.current?.getCurrentRoute();
          const isLogin = await AsyncStorage.getItem('tgToken');
          
          console.log('token>>>>>>>>>>'+ isLogin);
          
          if (name?.startsWith('Tg') && isLogin) {
        
            // setCurrentTab(0)
            // tabRef?.current?._itemDidTouch('1',0,false)
            setIsShow(false);
          } else if(name?.startsWith('Tg') && !isLogin){
            // setCurrentTab(0)
            // tabRef?.current?._itemDidTouch('0',0,false)
            setIsShow(true)
          } else {
            // setCurrentTab(1)
            // tabRef?.current?._itemDidTouch('1',1,false)
          
            setIsShow(true);
          }
        });
      }
    }, 100);

  }, []);

  // useEffect(()=>{
  //   if(currentTab){
  //     console.log('11122')
  //     console.log(tabRef)
  //     window.setTimeout(()=>{
  //       tabRef?.current?._itemDidTouch('1',currentTab,false)

  //     },0)
  //     // tabRef.current?.bindScrollPageIndexValue(1)
  //     // window.setTimeout(()=>{
  //     //   console.log('tab start')
  //     //   console.log(tabRef)
  //     //   tabRef.current?._itemDidTouch('1',1)
  //     //   // tabRef.current.scrollPageIndex = 1
  //     // },1000)
  //   }    
  // },[currentTab])

  
  return (
    <>
      {
        isShow && <View style={styles.container}>
        <View style={[styles.jump,showhideStatus?styles.jumpSelectBg:styles.jumpDefaultBg]}>  
          <Pressable onPress={() => showhide()} style={styles.content}>
            <Image style={styles.jumpArrowImg} source={showhideStatus ? defaultImg : selectImg}/>
            {showhideStatus == false && <Image style={styles.jumpImg} source={selectId == 0 ? wechatImg : WalletImg}/>}
          </Pressable>
        </View>
        {
        menuVisible && <Animated.View style={[styles.jumpWay, { opacity: fadeAnimMenu, transform: [{ translateY: translateYAnim }] }]} pointerEvents={menuVisible ? 'auto' : 'none'}>
          {
            jumpWay.map((item,index)=>(
              <Pressable onPress={() => jump(item.id)}>
                <View style={[styles.jumpContent,item.id==0?{marginBottom:0}:null]} key={index}>
                  <Image style={styles.jumpRightImg} source={item.img}/>
                  <Text style={styles.jumpName}>{intl.formatMessage({ id: item.name })}</Text>
                  {item.id == selectId &&  <Image style={styles.selectImg} source={item.selectImg}/>}
                </View>
              </Pressable>
            ))
          }
        </Animated.View>
        }
      </View>
      }
    </>
  );
};

export default PageHeader;

function BasicNavigation({ children }: PropsWithChildren) {
  const { containerProps, routerConfig } = useRouterConfig();

  return (
    <NavigationContainerComponent {...containerProps}>
      <TabFreezeOnBlurContainer>
        <RootNavigator config={routerConfig} />
      </TabFreezeOnBlurContainer>
      {children}
    </NavigationContainerComponent>
  );
}

function NavigationWithEventProvider({ children }: PropsWithChildren) {
  const { containerProps, routerConfig } = useRouterConfig();
  const routerEventRef = useRef([]);
  // const navigation = useNavigation();
  // console.dir(navigation)

  return (
    <RouterEventProvider value={routerEventRef}>
      <PageHeader />
      <BasicNavigation>{children}</BasicNavigation>
    </RouterEventProvider>
  );
}

export const NavigationContainer = memo(NavigationWithEventProvider);

const styles = StyleSheet.create({
  container:{
    position: 'absolute',
    top:'70%',
    right:0,
  },
  jump:{
    width: 60,
    height: 40,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    zIndex: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '70%'
  },
  jumpDefaultBg:{
    backgroundColor: '#3467FE',
  },
  jumpSelectBg:{
    backgroundColor: '#fff',
  },
  content:{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jumpArrowImg:{
    width: 16,
    height: 14,
    marginRight: 5,
  },
  jumpImg:{
    width: 24,
    height: 20,
  },
  jumpWay:{
    width: 200,
    height: 120,
    backgroundColor: '#2878FF',
    justifyContent: 'center',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 100,
  },
  jumpContent:{
    width: '100%',
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  jumpName:{
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  jumpRightImg:{
    width: 16,
    height: 14,
    marginRight: 10,
    marginLeft: 20,
  },
  selectImg:{
    width: 16,
    height: 14,
  },
})