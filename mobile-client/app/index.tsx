import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';

import TaskMarketplace, { TaskGig } from '@/components/TaskMarketplace';
import { fetchAllGigs } from '@/constants/api';

export default function HomeScreen() {
  const [tasks, setTasks] = useState<TaskGig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllGigs()
      .then(setTasks)
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.branding}>
          <View style={styles.pill}>
            <View style={styles.pillDot} />
            <Text style={styles.pillText}>
              The First Dedicated Student Task Network in Sri Lanka
            </Text>
          </View>

          <Text style={styles.brandName}>
            UniWork<Text style={styles.brandAccent}>SL</Text>
          </Text>

          <Text style={styles.headline}>
            Where independent talents and ecosystems earn together.
          </Text>

          <Text style={styles.tagline}>
            Empowering student earners with flexible pathways, helping task posters find
            immediate execution, and enabling corporate clients to scale velocity seamlessly.
          </Text>

          <Link href="/tasks" asChild>
            <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
              <Text style={styles.ctaButtonText}>Browse All Tasks</Text>
              <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </Link>
        </View>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color="#007FFF" />
          </View>
        ) : (
          <TaskMarketplace tasks={tasks} embedded />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  branding: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    marginBottom: 24,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007FFF',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#838991',
    letterSpacing: 0.3,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  brandAccent: {
    fontWeight: '800',
  },
  headline: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '500',
    color: '#989A9C',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 340,
    marginBottom: 24,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#007FFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loading: {
    paddingVertical: 48,
    alignItems: 'center',
  },
});
