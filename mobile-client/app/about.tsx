import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { X, LogOut } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';
import { useAuth } from '@clerk/clerk-expo';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AboutPage() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/sign-in');
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Premium 10% Mesh Accent Background Layer */}
      <LinearGradient
        colors={['rgba(243, 232, 255, 0.4)', 'rgba(238, 242, 255, 0.2)', 'transparent']}
        style={styles.meshBackground}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Floating Circle Close Button + Sign-Out Button */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.signOutButton}
          activeOpacity={0.7}
          onPress={handleSignOut}
          accessibilityLabel="Sign out"
        >
          <LogOut size={18} color="#EA580C" strokeWidth={2.5} />
        </TouchableOpacity>
        <Link href="/" asChild>
          <TouchableOpacity 
            style={styles.closeButton} 
            activeOpacity={0.7}
            accessibilityLabel="Close page"
          >
            <X size={18} color="#0F172A" strokeWidth={2.5} />
          </TouchableOpacity>
        </Link>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ==================== PREMIUM HERO SECTION ==================== */}
        <View style={styles.heroSection}>
          <View style={styles.crownDoodle}>
            <Svg width="60" height="50" viewBox="0 0 100 80" fill="none">
              <Path d="M10 70 L 20 25 L 42 45 L 50 15 L 58 45 L 80 25 L 90 70 Z" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <Path d="M8 72 C 30 76, 70 76, 92 72" stroke="#0F172A" strokeWidth="2" strokeLinecap="round"/>
              <Circle cx="20" cy="20" r="3" fill="#0F172A" />
              <Circle cx="50" cy="10" r="3" fill="#0F172A" />
              <Circle cx="80" cy="20" r="3" fill="#0F172A" />
            </Svg>
          </View>

          <Text style={styles.mainHeadline}>
            Empowering Sri Lankan Undergraduates,{'\n'}
            <Text style={styles.accentTextInline}>One Micro-Gig at a Time.</Text>
          </Text>
        </View>

        {/* ==================== CONTENT CARD SECTION ==================== */}
        <View style={styles.infoCard}>
          <Image 
            source={require('@/assets/images/grass.jpg')} 
            style={styles.cardImage} 
            resizeMode="cover"
          />
          <View style={styles.cardContent}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>The First Dedicated Student Task Network in Sri Lanka</Text>
            </View>
            <Text style={styles.cardTitle}>Bridging the Gap Between Flexible Student Income and On-Demand Help</Text>
            <Text style={styles.cardSubtitle}>The Ultimate Solution for On-Campus Help, Skilled Digital Work, and Trusted Earnings</Text>
            
            {/* Expanded Paragraphs with forced margins for spacing */}
            <Text style={styles.cardBody}>
              University students always need extra money, but regular part-time jobs do not work because timetables change constantly from week to week. On the other side, local businesses find it hard to find quick, trustworthy help for hands-on tasks like moving items, running errands, or event setup. Right now, there is absolutely no single, trusted website in Sri Lanka built to bring these two sides together and fix this problem.
            </Text>
            
            <Text style={styles.cardBody}>
              UniWorkSL fixes this by focusing heavily on quick, physical tasks around the campus area—like lifting lab equipment, helping at events, or local deliveries—while also offering digital freelance work like simple design or typing tasks. Unlike confusing social media groups or big, corporate job boards that take weeks to reply, UniWorkSL is fast, completely local, and fits perfectly around a student's daily class hours.
            </Text>
            
            <Text style={[styles.cardBody, { marginBottom: 0 }]}>
              To keep everyone 100% safe, every student goes through an official profile check using their university details before they can accept any work. Our main goal is to help students support themselves financially while making campus life easier for everyone. We keep the platform running by taking just a very small, clear service fee only after a job is successfully finished and the student gets paid. It is a worry-free system where everyone wins.
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  meshBackground: { position: 'absolute', top: 0, left: 0, right: 0, height: 450 },
  headerRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, zIndex: 30 },
  closeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  signOutButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF7ED', justifyContent: 'center', alignItems: 'center' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 60 },
  heroSection: { alignItems: 'center', marginBottom: 32 },
  mainHeadline: { fontSize: 28, fontWeight: '800', color: '#0F172A', textAlign: 'center', lineHeight: 38 },
  accentTextInline: { color: '#0F172A' },
  crownDoodle: { marginBottom: 16, opacity: 0.2 },
  
  // Card Styles
  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
  cardImage: { width: '100%', height: 220 },
  cardContent: { padding: 20 },
  badge: { backgroundColor: '#F1F5F9', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' },
  cardTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 10 },
  cardSubtitle: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 20 },
  cardBody: { fontSize: 14, lineHeight: 22, color: '#64748B', marginBottom: 16 },
});