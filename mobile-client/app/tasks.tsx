import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import TaskMarketplace, { TaskGig } from '@/components/TaskMarketplace';
import { fetchAllGigs } from '@/constants/api';

export default function TasksScreen() {
  const [tasks, setTasks] = useState<TaskGig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllGigs()
      .then(setTasks)
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color="#007FFF" size="large" />
        </View>
      ) : (
        <TaskMarketplace tasks={tasks} />
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
});
