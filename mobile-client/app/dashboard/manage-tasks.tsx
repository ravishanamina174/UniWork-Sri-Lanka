import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useLocalSearchParams } from 'expo-router';
import { API_BASE } from './_layout';

export default function ManageTasksScreen() {
  const { userId } = useAuth();
  const { userRole } = useLocalSearchParams();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/gigs/all`);
        if (res.ok) {
          const allTasks = await res.json();
          
          // Role-based logic filtering natively
          if (userRole === 'TASK_POSTER' || userRole === 'CORPORATE_CLIENT') {
            setTasks(allTasks.filter((t: any) => t.poster_clerk_id === userId));
          } else {
            // Logic for STUDENT_EARNER (e.g., tasks they applied to)
            // For now, we leave it empty or hook into an 'applications' endpoint
            setTasks([]); 
          }
        }
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId, userRole]);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {userRole === 'STUDENT_EARNER' ? 'My Applications' : 'My Posted Tasks'}
        </Text>
        <Text style={styles.subtitle}>
          Manage and view all your task activity on the platform.
        </Text>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No tasks found for your profile yet.</Text>
        </View>
      ) : (
        tasks.map((task) => (
          <View key={task._id || task.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardBudget}>LKR {task.budget?.toLocaleString()}</Text>
              <Text style={styles.cardDeadline}>📅 {task.deadline}</Text>
            </View>
            <Text style={styles.cardTitle} numberOfLines={2}>{task.title}</Text>
            <Text style={styles.cardDesc} numberOfLines={3}>{task.description}</Text>
            <TouchableOpacity style={styles.manageBtn}>
              <Text style={styles.manageBtnText}>Manage Task</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  emptyState: { padding: 32, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed', alignItems: 'center' },
  emptyStateText: { color: '#9CA3AF', fontSize: 14 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardBudget: { fontSize: 18, fontWeight: '900', color: '#007FFF' },
  cardDeadline: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 8 },
  cardDesc: { fontSize: 13, color: '#6B7280', marginBottom: 16 },
  manageBtn: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#6366F1', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  manageBtnText: { color: '#6366F1', fontSize: 13, fontWeight: '600' }
});