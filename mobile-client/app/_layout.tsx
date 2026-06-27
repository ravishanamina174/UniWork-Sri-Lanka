import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';

import GlassNavbar from '@/components/GlassNavbar'; 
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { API_BASE_URL } from '../constants/api';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

function RootNavigationLayout() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // useRef survives re-renders, guaranteeing we never loop the DB check
  const hasVerifiedRef = useRef(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === 'sign-in';
    const inOnboardGroup = segments[0] === 'onboard';

    // 1. Unauthenticated State
    if (!isSignedIn) {
      hasVerifiedRef.current = false; // Reset for next login
      setIsGlobalLoading(false);
      if (!inAuthGroup) router.replace('/sign-in');
      return;
    }

    // 2. Authenticated but Unverified State
    if (isSignedIn && userId && !hasVerifiedRef.current) {
      const verifyDatabaseProfile = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/user/clerk/${userId}`);
          hasVerifiedRef.current = true; // Lock it so this NEVER runs twice

          if (res.status === 404) {
            router.replace('/onboard');
          } else if (res.ok) {
            if (inAuthGroup || inOnboardGroup) router.replace('/');
          }
        } catch (error) {
          console.error('Backend auth sync verification crash:', error);
        } finally {
          setIsGlobalLoading(false);
        }
      };

      verifyDatabaseProfile();
    } else if (hasVerifiedRef.current) {
      // 3. Authenticated and Verified. Just disable loading.
      setIsGlobalLoading(false);
    }

  }, [isLoaded, isSignedIn, userId, segments, router]);

  const hideNavbar = segments[0] === 'sign-in' || segments[0] === 'onboard';

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* We MUST keep Stack mounted at all times to preserve routing history */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="about" options={{ animation: 'fade' }} />
        <Stack.Screen name="tasks" options={{ animation: 'fade' }} />
        <Stack.Screen name="sign-in" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="onboard" options={{ animation: 'slide_from_bottom' }} />
      </Stack>

      {/* Floating global Glassmorphic Navigation Component */}
      {!hideNavbar && !isGlobalLoading && <GlassNavbar />}

      {/* Absolute Overlay Loading Shield (Instead of unmounting Stack) */}
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
  }
});