import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_BASE } from './_layout';

type ManagedTask = {
  id: string;
  gig_id?: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  poster_display_name?: string;
  application_confirm?: string;
  skills_required?: string[];
};

export default function ManageTasksScreen() {
  const { userId } = useAuth();
  const { userRole } = useLocalSearchParams<{ userRole: string }>();
  const router = useRouter();
  const [tasks, setTasks] = useState<ManagedTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchTasks = async () => {
      try {
        if (userRole === 'STUDENT_EARNER') {
          const applicationsResponse = await fetch(`${API_BASE}/api/v1/applications/student/${userId}`);
          if (!applicationsResponse.ok) throw new Error(`Applications request failed: ${applicationsResponse.status}`);
          const applications = await applicationsResponse.json();
          const enrichedTasks = await Promise.all(applications.map(async (application: any) => {
            const [gigResponse, profileResponse] = await Promise.all([
              fetch(`${API_BASE}/api/v1/gigs/${application.gig_id}`),
              fetch(`${API_BASE}/api/v1/profiles/${application.poster_clerk_id}`),
            ]);
            const gig = gigResponse.ok ? await gigResponse.json() : null;
            const poster = profileResponse.ok ? await profileResponse.json() : null;
            return {
              id: application.id,
              gig_id: application.gig_id,
              title: application.gig_title || gig?.title || 'Untitled Task',
              budget: gig?.budget || 0,
              deadline: application.task_deadline || gig?.deadline || 'TBD',
              description: gig?.description || 'No description available.',
              skills_required: gig?.skills_required || [],
              poster_display_name: poster?.display_name || 'Unknown Company/Poster',
              application_confirm: application.application_confirm || 'pending',
            };
          }));
          setTasks(enrichedTasks);
        } else {
          const response = await fetch(`${API_BASE}/api/v1/gigs/all`);
          if (!response.ok) throw new Error(`Tasks request failed: ${response.status}`);
          const allTasks = await response.json();
          setTasks(allTasks.filter((task: any) => task.poster_clerk_id === userId));
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    void fetchTasks();
  }, [userId, userRole]);

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;

  const isStudent = userRole === 'STUDENT_EARNER';
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{isStudent ? 'My Applications' : 'My Posted Tasks'}</Text>
        <Text style={styles.subtitle}>Manage and view all your task activity on the platform.</Text>
      </View>
      {tasks.length === 0 ? (
        <View style={styles.emptyState}><Text style={styles.emptyStateText}>{isStudent ? 'No applications yet.' : 'No tasks found for your profile yet.'}</Text></View>
      ) : tasks.map((task) => {
        const approved = task.application_confirm === 'approve';
        return (
          <TouchableOpacity key={task.id || task.gig_id} style={styles.card} activeOpacity={0.8} onPress={() => isStudent && task.gig_id && router.push(`/task-req/${task.gig_id}`)}>
            <View style={styles.cardHeader}><Text style={styles.cardDeadline}>📅 {task.deadline}</Text><Text style={styles.cardBudget}>LKR {task.budget?.toLocaleString() || 0}</Text></View>
            <Text style={styles.cardTitle}>{task.title}</Text>
            {isStudent && <Text style={styles.poster}>🏢 {task.poster_display_name}</Text>}
            <Text style={styles.cardDesc} numberOfLines={3}>{task.description}</Text>
            <View style={styles.skillsRow}>{task.skills_required?.slice(0, 3).map((skill) => <Text style={styles.skill} key={skill}>{skill}</Text>)}</View>
            {isStudent && <View style={[styles.status, approved ? styles.approved : styles.pending]}><Text style={approved ? styles.approvedText : styles.pendingText}>{approved ? '✓ Task Approved - Open Workspace' : '⌛ Task Pending...'}</Text></View>}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: { marginTop: 50 },
  container: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  emptyState: { padding: 32, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed', alignItems: 'center' },
  emptyStateText: { color: '#9CA3AF', fontSize: 14 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cardBudget: { fontSize: 18, fontWeight: '900', color: '#007FFF' },
  cardDeadline: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
  poster: { fontSize: 12, color: '#6B7280', marginBottom: 10 },
  cardDesc: { fontSize: 13, color: '#6B7280', lineHeight: 20, marginBottom: 12 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  skill: { backgroundColor: '#4285F4', color: '#fff', fontSize: 11, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5 },
  status: { paddingVertical: 9, borderRadius: 7, alignItems: 'center', borderWidth: 1 },
  approved: { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' },
  pending: { backgroundColor: '#fff', borderColor: '#d1d5db' },
  approvedText: { color: '#059669', fontWeight: '700', fontSize: 12 },
  pendingText: { color: '#6B7280', fontWeight: '600', fontSize: 12 },
});
