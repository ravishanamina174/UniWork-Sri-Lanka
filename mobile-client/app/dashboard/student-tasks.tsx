import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { API_BASE } from './_layout';

type Application = {
  id: string;
  gig_id: string;
  gig_title: string;
  poster_clerk_id: string;
  applied_at: string;
  task_deadline: string;
  application_confirm: string;
};

type Gig = {
  title?: string;
  description?: string;
  budget?: number;
  deadline?: string;
  skills_required?: string[];
};

type PosterProfile = { display_name?: string };

type StudentTask = Application & {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skills_required: string[];
  poster_display_name: string;
};

export default function StudentTasksScreen() {
  const { userId } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<StudentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async (isRefresh = false) => {
    if (!userId) return;
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/v1/applications/student/${userId}`);
      if (!response.ok) throw new Error('Applications request failed.');
      const applications = await response.json() as Application[];
      const enriched = await Promise.all(applications.map(async (application) => {
        const [gigResponse, profileResponse] = await Promise.all([
          fetch(`${API_BASE}/api/v1/gigs/${application.gig_id}`),
          fetch(`${API_BASE}/api/v1/profiles/${application.poster_clerk_id}`),
        ]);
        const gig = gigResponse.ok ? await gigResponse.json() as Gig : {};
        const profile = profileResponse.ok ? await profileResponse.json() as PosterProfile : {};
        return {
          ...application,
          title: application.gig_title || gig.title || 'Untitled Task',
          description: gig.description || 'No description available.',
          budget: gig.budget || 0,
          deadline: application.task_deadline || gig.deadline || 'TBD',
          skills_required: gig.skills_required || [],
          poster_display_name: profile.display_name || 'Unknown Company/Poster',
        };
      }));
      setTasks(enriched);
    } catch (loadError: unknown) {
      console.error('Failed to load student tasks:', loadError);
      setError(loadError instanceof Error ? loadError.message : 'Could not load your applied tasks.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => { void loadTasks(); }, [loadTasks]);

  if (loading) return <ActivityIndicator size="large" color="#007FFF" style={styles.loader} />;

  return (
    <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void loadTasks(true)} tintColor="#007FFF" />}>
      <Text style={styles.title}>My Applied Tasks</Text>
      <Text style={styles.subtitle}>Track applications and open confirmed task workspaces.</Text>
      {error ? <View style={styles.errorCard}><Text style={styles.errorText}>{error}</Text><TouchableOpacity onPress={() => void loadTasks()}><Text style={styles.retry}>Try again</Text></TouchableOpacity></View> : null}
      {!error && tasks.length === 0 ? <View style={styles.empty}><Text style={styles.emptyIcon}>📂</Text><Text style={styles.emptyTitle}>No applications yet</Text><Text style={styles.muted}>Browse active tasks and request one that matches your skills.</Text><TouchableOpacity style={styles.browseButton} onPress={() => router.push('/tasks')}><Text style={styles.browseText}>Browse Tasks</Text></TouchableOpacity></View> : null}
      {tasks.map((task) => {
        const approved = task.application_confirm === 'approve';
        return (
          <TouchableOpacity key={task.id} style={styles.card} activeOpacity={0.8} onPress={() => router.push((approved ? `/dashboard/student-tasks/${task.id}` : `/task-req/${task.gig_id}`) as any)}>
            <View style={styles.meta}><Text style={styles.deadline}>📅 {task.deadline}</Text><Text style={styles.budget}>LKR {task.budget.toLocaleString()}</Text></View>
            <Text style={styles.cardTitle}>{task.title}</Text>
            <Text style={styles.poster}>🏢 {task.poster_display_name}</Text>
            <Text style={styles.description} numberOfLines={3}>{task.description}</Text>
            <View style={styles.skills}>{task.skills_required.slice(0, 3).map((skill) => <Text style={styles.skill} key={`${task.id}-${skill}`}>{skill}</Text>)}</View>
            <View style={[styles.status, approved ? styles.approved : styles.pending]}><Text style={approved ? styles.approvedText : styles.pendingText}>{approved ? '✓ Candidate Confirmed - Open Workspace' : '⌛ Application Pending'}</Text></View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, marginTop: 50 },
  container: { padding: 16, paddingBottom: 80 },
  title: { color: '#0F172A', fontSize: 26, fontWeight: '800' },
  subtitle: { color: '#64748B', fontSize: 14, lineHeight: 20, marginTop: 5, marginBottom: 20 },
  errorCard: { backgroundColor: '#FEF2F2', borderColor: '#FECACA', borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 14 },
  errorText: { color: '#B91C1C', fontSize: 13 },
  retry: { color: '#1D4ED8', fontWeight: '700', marginTop: 8 },
  empty: { alignItems: 'center', backgroundColor: '#FFF', borderColor: '#E2E8F0', borderStyle: 'dashed', borderWidth: 1, borderRadius: 14, padding: 28 },
  emptyIcon: { fontSize: 30, marginBottom: 10 },
  emptyTitle: { color: '#0F172A', fontSize: 17, fontWeight: '800' },
  muted: { color: '#94A3B8', fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 5 },
  browseButton: { backgroundColor: '#007FFF', borderRadius: 9, paddingHorizontal: 18, paddingVertical: 11, marginTop: 18 },
  browseText: { color: '#FFF', fontWeight: '700' },
  card: { backgroundColor: '#FFF', borderColor: '#E2E8F0', borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 14 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  deadline: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  budget: { color: '#007FFF', fontSize: 16, fontWeight: '900' },
  cardTitle: { color: '#0F172A', fontSize: 19, fontWeight: '800', marginBottom: 4 },
  poster: { color: '#64748B', fontSize: 12, marginBottom: 10 },
  description: { color: '#64748B', fontSize: 13, lineHeight: 20 },
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  skill: { backgroundColor: '#4285F4', borderRadius: 5, color: '#FFF', fontSize: 11, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 4 },
  status: { alignItems: 'center', borderRadius: 8, borderWidth: 1, marginTop: 14, paddingVertical: 10 },
  approved: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  pending: { backgroundColor: '#FFF', borderColor: '#CBD5E1' },
  approvedText: { color: '#047857', fontSize: 12, fontWeight: '800' },
  pendingText: { color: '#64748B', fontSize: 12, fontWeight: '700' },
});
