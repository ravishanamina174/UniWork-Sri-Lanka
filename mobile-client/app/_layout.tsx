import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';

import GlassNavbar from '@/components/GlassNavbar';
import {
  fetchAuthUserByClerkId,
  getAuthProfileCache,
  resetAuthProfileCache,
  setAuthProfileCache,
} from '../constants/api';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

function RootNavigationLayout() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === 'sign-in' || segments[0] === 'sso-callback';
    const inOnboardGroup = segments[0] === 'onboard';

    if (!isSignedIn) {
      resetAuthProfileCache();
      setIsGlobalLoading(false);
      if (!inAuthGroup) {
        router.replace('/sign-in');
      }
      return;
    }

    if (!userId) return;

    const syncProfile = async () => {
      const cached = getAuthProfileCache();

      if (cached === false && !inOnboardGroup) {
        setIsGlobalLoading(false);
        router.replace('/onboard');
        return;
      }

      if (cached === true) {
        setIsGlobalLoading(false);
        if (inAuthGroup || inOnboardGroup) {
          router.replace('/');
        }
        return;
      }

      setIsGlobalLoading(true);
      try {
        const { status } = await fetchAuthUserByClerkId(userId);

        if (status === 404) {
          setAuthProfileCache(false);
          if (!inOnboardGroup) {
            router.replace('/onboard');
          }
          return;
        }

        if (status >= 200 && status < 300) {
          setAuthProfileCache(true);
          if (inAuthGroup || inOnboardGroup) {
            router.replace('/');
          }
        }
      } catch (error) {
        console.error('Backend auth sync verification crash:', error);
      } finally {
        setIsGlobalLoading(false);
      }
    };

    void syncProfile();
  }, [isLoaded, isSignedIn, userId, segments, router]);

  const hideNavbar =
    segments[0] === 'sign-in' ||
    segments[0] === 'onboard' ||
    segments[0] === 'sso-callback';

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="about" options={{ animation: 'fade' }} />
        <Stack.Screen name="tasks" options={{ animation: 'fade' }} />
        <Stack.Screen name="sign-in" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="onboard" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="sso-callback" options={{ animation: 'none' }} />
      </Stack>

      {!hideNavbar && !isGlobalLoading && <GlassNavbar />}

      {(!isLoaded || isGlobalLoading) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      )}

      <StatusBar style="dark" />
    </View>
  );
}

export default function RootLayout() {
  if (!publishableKey) {
    throw new Error('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY');
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <SafeAreaProvider>
        <RootNavigationLayout />
      </SafeAreaProvider>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});
