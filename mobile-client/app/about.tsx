// mobile-client/app/about.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { X, MessageSquarePlus, Send, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAuth } from '@clerk/clerk-expo'; // <-- Added critical import

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SUGGESTION_CARDS = [
  "Improve UI/UX Design",
  "Simplify User Flow",
  "Faster Payout Processing",
  "More Task Categories",
  "Add Mobile App Version",
  "Enhance Chat System",
  "Student Verification Badges",
  "Location-based Filters",
  "Poster Ratings & Reviews",
  "Student Buddy System"
];

const getTagTheme = (index: number, isSelected: boolean) => {
  const themes = [
    { default: { border: '#BFDBFE', text: '#28292b', bg: '#FFFFFF' }, active: { border: '#3B82F6', text: '#1E40AF', bg: '#EFF6FF' } },
    { default: { border: '#A7F3D0', text: '#28292b', bg: '#FFFFFF' }, active: { border: '#10B981', text: '#065F46', bg: '#ECFDF5' } },
    { default: { border: '#FDE68A', text: '#28292b', bg: '#FFFFFF' }, active: { border: '#F59E0B', text: '#92400E', bg: '#FFFBEB' } },
    { default: { border: '#E9D5FF', text: '#28292b', bg: '#FFFFFF' }, active: { border: '#A855F7', text: '#6B21A8', bg: '#FAF5FF' } },
    { default: { border: '#FECDD3', text: '#28292b', bg: '#FFFFFF' }, active: { border: '#F43F5E', text: '#9F1239', bg: '#FFF1F2' } }
  ];
  const theme = themes[index % themes.length];
  return isSelected ? theme.active : theme.default;
};

