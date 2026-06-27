import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking'; // <-- Add this import

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const handleGoogleSignIn = async () => {
    try {
      // Tell Clerk explicitly where to return after authentication
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/'), // <-- Add this redirectUrl
      });
      
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error('OAuth flow initialization failure:', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.brandTitle}>UniWorkSL</Text>
        <Text style={styles.subTitle}>University Student Micro-Gig Platform</Text>
        
        <TouchableOpacity style={styles.signInButton} onPress={handleGoogleSignIn}>
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { width: '100%', alignItems: 'center', padding: 20 },
  brandTitle: { fontSize: 32, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  subTitle: { fontSize: 14, color: '#64748B', marginTop: 6, marginBottom: 40, textAlign: 'center' },
  signInButton: { backgroundColor: '#0F172A', width: '100%', paddingVertical: 16, borderRadius: 14, alignItems: 'center', elevation: 2 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' }
});