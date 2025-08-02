import React, { useState } from 'react';
import { Text, View, Image, StyleSheet, ScrollView} from 'react-native';
import { Page } from '@onekeyhq/components';

export default function Message() {
  return (
    <Page fullPage>
      <Page.Header title="用户协议" />
      <View style={styles.main}>
        <ScrollView style={styles.container}>
          <Text style={styles.title}>XChat 用户协议</Text>

          <Text style={styles.sectionTitle}>1. 协议的接受</Text>
          <Text style={styles.paragraph}>
            本协议是您与 XChat
            软件（以下简称“本应用”）之间关于使用本应用服务所订立的协议。请您在注册或使用前认真阅读并理解本协议的全部内容，您一旦注册、登录或使用本应用，即表示您已同意本协议的所有条款。
          </Text>

          <Text style={styles.sectionTitle}>2. 服务内容</Text>
          <Text style={styles.paragraph}>
            XChat
            是一款提供即时通讯服务的移动应用，用户可通过文字、语音、图片等方式进行交流。我们将不断优化服务内容，但保留随时修改或中断服务的权利。
          </Text>

          <Text style={styles.sectionTitle}>3. 用户行为规范</Text>
          <Text style={styles.paragraph}>
            用户承诺在使用过程中不发布违法、暴力、色情、诈骗等信息，不侵犯他人合法权益。用户对其在平台上的行为承担全部法律责任。
          </Text>

          <Text style={styles.sectionTitle}>4. 隐私保护</Text>
          <Text style={styles.paragraph}>
            我们重视用户隐私，严格遵守相关法律法规。未经用户同意，我们不会向第三方披露、出售或转让用户的个人信息，除非法律规定或政府要求。
          </Text>

          <Text style={styles.sectionTitle}>5. 知识产权</Text>
          <Text style={styles.paragraph}>
            本应用中涉及的所有内容（包括但不限于文字、图片、标识、界面设计、程序等）的知识产权归属
            XChat 或相关权利人所有，未经授权不得使用。
          </Text>

          <Text style={styles.sectionTitle}>6. 法律适用与争议解决</Text>
          <Text style={styles.paragraph}>
            本协议的订立、执行与解释均适用中华人民共和国法律。如发生争议，用户与本应用应协商解决，协商不成的，提交本应用所在地人民法院诉讼解决。
          </Text>

          <Text style={styles.sectionTitle}>7. 协议的变更</Text>
          <Text style={styles.paragraph}>
            本应用有权随时修改本协议，修改后的协议将在本页面发布，用户继续使用本应用即视为接受修改后的协议内容。
          </Text>

          <Text style={styles.sectionTitle}>8. 联系方式</Text>
          <Text style={styles.paragraph}>
            如您对本协议内容有任何疑问，请通过 support@xchat.com 联系我们。
          </Text>

          <Text style={styles.footer}>最后更新日期：2025年7月22日</Text>
        </ScrollView>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F6F5FA',
  },
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555',
  },
  footer: {
    marginTop: 32,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  }
});
