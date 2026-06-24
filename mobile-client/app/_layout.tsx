import { View } from 'react-native'; // <-- Add this missing import right here!
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GlassNavbar from '@/components/GlassNavbar'; 

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          
          <Stack.Screen 
            name="about" 
            options={{
              animation: 'fade',
            }}
          />

          <Stack.Screen
            name="tasks"
            options={{
              animation: 'fade',
            }}
          />
          </Stack>

          {/* <Stack.Screen
            name="tasks"
            options={{
              headerShown: false,
              title: 'Find Tasks',
              headerTintColor: '#0F172A',
              headerStyle: { backgroundColor: '#FFFFFF' },
              headerShadowVisible: false,
            }}
          />
        </Stack> */}

        {/* Floating global Glassmorphic Navigation Component */}
        <GlassNavbar />
        
        <StatusBar style="dark" />
      </View>
    </SafeAreaProvider>
  );
}