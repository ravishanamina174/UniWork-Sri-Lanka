import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_BASE } from './_layout';

type Application = {
  id: string;
  gig_id: string;
  gig_title: string;
  task_deadline: string;
  applied_at: string;
  application_confirm: string;
  student_display_name: string;
  student_university_campus: string;
  student_reputation_rating: number;
  student_completed_tasks: number;
  student_message: string;
};

export default function ApplicationsScreen() {
  const { userId } = useAuth();
  const { userRole } = useLocalSearchParams<{ userRole: string }>();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const loadApplications = async () => {
      try {
        if (userRole === 'STUDENT_EARNER') return;
        const response = await fetch(`${API_BASE}/api/v1/applications/poster/${userId}`);
        if (!response.ok) throw new Error(`Applications request failed: ${response.status}`);
        setApplications(await response.json());
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        Alert.alert('Error', 'Could not load incoming applications.');
      } finally {
        setLoading(false);
      }
    };
    void loadApplications();
  }, [userId, userRole]);

  const confirmCandidate = async (applicationId: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/applications/${applicationId}/confirm`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approve' }),
      });
      if (!response.ok) throw new Error(`Confirmation failed: ${response.status}`);
      setApplications((previous) => previous.map((application) => application.id === applicationId ? { ...application, application_confirm: 'approve' } : application));
    } catch (error) {
      console.error('Failed to confirm candidate:', error);
      Alert.alert('Error', 'Could not confirm this candidate.');
    }
  };

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;
  if (userRole === 'STUDENT_EARNER') return <View style={styles.center}><Text style={styles.denied}>🔒 Unauthorized View</Text><Text style={styles.muted}>Student Earners cannot manage client applications.</Text></View>;

  const groups = applications.reduce<Record<string, Application[]>>((result, application) => {
    (result[application.gig_id] ||= []).push(application);
    return result;
  }, {});

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Incoming Applications</Text>
      <Text style={styles.subtitle}>Review, evaluate, and assign incoming student job applications.</Text>
      {applications.length === 0 ? <View style={styles.empty}><Text style={styles.emptyIcon}>📬</Text><Text style={styles.emptyTitle}>No Applications Yet</Text><Text style={styles.muted}>Applications for your posted tasks will appear here.</Text></View> : Object.entries(groups).map(([gigId, group]) => (
        <View style={styles.group} key={gigId}>
          <View style={styles.groupHeader}><View><Text style={styles.groupTitle}>{group[0].gig_title}</Text><Text style={styles.deadline}>📅 Deadline: {group[0].task_deadline || 'Not specified'}</Text></View><Text style={styles.count}>{group.length} Applicant{group.length > 1 ? 's' : ''}</Text></View>
          {group.map((application) => {
            const approved = application.application_confirm === 'approve';
            return <View style={styles.applicationCard} key={application.id}>
              <Text style={styles.applied}>Applied: {new Date(application.applied_at).toLocaleDateString()}</Text>
              <View style={styles.studentRow}><View style={styles.avatar}><Text style={styles.avatarText}>{application.student_display_name?.charAt(0).toUpperCase() || '?'}</Text></View><View><Text style={styles.studentName}>{application.student_display_name || 'Unknown Student'}</Text><Text style={styles.campus}>🎓 {application.student_university_campus || 'Not specified'}</Text></View></View>
              <View style={styles.metrics}><Metric label="Rating" value={`${(application.student_reputation_rating || 0).toFixed(1)} ★`} /><Metric label="Tasks Done" value={String(application.student_completed_tasks || 0)} /></View>
              <Text style={styles.messageLabel}>MESSAGE FROM APPLICANT</Text><Text style={styles.message}>{'"'}{application.student_message || 'I am highly interested in this task and available to start immediately.'}{'"'}</Text>
              {approved ? <View style={styles.confirmed}><Text style={styles.confirmedText}>✓ Candidate Confirmed</Text></View> : <TouchableOpacity style={styles.confirmButton} onPress={() => confirmCandidate(application.id)}><Text style={styles.confirmButtonText}>Confirm Candidate</Text></TouchableOpacity>}
              {approved && <TouchableOpacity style={styles.workspaceButton} onPress={() => router.push(`/dashboard/application-workspace/${application.id}` as any)}><Text style={styles.workspaceText}>💬 Open Task Workspace</Text></TouchableOpacity>}
            </View>;
          })}
        </View>
      ))}
    </ScrollView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <View style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  loader: { marginTop: 50 },
  container: { padding: 16, paddingBottom: 50 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
  subtitle: { color: '#787774', fontSize: 14, marginTop: 5, marginBottom: 24 },
  denied: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 8 },
  muted: { color: '#94a3b8', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  empty: { minHeight: 280, borderWidth: 1, borderStyle: 'dashed', borderColor: '#cbd5e1', borderRadius: 14, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyIcon: { fontSize: 30, marginBottom: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#475569', marginBottom: 5 },
  group: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 14, marginBottom: 18 },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 14, marginBottom: 14 },
  groupTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', flexShrink: 1 },
  deadline: { fontSize: 12, color: '#64748b', marginTop: 5 },
  count: { backgroundColor: '#e8f0fe', color: '#1a73e8', fontWeight: '700', fontSize: 11, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 5 },
  applicationCard: { backgroundColor: '#fdfdfe', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 14, marginBottom: 12 },
  applied: { alignSelf: 'flex-end', color: '#64748b', fontSize: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', padding: 5, marginBottom: 12 },
  studentRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 14, marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e8f0fe', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#1a73e8', fontWeight: '800' },
  studentName: { fontSize: 14, fontWeight: '800', color: '#1e293b' },
  campus: { fontSize: 12, color: '#64748b', marginTop: 3 },
  metrics: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  metric: { flex: 1, borderWidth: 1, borderColor: '#e2e8f0', borderTopColor: '#f5d378', borderTopWidth: 2, borderRadius: 6, padding: 8 },
  metricLabel: { color: '#94a3b8', fontSize: 9 },
  metricValue: { color: '#1e293b', fontWeight: '800', fontSize: 13, marginTop: 3 },
  messageLabel: { color: '#64748b', fontSize: 10, fontWeight: '800', marginBottom: 6 },
  message: { color: '#64748b', fontSize: 13, fontStyle: 'italic', lineHeight: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f1f5f9', borderRadius: 7, padding: 11, marginBottom: 12 },
  confirmButton: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingVertical: 11, alignItems: 'center' },
  confirmButtonText: { color: '#1e293b', fontWeight: '700', fontSize: 13 },
  confirmed: { backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#a7f3d0', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  confirmedText: { color: '#059669', fontWeight: '800', fontSize: 13 },
  workspaceButton: { borderWidth: 1, borderColor: '#93c5fd', borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginTop: 8 },
  workspaceText: { color: '#2f96df', fontWeight: '800', fontSize: 13 },
});
