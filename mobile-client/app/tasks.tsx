import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/clerk-expo'; // Imported useAuth

import TaskMarketplace, { TaskGig } from '@/components/TaskMarketplace';
import { API_BASE_URL, fetchAllGigs } from '@/constants/api';

export default function TasksScreen() {
  const { userId } = useAuth(); // Extract userId from Clerk
  
  const [tasks, setTasks] = useState<TaskGig[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>(""); // State to hold the role

  // Fetch all tasks
  useEffect(() => {
    fetchAllGigs()
      .then(setTasks)
      .finally(() => setLoading(false));
  }, []);

  // Fetch the user role dynamically from your backend
  useEffect(() => {
    if (!userId) return;

    const fetchUserRole = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/user/clerk/${userId}`);
        
        if (res.ok) {
          const userData = await res.json();
          setUserRole(userData.role || "");
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
      }
    };

    fetchUserRole();
  }, [userId]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color="#007FFF" size="large" />
        </View>
      ) : (
        <View style={styles.marketplaceContainer}>
          {/* Passed userRole to TaskMarketplace */}
          <TaskMarketplace tasks={tasks} userRole={userRole} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marketplaceContainer: {
    flex: 1,
    marginTop: 60,
  },
});