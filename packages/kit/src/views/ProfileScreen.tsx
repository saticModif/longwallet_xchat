/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';

import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const webUrl2 = "https://web.telegram.org/a/"
const webUrl1 = "https://tgwebtest.33test.com/"
const ProfileScreen = () => {

  return(
  <View style={styles.container}>
    <WebView
      source={{ uri: webUrl2 }}
      style={styles.webview}
      mediaPlaybackRequiresUserAction={false}
      allowsInlineMediaPlayback
      allowsFullscreenVideo
      javaScriptEnabled
      domStorageEnabled
      allowFileAccess
      allowsProtectedMedia
      androidHardwareAccelerationDisabled={false}
      onShouldStartLoadWithRequest={() => true}
    />
  </View>
)};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
});

export default ProfileScreen;
