import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSSO } from '@clerk/clerk-expo';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { SafeAreaView } from 'react-native-safe-area-context';

import SignInArtwork, { GoogleGlyph, UniWorkMark } from '@/components/SignInArtwork';

export default function SignInScreen() {
  const { startSSOFlow } = useSSO();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  const handleGoogleSignIn = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: 'mobileclient',
        path: 'sso-callback',
      });

      const { createdSessionId, setActive, authSessionResult } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      });

      if (authSessionResult?.type !== 'success') {
        return;
      }

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        return;
      }

      Alert.alert(
        'Sign-in incomplete',
        'Google authenticated, but Clerk could not activate a session. Please try again.'
      );
    } catch (err) {
      console.error('OAuth flow initialization failure:', err);
      Alert.alert(
        'Sign-in failed',
        'Could not complete Google authentication. Check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, startSSOFlow]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <SignInArtwork />

        <View style={styles.foreground}>
          <View style={styles.brandRow}>
            <UniWorkMark size={28} color="#37352f" />
            <Text style={styles.brandTitle}>UniWorkSL</Text>
          </View>
          <Text style={styles.subTitle}>Sri Lanka's first student gig platform</Text>

          <TouchableOpacity
            style={[styles.signInButton, isSubmitting && styles.signInButtonDisabled]}
            onPress={handleGoogleSignIn}
            activeOpacity={0.85}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <View style={styles.googleIconWrap}>
                  <GoogleGlyph size={18} />
                </View>
                <Text style={styles.buttonText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.clerkHint}>Secured authentication · Google only</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  foreground: {
    width: '100%',
    maxWidth: 420,
    paddingHorizontal: 24,
    alignItems: 'center',
    zIndex: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#37352f',
    letterSpacing: -0.4,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#747876',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: 36,
    textAlign: 'center',
  },
  signInButton: {
    backgroundColor: '#BC4F4F',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    minHeight: 52,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  googleIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  clerkHint: {
    marginTop: 18,
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
