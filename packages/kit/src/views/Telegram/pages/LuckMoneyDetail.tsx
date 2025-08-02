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
  
} from '@onekeyhq/components';
import { ListItem } from '@onekeyhq/kit/src/components/ListItem';
import useAppNavigation from '@onekeyhq/kit/src/hooks/useAppNavigation';
import { useRoute,useIsFocused } from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { wrap } from 'lodash';
import { CUSTOM_NETWORK_URL } from '@onekeyhq/shared/src/config/appConfig';


export const TOKENDATA = [
  {
    src: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/btc.png',
    title: '退款-红包',
    subtitle: '11-16 20:05',
    price: '0.03',
    statusDesc: '退款成功',
  },
  {
    src: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/eth.png',
    title: '转出-红包',
    subtitle: '11-14 20:05',
    price: '-0.03',
    statusDesc: '扣款成功',
  },
];


function MobileBrowser() {
  const navigation = useAppNavigation();
  const route = useRoute()
  const [list,setList] = useState([])
  const [page, setPage] = useState(1); 
  const [loading, setLoading] = useState(false); // 是否正在加载数据
  const [hasMore, setHasMore] = useState(true); // 是否还有更多数据
  const isFocused = useIsFocused()
  const {id,unit,amount,price,desc,depositAddress} = route.params
  const [logo, setLogo] = useState('');
    // 滚动到底部触发加载更多
    const handleLoadMore = () => {
      if (!loading && hasMore) {
        setPage((prevPage) => prevPage + 1); // 加载下一页
      }
    };

      // 底部加载指示器
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#0000ff" />
        <Text>Loading more...</Text>
      </View>
    );
  };
  const renderItem = ({item})=>{
    return (
      <ListItem
      key={id}
      title={item.title}
      subtitle={item.subtitle}
      avatarProps={{
        src: item.img
      }}
      onPress={() => {
        console.log('clicked');
      }}
    >
      <ListItem.Text
        align="right"
        primary={item.price}
      />
    </ListItem>
    )
  }
  const fetchData = useCallback(async()=>{
    const token = await AsyncStorage.getItem('tgToken')
   
    if(!token){
     alert('用户没有有效的token信息') 
     return
    }
    setLoading(true);
    // console.log(page)
    const apiUrl = `${CUSTOM_NETWORK_URL}/userinfo/getTokenDetailById/${id}?pageNum=${page}&pageSize=10`;
  
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
      setLogo(data.logo);

        if(data.rows.length!==0){

          const newData = data?.rows?.map(
            r=>({
              title:r.statusDesc,
              subtitle:r.createTime.slice(5,16),
              price: r.amount,
              id:r.id,
              img: data.logo
            })
          )
     
   
            
            setList(oldList=>[...oldList,...newData])
        }else{

          setHasMore(false)
        }

       
   
      console.log('data:', data);
      return data; // 返回用户信息
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error; // 将错误抛出以便外部捕获
    } finally {
      setLoading(false)
    }
  },[page]) 
  
  useEffect(() => {
    fetchData()
  }, [page]);

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
                  navigation.replace('TgMyMoney');
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
                  {desc}
                </Text>
              </View>
              <Image 
                width={32}
                height={32}
                source={
                  {
                    uri: logo
                  }
                }>
                
              </Image>
            </View>
            {/* 余额 */}
            <View>
              <Text
                style={{
                  color: 'white',
                  fontSize: 24,
                  // fontWeight: '400',
                  textAlign: 'center',
                  marginTop: 20,
                }}
              >
                {amount}
                <Text style={{ fontSize: 12, fontWeight: '300' }}>{unit}</Text>
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  fontWeight: '500',
                  textAlign: 'center',
                  marginTop: 10,
                }}
              >
                {`≈ $${price}`}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
                paddingHorizontal: 10,
              }}
            >
 
                <Button
                  size="large"
                  style={{
                    backgroundColor: '#4B4B4B',
                    width: 150,
                    color: 'white',
                  }}
                  onPress={()=>navigation.replace('TgTransferOut',{
                    ...route.params
                  })}
                >
                  转出
                </Button>
      
              <Button
                size="large"
                style={{
                  backgroundColor: '#FFBF00',
                  width: 150,
                }}
                onPress={()=>navigation.replace('TgTransferIn',{
                  ...route.params
                })}
              >
                转入
              </Button>
            </View>
          </View>
          {/* 币列 */}
          {/* <ScrollView style={{ }}>
            {list.map((item) => (
              <ListItem
                key={id}
                title={item.title}
                subtitle={item.subtitle}
                avatarProps={{
                  src: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/btc.png',
                }}
                onPress={() => {
                  console.log('clicked');
                }}
              >
                <ListItem.Text
                  align="right"
                  primary={item.price}
                  // secondary={item.statusDesc}
                  // secondaryTextProps={{
                  //   color:
                  //     parseFloat(item.change) >= 0
                  //       ? '$textSuccess'
                  //       : '$textCritical',
                  // }}
                />
              </ListItem>
            ))}
          </ScrollView> */}

          <FlatList
            data={list}
            renderItem={renderItem}
            onEndReached={handleLoadMore} 
            onEndReachedThreshold={0.1} // 距离底部 10% 时触发
            ListFooterComponent={renderFooter} // 显示加载指示器
          >

          </FlatList>
        </Stack>
      </Page.Body>
    </Page>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  footer: {
    padding: 10,
    alignItems: 'center',
  },
});
export default MobileBrowser;
