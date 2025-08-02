import React,{useState} from "react";
import { Text, View, Image, StyleSheet, Pressable, Alert} from "react-native";
import { Page } from '@onekeyhq/components';
import * as Clipboard from 'expo-clipboard';
import { useIntl } from 'react-intl';
import { ETranslations } from '@onekeyhq/shared/src/locale';

export default function Message() {
    
    const intl = useIntl();

    const [xchatContent,setXchatContent] = useState([
        {
            id: 0,
            name: '商务电报',
            copyName: '@IMGRAM1477130',
            copyImg: require('../images/Paste.png'),
        },
        {
            id: 1,
            name: 'E-mail',
            copyName: '@FISANBIN',
            copyImg: require('../images/Paste.png'),
        }
    ]);

    const handleCopy = async(copyName:string)=>{
      await Clipboard.setStringAsync(copyName);
      Alert.alert('复制成功'+'内容已复制到剪贴板');
    }

  return (
    <Page fullPage>
        <Page.Header title='商务合作'/>
        <View style={styles.main}>
            <View style={styles.title}>
                <Image style={styles.titleImg} source={require('../images/XChat.png')}/>
                <Text style={styles.titleName}>Xchat</Text>
            </View>
            <View style={styles.content}>
                {
                    xchatContent.map((item,index)=>(
                        <View style={[styles.xchatContent,item.id==1?{marginTop: 20}: null]} key={index}>
                            <Text style={styles.xchatName}>{item.name}</Text>
                            <View style={styles.copyCotent}>
                                <Text style={styles.copyName}>{item.copyName}</Text>
                                <Pressable onPress={()=>handleCopy(item.copyName)}>
                                    <Image style={styles.copyImg} source={item.copyImg}/>
                                </Pressable>
                            </View>
                        </View>
                    ))
                }
            </View>
        </View>
    </Page>
  );
}

const styles = StyleSheet.create({
    main:{
        width: '100%',
        height: '100%',
        backgroundColor: '#F6F5FA',
        paddingHorizontal: '5%',
    },
    title:{
        backgroundColor: '#fff',
        width: '100%',
        borderRadius: 5,
        paddingVertical: 10,
        marginVertical: 20,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    titleImg:{
        width: 50,
        height: 50,
        marginHorizontal: 20,
    },
    titleName:{
        color: '#0F0F0F',
        fontSize: 18,
        fontWeight: '600',
    },
    content:{
        width: '100%',
        borderRadius: 5,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 20,

    },
    xchatContent:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    xchatName:{
        color: '#000',
        fontSize: 16,
        fontWeight: '500',    
    },
    copyCotent:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    copyName:{
        color: '#666',
        fontSize: 14,
        marginRight: 20,
    },
    copyImg:{
        width: 20,
        height: 20,
    }
})