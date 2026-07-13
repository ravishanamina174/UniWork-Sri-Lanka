import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { ArrowRight, Sparkles, Award } from 'lucide-react-native';

import TaskMarketplace, { TaskGig } from '@/components/TaskMarketplace';
import { fetchAllGigs } from '@/constants/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const WORDS = [
  { text: 'Earn', color: '#10B981' }, 
  { text: 'Post', color: '#F59E0B' }, 
  { text: 'Scale', color: '#007FFF' }, 
];

export default function HomeScreen() {
  const { userId } = useAuth();
  
  const [tasks, setTasks] = useState<TaskGig[]>([]);
  const [loading, setLoading] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    fetchAllGigs()
      .then(setTasks)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchUserRole = async () => {
      try {
        const res = await fetch(`http://192.168.1.10:8000/api/v1/auth/user/clerk/${userId}`);
        
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

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= HERO & INTERACTIVE BACKGROUND REVEAL ENGINE ================= */}
        <View style={styles.heroContainer}>
          <View style={styles.dotGridContainer} pointerEvents="none">
            {Array.from({ length: 120 }).map((_, i) => (
              <View key={`dot-${i}`} style={styles.gridDot} />
            ))}
          </View>

          <View style={styles.pill}>
            <View style={styles.pillDot} />
            <Text style={styles.pillText}>
              The First Dedicated Student Task Network in Sri Lanka
            </Text>
          </View>

          <View style={styles.typographyWrapper}>
            <View style={[styles.doodleContainer, { top: -12, left: -4, transform: [{ rotate: '-15deg' }] }]}>
              <Sparkles size={20} color="#10B981" strokeWidth={2.2} />
            </View>

            <View style={[styles.doodleContainer, { top: -28, left: '46%' }]}>
              <Award size={24} color="#F59E0B" strokeWidth={2} />
            </View>

            <View style={styles.nativeLoopDoodle} pointerEvents="none">
              <View style={styles.loopArrowHead} />
            </View>

            <Text style={styles.mainHeadline}>
              Where independent talents and ecosystems{' '}
              <Text style={{ color: WORDS[wordIndex].color }}>
                {WORDS[wordIndex].text}
              </Text>{' '}
              together.
            </Text>
          </View>

          <Text style={styles.tagline}>
            Empowering student earners with flexible pathways, helping task posters find
            immediate execution, and enabling corporate clients to scale velocity seamlessly.
          </Text>

          <View style={styles.ctaButtonWrapper}>
            <Link href="/tasks" asChild>
              <TouchableOpacity style={styles.ctaButton} activeOpacity={0.85}>
                <Text style={styles.ctaButtonText}>Browse All Tasks</Text>
                <ArrowRight size={15} color="#FFFFFF" strokeWidth={2.5} />
              </TouchableOpacity>
            </Link>

            <Link href="/about" asChild>
              <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
                <Text style={styles.secondaryButtonText}>Our Vision</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* ================= PREMIUM LANYARD CARD DECK ================= */}
        <View style={styles.deckSection}>
          <View style={styles.deckCanvas}>
            <View style={[styles.deckCard, styles.cardLeft, styles.shadowCommon]}>
              <View style={styles.cardHeaderGraphic}>
                <Image 
                  source={require('@/assets/images/Move.jpg')} 
                  style={styles.cardCoverImage} 
                  resizeMode="cover"
                />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabelTitle}>UniWork Verified</Text>
                <Text style={styles.cardLabelSubtitle}>Student Earner Deck</Text>
                <View style={styles.cardFooterDivider}>
                  <Text style={styles.cardMetaId}>ID 2026</Text>
                  <Text style={[styles.cardStatusBadge, { color: '#10B981' }]}>Active</Text>
                </View>
              </View>
            </View>

            <View style={[styles.deckCard, styles.cardCenter, styles.shadowCenterPremium]}>
              <View style={styles.cardHeaderGraphic}>
                <Image 
                  source={require('@/assets/images/wall.jpg')} 
                  style={styles.cardCoverImage} 
                  resizeMode="cover"
                />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardLabelTitle, { fontSize: 14 }]}>UniWork Verified</Text>
                <Text style={styles.cardLabelSubtitle}>Micro-Gig Network</Text>
                <View style={styles.cardFooterDivider}>
                  <Text style={styles.cardMetaId}>ID 0032</Text>
                  <Text style={[styles.cardStatusBadge, { color: '#10B981' }]}>Active</Text>
                </View>
              </View>
            </View>

            <View style={[styles.deckCard, styles.cardRight, styles.shadowCommon]}>
              <View style={styles.cardHeaderGraphic}>
                <Image 
                  source={require('@/assets/images/COP.jpg')} 
                  style={styles.cardCoverImage} 
                  resizeMode="cover"
                />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabelTitle}>UniWork Verified</Text>
                <Text style={styles.cardLabelSubtitle}>Corporate Pool</Text>
                <View style={styles.cardFooterDivider}>
                  <Text style={styles.cardMetaId}>ID 7099</Text>
                  <Text style={[styles.cardStatusBadge, { color: '#007FFF' }]}>Enterprise</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.deckBaseLineIndicator} />
        </View>

        {/* ================= GIG DISPLAY SECTION ================= */}
        <View style={styles.marketplaceSectionHeader}>
          <Text style={styles.marketplaceTitleSection}>Available Opportunities</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007FFF" />
          </View>
        ) : (
          <TaskMarketplace tasks={tasks} embedded userRole={userRole} />
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
    paddingBottom: 115, 
  },
  heroContainer: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 36,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
  },
  dotGridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    opacity: 0.18,
    paddingTop: 10,
  },
  gridDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#94A3B8',
    marginHorizontal: 11,
    marginVertical: 11,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    marginBottom: 28,
    zIndex: 20,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007FFF',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#838991',
    letterSpacing: 0.2,
  },
  typographyWrapper: {
    position: 'relative',
    width: '100%',
    paddingHorizontal: 12,
    marginBottom: 16,
    zIndex: 20,
  },
  mainHeadline: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 38,
    letterSpacing: -0.6,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '500',
    color: '#989A9C',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 325,
    marginBottom: 28,
    zIndex: 20,
  },
  doodleContainer: {
    position: 'absolute',
    pointerEvents: 'none',
  },
  nativeLoopDoodle: {
    position: 'absolute',
    bottom: -8,
    right: 12,
    width: 32,
    height: 24,
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
    borderColor: '#007FFF',
    borderBottomRightRadius: 14,
    opacity: 0.75,
  },
  loopArrowHead: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#007FFF',
    transform: [{ rotate: '45deg' }],
  },
  ctaButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    zIndex: 20,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#007FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  ctaButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  deckSection: {
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 32,
    alignItems: 'center',
  },
  deckCanvas: {
    width: '100%',
    height: 240,
    position: 'relative',
    justifyContent: 'center',
  },
  deckCard: {
    position: 'absolute',
    width: (SCREEN_WIDTH - 32) * 0.33,
    height: 210,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  cardHeaderGraphic: {
    height: '42%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#F8FAFC',
  },
  cardCoverImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  cardLabelTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 14,
  },
  cardLabelSubtitle: {
    fontSize: 9,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
  },
  cardFooterDivider: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardMetaId: {
    fontSize: 8,
    fontWeight: '700',
    color: '#94A3B8',
  },
  cardStatusBadge: {
    fontSize: 8,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cardLeft: {
    left: 4,
    top: 15,
    transform: [{ rotate: '-6deg' }, { scale: 0.96 }],
    zIndex: 10,
  },
  cardCenter: {
    alignSelf: 'center',
    top: 0,
    transform: [{ rotate: '2deg' }, { scale: 1.05 }],
    zIndex: 30,
    borderColor: '#CBD5E1',
  },
  cardRight: {
    right: 4,
    top: 20,
    transform: [{ rotate: '6deg' }, { scale: 0.96 }],
    zIndex: 20,
  },
  shadowCommon: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  shadowCenterPremium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  deckBaseLineIndicator: {
    width: 140,
    height: 3,
    backgroundColor: '#E2E8F0',
    borderRadius: 99,
    marginTop: 16,
    opacity: 0.6,
  },
  marketplaceSectionHeader: {
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 8,
  },
  marketplaceTitleSection: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
});