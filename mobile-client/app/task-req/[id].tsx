import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { API_BASE_URL, fetchAllGigs } from '@/constants/api';
import { TaskGig } from '@/components/TaskMarketplace'; // Adjust path if needed
import TaskMap from '@/components/TaskMap';

export default function TaskRequestScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { userId } = useAuth();
  const taskId = Array.isArray(id) ? id[0] : id;
  
  const [task, setTask] = useState<TaskGig | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [applicationError, setApplicationError] = useState('');

  useEffect(() => {
    // Fetching all and filtering by ID to maintain consistency with your existing API logic
    fetchAllGigs()
      .then((tasks) => {
        const foundTask = tasks.find((t) => t.id === taskId);
        setTask(foundTask || null);
      })
      .catch((err) => console.error("Error fetching task:", err))
      .finally(() => setLoading(false));
  }, [taskId]);

  useEffect(() => {
    if (!userId || !taskId) return;
    const checkApplication = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/applications/student/${userId}`);
        if (!response.ok) return;
        const applications = await response.json() as { gig_id: string; applied?: boolean }[];
        if (applications.some((application) => application.gig_id === taskId && application.applied !== false)) {
          setApplicationStatus('success');
        }
      } catch (error) {
        console.error('Failed to check task application:', error);
      }
    };
    void checkApplication();
  }, [taskId, userId]);

  const applyForTask = async () => {
    if (!userId || !taskId) return;
    setApplicationStatus('loading');
    setApplicationError('');
    try {
      const response = await fetch(`${API_BASE_URL}/applications/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_clerk_id: userId,
          gig_id: taskId,
          student_message: 'I am highly interested in this task and available to start immediately.',
        }),
      });
      const data = await response.json().catch(() => ({})) as { detail?: string };
      if (!response.ok && !(response.status === 400 && data.detail === 'You have already submitted an application for this task.')) {
        throw new Error(data.detail || 'Failed to submit application.');
      }
      setApplicationStatus('success');
    } catch (error: unknown) {
      setApplicationStatus('error');
      setApplicationError(error instanceof Error ? error.message : 'Could not submit application.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007FFF" />
      </SafeAreaView>
    );
  }

  if (!task) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>Task not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const [longitude, latitude] = task.location?.coordinates?.length === 2
    ? task.location.coordinates
    : [80.5234, 6.6191];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Main Task Detail Card */}
        <View style={styles.card}>
          <View style={[styles.headerRow, styles.deadlineOnlyRow]}>
            <Text style={styles.dateText}>📅 {task.deadline}</Text>
          </View>

          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.budget}>LKR {task.budget?.toLocaleString() || 0}</Text>

          <View style={styles.locationPill}>
            <Text style={styles.locationPillText}>📍 {task.location?.address || "Location specified on map"}</Text>
          </View>

          <Text style={styles.description}>{task.description}</Text>

          <View style={styles.skillsContainer}>
            {task.skills_required?.map((skill, index) => (
              <View key={index} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>

          {applicationStatus === 'success' ? (
            <View style={styles.applicationActions}>
              <View style={styles.submittedButton}><Text style={styles.submittedText}>✓ Application Submitted</Text></View>
              <TouchableOpacity style={styles.tasksButton} onPress={() => router.push('/dashboard/student-tasks' as any)}>
                <Text style={styles.tasksButtonText}>View Applied Tasks</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.applicationActions}>
              <TouchableOpacity style={styles.requestButton} onPress={applyForTask} disabled={applicationStatus === 'loading'}>
                {applicationStatus === 'loading' ? <ActivityIndicator color="#191919" /> : <Text style={styles.requestButtonText}>Request Task</Text>}
              </TouchableOpacity>
              {applicationStatus === 'error' && <Text style={styles.applicationError}>{applicationError}</Text>}
            </View>
          )}
        </View>

        {/* Interactive task map, matching the web task details page. */}
        <View style={styles.mapSection}>
          <Text style={styles.mapTitle}>TASK LOCATION</Text>
          <View style={styles.mapContainer}>
            <TaskMap coordinates={[longitude, latitude]} />
            <View style={styles.mapInnerCard}>
              <Text style={styles.pinIcon}>📍</Text>
              <Text style={styles.mapInnerText}>{task.location?.address || 'Exact location pinned on map'}</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 12, paddingVertical: 120, gap: 20 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  deadlineOnlyRow: { justifyContent: 'flex-end' },
  dateText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
  budget: { fontSize: 28, fontWeight: '900', color: '#007FFF', marginBottom: 16 },
  locationPill: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 16 },
  locationPillText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  description: { fontSize: 14, color: '#64748B', lineHeight: 22, marginBottom: 20 },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  skillBadge: { backgroundColor: '#4285F4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  skillText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  requestButton: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#6366F1', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  requestButtonText: { color: '#191919', fontSize: 14, fontWeight: '600' },
  applicationActions: { gap: 8 },
  submittedButton: { backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  submittedText: { color: '#047857', fontSize: 14, fontWeight: '700' },
  tasksButton: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  tasksButtonText: { color: '#334155', fontSize: 14, fontWeight: '600' },
  applicationError: { color: '#DC2626', textAlign: 'center', fontSize: 12 },
  mapSection: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  mapTitle: { fontSize: 12, fontWeight: 'bold', color: '#64748B', marginBottom: 16, letterSpacing: 0.5 },
  mapContainer: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  mapInnerCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pinIcon: { fontSize: 24, marginBottom: 4 },
  mapInnerText: { fontSize: 13, fontWeight: '600', color: '#334155' },
  errorText: { fontSize: 16, color: '#64748B', marginBottom: 12 },
  backButton: { padding: 10 },
  backButtonText: { color: '#007FFF', fontWeight: '600' }
});