import React, { useState } from 'react';
import { Text, View, Image, StyleSheet, ScrollView } from 'react-native';
import { Page } from '@onekeyhq/components';

export default function Message() {
  return (
    <Page fullPage>
      <Page.Header title="隐私政策" />
      <View style={styles.main}>
        <ScrollView style={styles.container}>
          <Text style={styles.title}>XChat 隐私政策</Text>

          <Text style={styles.sectionTitle}>1. 引言</Text>
          <Text style={styles.paragraph}>
            欢迎您使用
            XChat！我们非常重视您的隐私与个人信息保护。本隐私政策将帮助您了解我们如何收集、使用、存储和保护您的个人信息。
          </Text>

          <Text style={styles.sectionTitle}>2. 我们收集的信息</Text>
          <Text style={styles.paragraph}>
            为向您提供服务，我们可能会收集以下信息：
            {'\n'}• 账号信息（如手机号、昵称、头像等）
            {'\n'}• 通讯内容（如聊天记录、图片、语音）
            {'\n'}• 设备信息（如操作系统、设备型号、IP 地址）
            {'\n'}• 位置信息（需您授权后收集）
          </Text>

          <Text style={styles.sectionTitle}>3. 我们如何使用信息</Text>
          <Text style={styles.paragraph}>
            我们收集信息的目的是为您提供安全、顺畅、高效的服务，包括但不限于：
            {'\n'}• 提供即时通讯功能
            {'\n'}• 识别账号身份，保障账户安全
            {'\n'}• 改进产品和服务体验
            {'\n'}• 向您推送与服务相关的通知或信息
          </Text>

          <Text style={styles.sectionTitle}>4. 信息的共享与披露</Text>
          <Text style={styles.paragraph}>
            我们承诺不会将您的个人信息出售或出租。除非以下情况，否则不会与第三方共享：
            {'\n'}• 获得您的明确同意
            {'\n'}• 法律法规要求
            {'\n'}• 为实现服务目的与合作方共享（如使用云存储服务）
          </Text>

          <Text style={styles.sectionTitle}>5. 信息安全</Text>
          <Text style={styles.paragraph}>
            我们采用业界标准的安全措施保护您的数据，包括数据加密、访问控制等手段，以防止信息被未经授权访问、使用或披露。
          </Text>

          <Text style={styles.sectionTitle}>6. 您的权利</Text>
          <Text style={styles.paragraph}>
            您有权访问、更正、删除您的个人信息。您也可以选择撤回授权或注销账户。请通过应用内设置或联系客服
            support@xchat.com 联系我们。
          </Text>

          <Text style={styles.sectionTitle}>7. 未成年人信息保护</Text>
          <Text style={styles.paragraph}>
            若您是未满 18
            周岁的用户，需在监护人同意下使用本服务。我们不会在知情的情况下收集未成年人的信息。
          </Text>

          <Text style={styles.sectionTitle}>8. 本政策的变更</Text>
          <Text style={styles.paragraph}>
            我们可能不定期更新本隐私政策。更新后将在应用内发布变更内容。请您及时查看。如继续使用
            XChat，即视为您接受修改后的政策。
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
