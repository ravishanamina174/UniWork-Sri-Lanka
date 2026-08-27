import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function SSOCallbackScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#f97316" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