// ==================== PREMIUM FEEDBACK SECTION ====================
function FeedbackSection({ userClerkId, userRole }: { userClerkId: string; userRole: string }) {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;
  const isOverWordLimit = wordCount > 200;

  const toggleCard = (cardText: string) => {
    setSelectedCards((prev) =>
      prev.includes(cardText) ? prev.filter((c) => c !== cardText) : [...prev, cardText]
    );
  };

  const handleSubmit = async () => {
    setStatusMessage(null);

    if (selectedCards.length === 0 && !description.trim()) {
      setStatusMessage({ type: "error", text: "Please select a card or write some feedback." });
      return;
    }

    if (isOverWordLimit) {
      setStatusMessage({ type: "error", text: "Keep feedback under 200 words." });
      return;
    }

    setIsSubmitting(true);

    try {
      // Automatically switches endpoints based on iOS Simulator vs Android Emulator
      const API_URL = Platform.OS === 'android' ? 'http://192.168.1.3:8000' : 'http://192.168.1.3:8000';
      
      const res = await fetch(`${API_URL}/api/v1/feedback/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_clerk_id: userClerkId || "guest_user",
          user_role: userRole || "student",
          issue_cards: selectedCards,
          feedback_description: description
        })
      });

      if (res.ok) {
        setStatusMessage({ type: "success", text: "Thanks! Your thoughts have been sent to the team." });
        setSelectedCards([]);
        setDescription("");
      } else {
        const errorData = await res.json();
        setStatusMessage({ type: "error", text: errorData.detail || "Failed to send feedback." });
      }
    } catch (err) {
      setStatusMessage({ type: "error", text: "Network error occurred. Make sure your backend is running." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.feedbackContainer}>
      <View style={styles.feedbackHeader}>
        <View style={styles.iconWrapper}>
          <MessageSquarePlus color="#c68b4f" size={24} />
        </View>
        <Text style={styles.feedbackTitle}>Help Us Improve the Platform</Text>
        <Text style={styles.feedbackSubtitle}>
          Your feedback shapes our next features. Select some quick ideas below or drop us a detailed note.
        </Text>
      </View>

      <View style={styles.sectionBlock}>
        <Text style={styles.sectionLabel}>Quick feature suggestions</Text>
        <View style={styles.tagsContainer}>
          {SUGGESTION_CARDS.map((card, idx) => {
            const isSelected = selectedCards.includes(card);
            const theme = getTagTheme(idx, isSelected);
            
            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => toggleCard(card)}
                style={[
                  styles.tagButton,
                  { backgroundColor: theme.bg, borderColor: theme.border }
                ]}
              >
                <Text style={[styles.tagText, { color: theme.text }]}>{card}</Text>
                {isSelected && <CheckCircle2 size={14} color={theme.text} style={{ marginLeft: 6 }} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.sectionBlock}>
        <Text style={styles.sectionLabel}>Share your detailed thoughts</Text>
        <View style={styles.textAreaWrapper}>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={6}
            placeholder="Add your thoughts, feedback, or any friction you experienced..."
            placeholderTextColor="#8a8b8d"
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
          <Text style={[styles.wordCount, isOverWordLimit && styles.wordCountError]}>
            {wordCount} / 200 words
          </Text>
        </View>
      </View>

      {statusMessage && (
        <View style={[
          styles.statusBox, 
          statusMessage.type === 'success' ? styles.statusSuccess : styles.statusError
        ]}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 size={18} color="#047857" />
          ) : (
            <AlertCircle size={18} color="#B91C1C" />
          )}
          <Text style={[
            styles.statusText,
            statusMessage.type === 'success' ? { color: '#047857' } : { color: '#B91C1C' }
          ]}>
            {statusMessage.text}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
        activeOpacity={0.8}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#28292b" size="small" />
        ) : (
          <>
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
            <Send size={16} color="#28292b" />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ==================== MAIN PAGE COMPONENT ====================
export default function AboutPage() {
  const router = useRouter();
  
  // Destructured `userId` and `signOut` safely now that the import is present
  const { userId, signOut } = useAuth(); 
  const userRole = "student";

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient
        colors={['rgba(243, 232, 255, 0.4)', 'rgba(238, 242, 255, 0.2)', 'transparent']}
        style={styles.meshBackground}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      
       <View style={styles.headerRow}>
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
        {/* HERO SECTION */}
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

        {/* CONTENT CARD SECTION */}
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

        {/* FEEDBACK SECTION */}
        <FeedbackSection userClerkId={userId ?? "guest_user"} userRole={userRole} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  meshBackground: { position: 'absolute', top: 0, left: 0, right: 0, height: 450 },
  headerRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, zIndex: 30 },
  closeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 60 },
  heroSection: { alignItems: 'center', marginBottom: 32 },
  mainHeadline: { fontSize: 28, fontWeight: '800', color: '#0F172A', textAlign: 'center', lineHeight: 38 },
  accentTextInline: { color: '#0F172A' },
  crownDoodle: { marginBottom: 16, opacity: 0.2 },
  
  // Career Card Styles
  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, marginBottom: 32 },
  cardImage: { width: '100%', height: 220 },
  cardContent: { padding: 20 },
  badge: { backgroundColor: '#F1F5F9', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' },
  cardTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 10 },
  cardSubtitle: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 20 },
  cardBody: { fontSize: 14, lineHeight: 22, color: '#64748B', marginBottom: 16 },

  // Feedback Section Styles
  feedbackContainer: { backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: '#E2E8F0', padding: 20, marginTop: 10, marginBottom: 20 },
  feedbackHeader: { alignItems: 'center', marginBottom: 24 },
  iconWrapper: { backgroundColor: '#EFF6FF', padding: 12, borderRadius: 16, marginBottom: 16 },
  feedbackTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A', textAlign: 'center', marginBottom: 8 },
  feedbackSubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20, paddingHorizontal: 10 },
  
  sectionBlock: { marginBottom: 24 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 12 },
  
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1 },
  tagText: { fontSize: 13, fontWeight: '500' },
  
  textAreaWrapper: { position: 'relative' },
  textArea: { backgroundColor: '#FCFCFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, paddingTop: 16, fontSize: 14, color: '#0F172A', minHeight: 140 },
  wordCount: { position: 'absolute', bottom: 12, right: 16, fontSize: 12, fontWeight: '600', color: '#94A3B8' },
  wordCountError: { color: '#EF4444' },

  statusBox: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 20, borderWidth: 1 },
  statusSuccess: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  statusError: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  statusText: { fontSize: 13, fontWeight: '500', marginLeft: 8, flex: 1 },

  submitButton: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', paddingVertical: 14, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
});