import { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { ActivityIndicator, View, Platform } from 'react-native';

// Helper for local backend access on Android Emulators
export const API_BASE = Platform.OS === 'android' ? 'http://192.168.1.10:8000' : 'http://127.0.0.1:8000';

export default function DashboardLayout() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('STUDENT_EARNER');

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      router.replace('/sign-in');
      return;
    }

    const fetchUserRole = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/auth/user/clerk/${userId}`);
        if (res.status === 404) {
          router.replace('/onboard');
        } else if (res.ok) {
          const data = await res.json();
          if (data.role) setUserRole(data.role);
        }
      } catch (err) {
        console.error("Layout role fetch error context sync:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [isLoaded, userId]);

  if (loading || !isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F7F5' }}>
        <ActivityIndicator size="large" color="#007FFF" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ 
      headerStyle: { backgroundColor: '#F7F7F5' },
      headerShadowVisible: false,
      contentStyle: { backgroundColor: '#F7F7F5' }
    }}>
      <Stack.Screen 
        name="index" 
        options={{ title: 'Workspace', headerShown: false }} 
        initialParams={{ userRole }}
      />
      <Stack.Screen 
        name="profile" 
        options={{ title: 'My Profile', headerBackTitle: 'Back' }} 
        initialParams={{ userRole }}
      />
      <Stack.Screen 
        name="manage-tasks" 
        options={{ title: 'Manage Tasks', headerBackTitle: 'Back' }} 
        initialParams={{ userRole }}
      />
      {/* NEW SCREEN ADDED HERE */}
      <Stack.Screen 
        name="create-task" 
        options={{ title: 'Create a Task', headerBackTitle: 'Back' }} 
        initialParams={{ userRole }}
      />
    </Stack>
  );
}