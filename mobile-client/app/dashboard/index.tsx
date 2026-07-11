import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Search, MessageSquare, CheckCircle, ArrowRight, Zap, User, Briefcase, PlusSquare } from 'lucide-react-native';

export default function DashboardHome() {
  const router = useRouter();
  
  // Extract the role passed down from the _layout.tsx initialParams
  const { userRole } = useLocalSearchParams<{ userRole: string }>();

  // Determine if the user has poster privileges
  const canCreateTask = userRole === 'TASK_POSTER' || userRole === 'CORPORATE_CLIENT';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>👋🏻 Welcome to your Workspace</Text>
          <Text style={styles.subtitle}>
            Your central hub to post tasks, discover opportunities, and track your progress across the platform.
          </Text>
        </View>

        {/* Quick Navigation Panel */}
        <View style={styles.navGrid}>
          <TouchableOpacity style={styles.navCard} onPress={() => router.push('/dashboard/profile')} activeOpacity={0.7}>
            <User size={24} color="#37352f" />
            <Text style={styles.navCardText}>My Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navCard} onPress={() => router.push('/dashboard/manage-tasks')} activeOpacity={0.7}>
            <Briefcase size={24} color="#37352f" />
            <Text style={styles.navCardText}>Manage Tasks</Text>
          </TouchableOpacity>

          {/* Dynamic Create Task Button */}
          {canCreateTask && (
            <TouchableOpacity 
              style={[styles.navCard, styles.createTaskCard]} 
              onPress={() => router.push('/dashboard/create-task')} 
              activeOpacity={0.7}
            >
              <PlusSquare size={24} color="#2d913e" />
              <Text style={[styles.navCardText, { color: '#2d913e' }]}>Create Task</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoBadge}>
            <Zap size={12} color="#5b21b6" fill="#5b21b6" />
            <Text style={styles.promoBadgeText}>NEW FEATURE</Text>
          </View>
          <Text style={styles.promoTitle}>UniWorkSL Pro is now live.</Text>
          <Text style={styles.promoDesc}>
            Unlock advanced escrow analytics, priority task matching, and zero-fee withdrawals.
          </Text>
          <TouchableOpacity style={styles.promoButton}>
            <Text style={styles.promoButtonText}>Upgrade Workspace</Text>
            <ArrowRight size={14} color="#37352f" />
          </TouchableOpacity>
        </View>

        {/* How it Works Section */}
        <Text style={styles.sectionTitle}>How it works</Text>
        
        <View style={styles.stepCard}>
          <View style={[styles.iconCircle, { backgroundColor: '#ffe2dd' }]}>
            <Search size={22} color="#d44c47" />
          </View>
          <Text style={styles.stepTitle}>1. Discover & Match</Text>
          <Text style={styles.stepDesc}>Post quick gigs or browse active on-campus tasks. Our smart matching workspace instantly connects you.</Text>
        </View>

        <View style={styles.stepCard}>
          <View style={[styles.iconCircle, { backgroundColor: '#e8f3eb' }]}>
            <MessageSquare size={22} color="#448361" />
          </View>
          <Text style={styles.stepTitle}>2. Collaborate</Text>
          <Text style={styles.stepDesc}>Collaborate directly using milestone trackings and locked agreements with absolute transparency.</Text>
        </View>

        <View style={styles.stepCard}>
          <View style={[styles.iconCircle, { backgroundColor: '#f3eaf8' }]}>
            <CheckCircle size={22} color="#9a6dd7" />
          </View>
          <Text style={styles.stepTitle}>3. Complete & Earn</Text>
          <Text style={styles.stepDesc}>Deliver quality work, secure swift approval, and get paid directly in LKR.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F7F5' },
  container: { padding: 20, paddingBottom: 60 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#37352f', marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: '#787774', lineHeight: 24 },
  navGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  navCard: { flex: 1, minWidth: '45%', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#ededed', alignItems: 'center', gap: 8 },
  createTaskCard: { borderColor: '#cce8d1', backgroundColor: '#f4faf5' },
  navCardText: { fontSize: 14, fontWeight: '600', color: '#37352f' },
  promoBanner: { backgroundColor: '#f8f9ff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#e4e4e9', marginBottom: 32 },
  promoBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ebe9fe', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, alignSelf: 'flex-start', gap: 4, marginBottom: 12 },
  promoBadgeText: { fontSize: 10, fontWeight: '800', color: '#5b21b6', letterSpacing: 1 },
  promoTitle: { fontSize: 20, fontWeight: '800', color: '#37352f', marginBottom: 8 },
  promoDesc: { fontSize: 14, color: '#505050', lineHeight: 22, marginBottom: 16 },
  promoButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, alignSelf: 'flex-start', gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  promoButtonText: { fontSize: 13, fontWeight: '700', color: '#37352f' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#37352f', borderBottomWidth: 1, borderBottomColor: '#ededed', paddingBottom: 12, marginBottom: 16 },
  stepCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#ededed', marginBottom: 12 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  stepTitle: { fontSize: 16, fontWeight: '700', color: '#37352f', marginBottom: 6 },
  stepDesc: { fontSize: 14, color: '#787774', lineHeight: 22 }
});