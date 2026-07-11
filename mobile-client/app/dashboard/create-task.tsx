import React, { useState } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert,
  Modal
} from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_BASE } from './_layout';

export default function CreateTaskScreen() {
  const { userId } = useAuth();
  const router = useRouter();
  const { userRole } = useLocalSearchParams<{ userRole: string }>();
  
  const [loading, setLoading] = useState(false);
  const [taskType, setTaskType] = useState<'remote' | 'on-site'>('remote');
  
  const [address, setAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '', // Format: YYYY-MM-DD
    skills: '',
  });

  // Pure JS Modal Calendar Engine
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  if (userRole === 'STUDENT_EARNER') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>🛑 Access Denied</Text>
        <Text style={styles.subErrorText}>Only Task Posters and Corporate Clients can deploy tasks.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/dashboard')}>
          <Text style={styles.backBtnText}>Return to Workspace</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const wordCount = formData.description.trim().split(/\s+/).filter(Boolean).length;

  const handleDummyLocate = () => {
    setSelectedLocation({ lat: 6.6191, lng: 80.5234 });
    setAddress('Pelmadulla, Sabaragamuwa Province (Mocked GPS)');
    Alert.alert("Location Mocked", "GPS layer simulated.");
  };

  // Pure JS Calendar Calculation Engine
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const daysArray = [];
    for (let i = 0; i < firstDayIndex; i++) {
      daysArray.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      daysArray.push(new Date(year, month, d));
    }
    return daysArray;
  };

  const handleSelectDay = (date: Date | null) => {
    if (!date) return;

    const today = new Date();
    today.setHours(0,0,0,0);
    
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    maxDate.setHours(23,59,59,999);

    if (date < today || date > maxDate) {
      Alert.alert("Date Blocked", "Deadline must fall within the next 30 days only.");
      return;
    }

    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const formatted = offsetDate.toISOString().split('T')[0];
    
    setFormData({ ...formData, deadline: formatted });
    setShowDatePicker(false);
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(nextMonth);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.budget || !formData.deadline) {
      Alert.alert("Validation Missing", "Please complete all mandatory fields.");
      return;
    }

    const structuredPayload: any = {
      title: formData.title,
      description: formData.description,
      budget: parseFloat(formData.budget) || 0,
      deadline: formData.deadline,
      skills_required: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      poster_clerk_id: userId,
      task_type: taskType
    };

    if (taskType === 'on-site' && selectedLocation) {
      structuredPayload.location = {
        type: 'Point',
        coordinates: [selectedLocation.lng, selectedLocation.lat],
        address: address
      };
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/v1/gigs/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(structuredPayload),
      });

      if (res.ok) {
        Alert.alert("🎉 Success", "Task posted successfully!");
        router.replace('/dashboard');
      } else {
        const errData = await res.json().catch(() => ({}));
        Alert.alert("Error", errData.detail || "Failed to process database ingestion.");
      }
    } catch (err) {
      Alert.alert("Network Error", "Could not establish connection to the backend.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        
        <View style={styles.header}>
          <Text style={styles.titleText}>Create a New Task Card</Text>
          <Text style={styles.subtitleText}>Fill out the specifications below to deploy your requirement.</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Task Project Title <Text style={{color: '#ef4444'}}>*</Text></Text>
          <TextInput 
            style={styles.input}
            placeholder="e.g., Develop landing page using Tailwind"
            value={formData.title}
            onChangeText={(t) => setFormData({ ...formData, title: t })}
          />
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.rowJustify}>
            <Text style={styles.label}>Detailed Description <Text style={{color: '#ef4444'}}>*</Text></Text>
            <Text style={[styles.wordCountText, wordCount >= 200 && { color: '#ef4444', fontWeight: '600' }]}>
              {wordCount}/200 words
            </Text>
          </View>
          <TextInput 
            style={[styles.input, styles.textArea]}
            placeholder="Break down details... (Max 200 words)"
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(text) => {
              const words = text.trim().split(/\s+/).filter(Boolean);
              if (words.length <= 200 || text.length < formData.description.length) {
                setFormData({ ...formData, description: text });
              }
            }}
          />
        </View>

        <View style={styles.formRow}>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Budget (LKR) <Text style={{color: '#ef4444'}}>*</Text></Text>
            <TextInput 
              style={[styles.input, styles.budgetText]}
              placeholder="15000"
              keyboardType="numeric"
              value={formData.budget}
              onChangeText={(t) => setFormData({ ...formData, budget: t })}
            />
          </View>
          
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Deadline <Text style={{color: '#ef4444'}}>*</Text></Text>
            <TouchableOpacity 
              style={styles.datePickerTrigger} 
              activeOpacity={0.7} 
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.datePickerText, !formData.deadline && { color: '#94a3b8' }]}>
                {formData.deadline ? formData.deadline : "Select Date"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Required Skills (Comma separated)</Text>
          <TextInput 
            style={styles.input}
            placeholder="React, TypeScript, UI Design"
            value={formData.skills}
            onChangeText={(t) => setFormData({ ...formData, skills: t })}
          />
        </View>

        <View style={styles.locationContainer}>
          <View style={styles.rowJustify}>
            <Text style={styles.label}>Task Location Requirement</Text>
            <View style={styles.toggleTrack}>
              <TouchableOpacity 
                style={[styles.toggleBtn, taskType === 'remote' && styles.toggleActive]}
                onPress={() => setTaskType('remote')}
              >
                <Text style={[styles.toggleText, taskType === 'remote' && styles.toggleTextActive]}>Remote</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleBtn, taskType === 'on-site' && styles.toggleActive]}
                onPress={() => setTaskType('on-site')}
              >
                <Text style={[styles.toggleText, taskType === 'on-site' && styles.toggleTextActive]}>On-Site</Text>
              </TouchableOpacity>
            </View>
          </View>

          {taskType === 'on-site' && (
            <View style={styles.mapWrapper}>
              <View style={styles.mapActionRow}>
                <TouchableOpacity style={styles.locateBtn} onPress={handleDummyLocate}>
                  <Text style={styles.locateBtnText}>📍 Locate Me</Text>
                </TouchableOpacity>
                <TextInput 
                  style={styles.addressDisplay}
                  editable={false}
                  placeholder="Click coordinates..."
                  value={address}
                />
              </View>
              <View style={styles.mapMockCanvas}>
                <Text style={styles.mapPlaceholderText}>🗺️ Maps Mock Surface Node</Text>
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, (taskType === 'on-site' && !selectedLocation) && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading || (taskType === 'on-site' && !selectedLocation)}
        >
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitBtnText}>Publish Task Card</Text>}
        </TouchableOpacity>

      </View>

      {/* CUSTOM JS MODAL CALENDAR (Zero Native Linking Needed) */}
      <Modal visible={showDatePicker} transparent animationType="fade" onRequestClose={() => setShowDatePicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModal}>
            <View style={styles.calendarHeaderRow}>
              <TouchableOpacity onPress={() => changeMonth('prev')}><Text style={styles.navArrow}>◀</Text></TouchableOpacity>
              <Text style={styles.calendarMonthTitle}>
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </Text>
              <TouchableOpacity onPress={() => changeMonth('next')}><Text style={styles.navArrow}>▶</Text></TouchableOpacity>
            </View>

            <View style={styles.weekDaysRow}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, idx) => (
                <Text key={idx} style={styles.weekDayText}>{d}</Text>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {generateCalendarDays().map((day, idx) => {
                const today = new Date();
                today.setHours(0,0,0,0);
                const maxD = new Date();
                maxD.setDate(today.getDate() + 30);
                maxD.setHours(23,59,59,999);

                const isBlocked = day && (day < today || day > maxD);

                return (
                  <TouchableOpacity 
                    key={idx} 
                    style={[styles.dayCell, !day && { opacity: 0 }, isBlocked && styles.dayCellBlocked]}
                    disabled={!day || isBlocked}
                    onPress={() => day && handleSelectDay(day)}
                  >
                    <Text style={[styles.dayCellText, isBlocked && styles.dayCellTextBlocked]}>
                      {day ? day.getDate() : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.closeCalendarBtn} onPress={() => setShowDatePicker(false)}>
              <Text style={styles.closeCalendarBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 140 },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#ededed' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, marginTop: 100 },
  errorText: { fontSize: 22, fontWeight: '700', color: '#191919', marginBottom: 8 },
  subErrorText: { fontSize: 14, color: '#7f8185', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  backBtn: { backgroundColor: '#2383e2', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  backBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  header: { alignItems: 'center', marginBottom: 24 },
  titleText: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  subtitleText: { fontSize: 13, color: '#7f8185', textAlign: 'center', fontWeight: '500', lineHeight: 18 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6 },
  rowJustify: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  wordCountText: { fontSize: 11, color: '#94a3b8' },
  input: { fontSize: 14, color: '#191919', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#cbd5e1', padding: 10, borderRadius: 10 },
  textArea: { height: 90, textAlignVertical: 'top' },
  formRow: { flexDirection: 'row', gap: 12 },
  budgetText: { color: '#2d913e', fontWeight: '600' },
  datePickerTrigger: { borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#FFFFFF', borderRadius: 10, padding: 11, justifyContent: 'center' },
  datePickerText: { fontSize: 14, color: '#191919', fontWeight: '500' },
  locationContainer: { borderTopWidth: 1, borderTopColor: '#e2e8f0', marginTop: 8, paddingVertical: 12 },
  toggleTrack: { flexDirection: 'row', backgroundColor: '#f1f5f9', padding: 2, borderRadius: 8 },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  toggleActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 1 },
  toggleText: { fontSize: 12, fontWeight: '500', color: '#64748b' },
  toggleTextActive: { color: '#0f172a', fontWeight: '600' },
  mapWrapper: { marginTop: 12, gap: 8 },
  mapActionRow: { flexDirection: 'row', gap: 8 },
  locateBtn: { backgroundColor: '#f1f5f9', justifyContent: 'center', paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1' },
  locateBtnText: { fontSize: 12, fontWeight: '600', color: '#334155' },
  addressDisplay: { flex: 1, fontSize: 12, color: '#64748b', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', padding: 8, borderRadius: 10 },
  mapMockCanvas: { height: 160, backgroundColor: '#f8fafc', borderRadius: 12, borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1', justifyContent: 'center', alignItems: 'center' },
  mapPlaceholderText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  submitBtn: { backgroundColor: '#2d913e', paddingVertical: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 12, shadowColor: '#2d913e', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2 },
  submitBtnDisabled: { backgroundColor: '#cbd5e1', shadowOpacity: 0 },
  submitBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  
  // Modal Styling
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  calendarModal: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, width: '100%', maxWidth: 340, elevation: 5 },
  calendarHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  calendarMonthTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  navArrow: { fontSize: 18, padding: 6, color: '#3b82f6' },
  weekDaysRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  weekDayText: { fontSize: 12, color: '#94a3b8', fontWeight: '600', width: 32, textAlign: 'center' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', gap: 4 },
  dayCell: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', borderRadius: 18 },
  dayCellBlocked: { backgroundColor: '#f1f5f9', borderRadius: 6, opacity: 0.4 },
  dayCellText: { fontSize: 13, color: '#0f172a', fontWeight: '500' },
  dayCellTextBlocked: { color: '#94a3b8', textDecorationLine: 'line-through' },
  closeCalendarBtn: { marginTop: 16, padding: 12, backgroundColor: '#f1f5f9', borderRadius: 10, alignItems: 'center' },
  closeCalendarBtnText: { fontSize: 13, color: '#475569', fontWeight: '600' }
});