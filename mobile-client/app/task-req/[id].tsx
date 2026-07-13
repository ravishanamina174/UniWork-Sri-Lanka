import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchAllGigs } from '@/constants/api';
import { TaskGig } from '@/components/TaskMarketplace'; // Adjust path if needed

export default function TaskRequestScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [task, setTask] = useState<TaskGig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching all and filtering by ID to maintain consistency with your existing API logic
    fetchAllGigs()
      .then((tasks) => {
        const foundTask = tasks.find((t) => t.id === id);
        setTask(foundTask || null);
      })
      .catch((err) => console.error("Error fetching task:", err))
      .finally(() => setLoading(false));
  }, [id]);

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

  const isRemote = task.task_type === "remote";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Main Task Detail Card */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Software & Tech</Text>
            </View>
            <Text style={styles.dateText}>📅 {task.deadline}</Text>
          </View>

          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.budget}>LKR {task.budget?.toLocaleString() || 0}</Text>

          <View style={styles.locationPill}>
            <Text style={styles.locationPillText}>
              {isRemote ? "🌐 Remote Task" : `📍 ${task.location?.address || "Location specified on map"}`}
            </Text>
          </View>

          <Text style={styles.description}>{task.description}</Text>

          <View style={styles.skillsContainer}>
            {task.skills_required?.map((skill, index) => (
              <View key={index} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.requestButton}>
            <Text style={styles.requestButtonText}>Request Task</Text>
          </TouchableOpacity>
        </View>

        {/* Dummy Map Component (Only for Physical Tasks) */}
        {!isRemote && (
          <View style={styles.mapSection}>
            <Text style={styles.mapTitle}>TASK LOCATION</Text>
            <View style={styles.dummyMapContainer}>
              <View style={styles.mapInnerCard}>
                <Text style={styles.pinIcon}>📍</Text>
                <Text style={styles.mapInnerText}>Exact location pinned on map</Text>
              </View>
            </View>
          </View>
        )}

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
  badge: { backgroundColor: '#E8F0FE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeText: { color: '#1A73E8', fontSize: 12, fontWeight: '700' },
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
  mapSection: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  mapTitle: { fontSize: 12, fontWeight: 'bold', color: '#64748B', marginBottom: 16, letterSpacing: 0.5 },
  dummyMapContainer: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
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