import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { router, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, Search } from 'lucide-react-native';
import Svg, { Path, Polygon, Circle } from 'react-native-svg';

import TaskMarketplace, { TaskGig } from '@/components/TaskMarketplace';
import { API_BASE_URL, fetchAllGigs } from '@/constants/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const { userId } = useAuth();
  
  const [tasks, setTasks] = useState<TaskGig[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchAllGigs()
      .then(setTasks)
      .finally(() => setLoading(false));

    // Start Pulse Animation for the Red Doodle
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  useEffect(() => {
    if (!userId) return;

    const fetchUserRole = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/user/clerk/${userId}`);
        
        if (res.ok) {
          const userData = await res.json();
          setUserRole(userData.role || "");
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
      }
    };

    fetchUserRole();
  }, [userId]);

  // Interpolate scroll position for watermark opacity and position
  const watermarkOpacity = scrollY.interpolate({
    inputRange: [0, 300, 600],
    outputRange: [0.03, 0.08, 0.15],
    extrapolate: 'clamp',
  });

  const watermarkTranslateY = scrollY.interpolate({
    inputRange: [0, 500],
    outputRange: [0, -35],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Animated.ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* HERO SECTION */}
        <View style={styles.heroWrapper}>
          
          {/* Background Doodles */}
          <Animated.View style={[styles.doodle, { top: 60, left: 20, opacity: pulseAnim }]}>
            <Svg width="40" height="40" viewBox="0 0 100 100" fill="none" stroke="#ef4444" strokeWidth="6" strokeLinecap="round">
              <Path d="M10 50 Q 30 10, 50 50 T 90 50" />
            </Svg>
          </Animated.View>

          <View style={[styles.doodle, { top: 120, right: 30, opacity: 0.5 }]}>
            <Svg width="45" height="45" viewBox="0 0 100 100" fill="none" stroke="#f97316" strokeWidth="5" strokeLinecap="round">
              <Path d="M20 20 L 80 80 M 80 20 L 20 80" />
              <Circle cx="50" cy="50" r="40" strokeDasharray="15 15" />
            </Svg>
          </View>

          <View style={[styles.doodle, { bottom: 350, left: 20, opacity: 0.5 }]}>
            <Svg width="50" height="50" viewBox="0 0 100 100" fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
              <Polygon points="50,10 61,39 92,39 67,58 76,89 50,70 24,89 33,58 8,39 39,39" fill="#22c55e" fillOpacity="0.2" />
            </Svg>
          </View>

          <View style={[styles.doodle, { bottom: 250, right: 40, opacity: 0.4 }]}>
             <Svg width="55" height="55" viewBox="0 0 100 100" fill="none" stroke="#92400e" strokeWidth="5" strokeLinecap="round">
              <Path d="M10 90 C 30 70, 70 30, 90 10" />
              <Path d="M30 90 C 50 70, 90 30, 90 30" />
              <Circle cx="20" cy="80" r="6" fill="#92400e" />
              <Circle cx="80" cy="20" r="6" fill="#92400e" />
            </Svg>
          </View>

          {/* Hero Content */}
          <View style={styles.heroContent}>
            <View style={styles.pillContainer}>
              <Text style={styles.pillText}>The First Dedicated Student Task Network</Text>
            </View>

            <Text style={styles.mainTitle}>
              Empowering Sri Lankan Undergraduates,
            </Text>
            
            <View style={styles.subtitleWrapper}>
              <Text style={styles.mainTitleHighlight}>One Micro-Gig at a Time.</Text>
              <Svg 
                style={styles.underlineSvg}
                viewBox="0 0 300 10" 
                fill="none" 
                preserveAspectRatio="none"
              >
                <Path d="M5 5 C 50 2, 150 8, 295 4 C 200 6, 80 3, 15 7" stroke="#ff6a00" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
              </Svg>
            </View>

            <Text style={styles.description}>
              Grab a task, deliver the work, get paid directly, and level up your profile. The central hub to post tasks and discover on-campus opportunities.
            </Text>

            {/* Buttons */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8}>
                <Sparkles size={18} color="#b27f40" />
                <Text style={styles.primaryBtnText}>Student Portal</Text>
              </TouchableOpacity>

              <TouchableOpacity 
      style={styles.secondaryBtn} 
      activeOpacity={0.8}
      onPress={() => router.push('/about')}
    >
      <Search size={18} color="#787774" />
      <Text style={styles.secondaryBtnText}>About Us</Text>
    </TouchableOpacity>
            </View>
          </View>

          {/* Hero Images */}
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1746436576978-21632bf9790d?w=900&auto=format&fit=crop&q=60' }} 
              style={[styles.heroImage, styles.cloudShape1]} 
            />
            <Image 
              source={{ uri: 'https://plus.unsplash.com/premium_photo-1661547843345-e1ca800df0e0?q=80&w=988&auto=format&fit=crop' }} 
              style={[styles.heroImage, styles.cloudShape2]} 
            />
          </View>

          {/* Animated Watermark Base */}
          <Animated.View 
            style={[
              styles.watermarkContainer, 
              { 
                opacity: watermarkOpacity,
                transform: [{ translateY: watermarkTranslateY }]
              }
            ]}
          >
            <Text style={styles.watermarkText}>UNIWORK</Text>
          </Animated.View>
        </View>

        {/* TASK MARKETPLACE SECTION */}
        <View style={styles.marketplaceSection}>
        {loading ? (
  <ActivityIndicator size="large" color="#007FFF" style={{ marginTop: 40 }} />
) : (
  <>
    {/* Added embedded={true} to fix the FlatList nesting error */}
    <TaskMarketplace tasks={tasks} userRole={userRole} embedded={true} />
  </>
)}
        </View>

      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f7f6',
  },
  scrollContainer: {
    paddingBottom: 60,
  },
  heroWrapper: {
    position: 'relative',
    width: '100%',
    paddingTop: 40,
    paddingBottom: 80,
    backgroundColor: '#f8f7f6',
    borderBottomWidth: 1,
    borderBottomColor: '#eae9e7',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  doodle: {
    position: 'absolute',
    zIndex: 0,
  },
  heroContent: {
    paddingHorizontal: 24,
    zIndex: 10,
    alignItems: 'flex-start',
  },
  pillContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 99,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 24,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 40,
    letterSpacing: -1,
  },
  subtitleWrapper: {
    position: 'relative',
    marginTop: 4,
    marginBottom: 24,
  },
  mainTitleHighlight: {
    fontSize: 34,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 40,
    letterSpacing: -1,
  },
  underlineSvg: {
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: '100%',
    height: 12,
  },
  description: {
    fontSize: 15,
    color: '#787774',
    lineHeight: 22,
    fontWeight: '500',
    marginBottom: 32,
  },
  buttonGroup: {
    width: '70%',
    gap: 13,
    alignSelf: 'center', // Centers the component within its parent
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Fixed typo here
    backgroundColor: '#fcfcfc',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    gap: 8,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#787774',
  },
  imageContainer: {
    marginTop: 50,
    height: 320,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 10,
  },
  heroImage: {
    position: 'absolute',
    borderWidth: 4,
    borderColor: '#ffffff',
    backgroundColor: '#f1f5f9',
  },
  cloudShape1: {
    width: 170,
    height: 170,
    top: 0,
    right: 20,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 60,
    borderBottomRightRadius: 80,
    borderBottomLeftRadius: 120,
    zIndex: 20,
  },
  cloudShape2: {
    width: 190,
    height: 190,
    bottom: 20,
    left: 20,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 120,
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 60,
    zIndex: 10,
  },
  watermarkContainer: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  watermarkText: {
    fontSize: SCREEN_WIDTH * 0.17,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 4,
  },
  marketplaceSection: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 24,
  },
});