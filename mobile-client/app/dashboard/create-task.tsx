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
import { WebView } from 'react-native-webview';
import { Copy, Check, Sparkles } from 'lucide-react-native';
import { API_BASE } from './_layout';

export default function CreateTaskScreen() {
  const { userId } = useAuth();
  const router = useRouter();
  const { userRole } = useLocalSearchParams<{ userRole: string }>();
  
  const [loading, setLoading] = useState(false);
  
  // Real Location & WebView Map States
  const [address, setAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    skills: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [aiSuggestions, setAiSuggestions] = useState({ title: '', description: '' });
  const [loadingAi, setLoadingAi] = useState({ title: false, description: false });
  const [copied, setCopied] = useState({ title: false, description: false });

  if (userRole === 'STUDENT_EARNER') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>🛑 Access Denied</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/dashboard')}>
          <Text style={styles.backBtnText}>Return to Workspace</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const wordCount = formData.description.trim().split(/\s+/).filter(Boolean).length;
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  // --- Injecting a Real Interactive Google Map via HTML5 Geolocation ---
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
      <style>
        html, body, #map { height: 100%; margin: 0; padding: 0; }
      </style>
      <script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap" async defer></script>
      <script>
        let map, marker;
        function initMap() {
          // Default center: Pelmadulla
          const defaultPos = { lat: 6.855521, lng: 80.092607 };
          map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: defaultPos,
            disableDefaultUI: true
          });

          // Try browser geolocation automatically inside WebView
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
              map.setCenter(pos);
              placeMarker(pos);
            });
          }

          map.addListener('click', (e) => {
            placeMarker(e.latLng.toJSON());
          });
        }

        function placeMarker(location) {
          if (marker) { marker.setMap(null); }
          marker = new google.maps.Marker({ position: location, map: map });
          window.ReactNativeWebView.postMessage(JSON.stringify(location));
        }
      </script>
    </head>
    <body>
      <div id="map"></div>
    </body>
    </html>
  `;

  const handleMapMessage = async (event: any) => {
    try {
      const coords = JSON.parse(event.nativeEvent.data);
      setSelectedLocation({ lat: coords.lat, lng: coords.lng });
      
      // Fetch readable address using reverse geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${apiKey}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setAddress(data.results[0].formatted_address);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // --- Pure JS Modal Calendar Engine ---
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const daysArray = [];
    for (let i = 0; i < firstDayIndex; i++) daysArray.push(null);
    for (let d = 1; d <= totalDays; d++) daysArray.push(new Date(year, month, d));
    return daysArray;
  };

  const handleSelectDay = (date: Date | null) => {
    if (!date) return;
    const today = new Date();
    today.setHours(0,0,0,0);
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    
    if (date < today || date > maxDate) {
      Alert.alert("Date Blocked", "Deadline must fall within the next 30 days only.");
      return;
    }
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    setFormData({ ...formData, deadline: offsetDate.toISOString().split('T')[0] });
    setShowDatePicker(false);
  };

  const handleEnhance = async (field: 'title' | 'description') => {
      const text = formData[field];
      if (!text.trim()) {
        Alert.alert('Missing text', `Please enter a ${field} first.`);
        return;
      }
      setLoadingAi((previous) => ({ ...previous, [field]: true }));
      try {
        const response = await fetch(`${API_BASE}/api/v1/gigs/enhance-text`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, field_type: field }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.detail || 'Failed to get AI suggestion.');
        setAiSuggestions((previous) => ({ ...previous, [field]: data.enhanced_text }));
      } catch (error) {
        console.error('AI enhancement error:', error);
        Alert.alert('AI error', 'Could not generate a suggestion.');
      } finally {
        setLoadingAi((previous) => ({ ...previous, [field]: false }));
      }
    };

  const copySuggestion = async (field: 'title' | 'description') => {
      const suggestion = aiSuggestions[field];
      if (!suggestion) return;
      const Clipboard = await import('expo-clipboard');
      await Clipboard.setStringAsync(suggestion);
      setCopied((previous) => ({ ...previous, [field]: true }));
      setTimeout(() => setCopied((previous) => ({ ...previous, [field]: false })), 2000);
    };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.budget || !formData.deadline) {
      Alert.alert("Validation Missing", "Please complete all mandatory fields.");
      return;
    }
    if (!selectedLocation) {
      Alert.alert("Location Missing", "Please tap the map to set the physical task location.");
      return;
    }

    const structuredPayload = {
      title: formData.title,
      description: formData.description,
      budget: parseFloat(formData.budget) || 0,
      deadline: formData.deadline,
      skills_required: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      poster_clerk_id: userId,
      task_type: 'on-site' as const,
      location: {
        type: 'Point',
        coordinates: [selectedLocation.lng, selectedLocation.lat] as [number, number],
        address
      }
    };

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
        Alert.alert("Error", errData.detail || "Failed to save task.");
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
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Task Project Title *</Text>
          <TextInput style={styles.input} value={formData.title} onChangeText={(t) => setFormData({ ...formData, title: t })} />
          <TouchableOpacity style={styles.aiButton} onPress={() => handleEnhance('title')} disabled={loadingAi.title}>
            <Sparkles size={14} color="#2d913e" /><Text style={styles.aiButtonText}>{loadingAi.title ? 'Analyzing...' : 'Write with AI'}</Text>
          </TouchableOpacity>
          {aiSuggestions.title ? <Suggestion text={aiSuggestions.title} copied={copied.title} onCopy={() => copySuggestion('title')} /> : null}
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.rowJustify}>
            <Text style={styles.label}>Detailed Description *</Text>
            <Text style={styles.wordCountText}>{wordCount}/200 words</Text>
          </View>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            multiline 
            value={formData.description} 
            onChangeText={(text) => {
              if (text.trim().split(/\s+/).filter(Boolean).length <= 200) setFormData({ ...formData, description: text });
            }}
          />
          <TouchableOpacity style={styles.aiButton} onPress={() => handleEnhance('description')} disabled={loadingAi.description}>
            <Sparkles size={14} color="#2d913e" /><Text style={styles.aiButtonText}>{loadingAi.description ? 'Drafting...' : 'Write with AI'}</Text>
          </TouchableOpacity>
          {aiSuggestions.description ? <Suggestion text={aiSuggestions.description} copied={copied.description} onCopy={() => copySuggestion('description')} /> : null}
        </View>

        <View style={styles.formRow}>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Budget (LKR) *</Text>
            <TextInput style={[styles.input, styles.budgetText]} keyboardType="numeric" value={formData.budget} onChangeText={(t) => setFormData({ ...formData, budget: t })} />
          </View>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Deadline *</Text>
            <TouchableOpacity style={styles.datePickerTrigger} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.datePickerText}>{formData.deadline ? formData.deadline : "Select Date"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Required Skills (Comma separated)</Text>
          <TextInput style={styles.input} placeholder="React, Tailwind" value={formData.skills} onChangeText={(t) => setFormData({ ...formData, skills: t })} />
        </View>

        <View style={styles.locationContainer}>
          <View style={styles.rowJustify}>
            <Text style={styles.label}>Physical Task Location</Text>
          </View>

          <View style={styles.mapWrapper}>
            <TextInput style={styles.addressDisplay} editable={false} placeholder="Tap on the map to set location pin..." value={address} />
            <View style={styles.realMapSurface}>
              <WebView
                originWhitelist={['*']}
                source={{ html: mapHtml }}
                onMessage={handleMapMessage}
                geolocationEnabled={true}
                style={styles.mapElement}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitBtnText}>Publish Task Card</Text>}
        </TouchableOpacity>
      </View>

      {/* Custom Calendar Modal */}
      <Modal visible={showDatePicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModal}>
            <View style={styles.daysGrid}>
              {generateCalendarDays().map((day, idx) => (
                <TouchableOpacity key={idx} style={[styles.dayCell, !day && { opacity: 0 }]} disabled={!day} onPress={() => handleSelectDay(day)}>
                  <Text style={styles.dayCellText}>{day ? day.getDate() : ''}</Text>
                </TouchableOpacity>
              ))}
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
  errorText: { fontSize: 18, fontWeight: '700', color: '#ef4444', marginBottom: 16 },
  backBtn: { backgroundColor: '#2383e2', padding: 10, borderRadius: 8 },
  backBtnText: { color: '#FFFFFF', fontWeight: '600' },
  header: { alignItems: 'center', marginBottom: 20 },
  titleText: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6 },
  aiButton: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', marginTop: 7 },
  aiButtonText: { fontSize: 12, fontWeight: '600', color: '#2d913e' },
  suggestion: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f3f9f4', borderWidth: 1, borderColor: '#b8dcbc', borderRadius: 8, padding: 10, marginTop: 8 },
  suggestionText: { flex: 1, color: '#475569', fontSize: 13, lineHeight: 19 },
  copyButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, padding: 7 },
  rowJustify: { flexDirection: 'row', justifyContent: 'space-between' },
  wordCountText: { fontSize: 11, color: '#94a3b8' },
  input: { fontSize: 14, color: '#191919', borderWidth: 1, borderColor: '#cbd5e1', padding: 10, borderRadius: 10 },
  textArea: { height: 80, textAlignVertical: 'top' },
  formRow: { flexDirection: 'row', gap: 12 },
  budgetText: { color: '#2d913e', fontWeight: '600' },
  datePickerTrigger: { borderWidth: 1, borderColor: '#cbd5e1', padding: 11, borderRadius: 10 },
  datePickerText: { fontSize: 14, color: '#191919' },
  locationContainer: { borderTopWidth: 1, borderTopColor: '#e2e8f0', marginTop: 8, paddingVertical: 12 },
  mapWrapper: { marginTop: 12, gap: 8 },
  addressDisplay: { fontSize: 12, color: '#64748b', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', padding: 8, borderRadius: 10 },
  realMapSurface: { height: 200, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#cbd5e1' },
  mapElement: { flex: 1 },
  submitBtn: { backgroundColor: '#2d913e', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  submitBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  calendarModal: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, width: 280 },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  dayCell: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  dayCellText: { fontSize: 13 },
  closeCalendarBtn: { marginTop: 12, alignItems: 'center', padding: 8, backgroundColor: '#f1f5f9', borderRadius: 8 },
  closeCalendarBtnText: { color: '#475569', fontWeight: '600' }
});

function Suggestion({ text, copied, onCopy }: { text: string; copied: boolean; onCopy: () => void }) {
  return (
    <View style={styles.suggestion}>
      <Text style={styles.suggestionText}>{text}</Text>
      <TouchableOpacity style={styles.copyButton} onPress={onCopy}>
        {copied ? <Check size={16} color="#2d913e" /> : <Copy size={16} color="#64748b" />}
      </TouchableOpacity>
    </View>
  );
}