import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import TaskMap from '@/components/TaskMap';
import { API_BASE } from '../_layout';
import { API_BASE_URL } from '@/constants/api';

type Message = { id: string; sender_id: string; text: string; timestamp: string };

export default function ApplicationWorkspaceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();
  const router = useRouter();
  const [application, setApplication] = useState<any>(null);
  const [gig, setGig] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [taskState, setTaskState] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [endCode, setEndCode] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTaskState = useCallback(async () => {
    if (!id) return;
    const response = await fetch(`${API_BASE}/api/v1/started-tasks/application/${id}`);
    if (response.ok) setTaskState(await response.json());
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const appResponse = await fetch(`${API_BASE}/api/v1/applications/${id}`);
        if (!appResponse.ok) throw new Error('Application not found');
        const app = await appResponse.json();
        if (app.application_confirm !== 'approve') {
          router.replace('/dashboard/applications' as any);
          return;
        }
        setApplication(app);
        const [gigResponse, studentResponse, messagesResponse] = await Promise.all([
          fetch(`${API_BASE}/api/v1/gigs/${app.gig_id}`),
          fetch(`${API_BASE}/api/v1/profiles/${app.student_clerk_id}`),
          fetch(`${API_BASE}/api/v1/messages/${id}`),
        ]);
        if (gigResponse.ok) setGig(await gigResponse.json());
        if (studentResponse.ok) setStudent(await studentResponse.json());
        if (messagesResponse.ok) setMessages(await messagesResponse.json());
        await fetchTaskState();
      } catch (error) {
        console.error('Failed to load workspace:', error);
        Alert.alert('Error', 'Could not load the task workspace.');
      } finally {
        setLoading(false);
      }
    };
    void load();
    const interval = setInterval(() => { void fetchTaskState(); }, 3000);
    return () => clearInterval(interval);
  }, [id, router, fetchTaskState]);

  useEffect(() => {
    if (!userId || !id) return;
    const base = API_BASE_URL.replace(/^http/, 'ws').replace(/\/api\/v1\/?$/, '');
    const socket = new WebSocket(`${base}/ws/${userId}`);
    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'NEW_MESSAGE' && payload.data.application_id === id) {
          setMessages((previous) => previous.some((message) => message.id === payload.data.id) ? previous : [...previous, payload.data]);
        }
      } catch (error) {
        console.error('Workspace message parse error:', error);
      }
    };
    return () => socket.close();
  }, [userId, id]);

  const postAction = async (path: string, body: object) => {
    const response = await fetch(`${API_BASE}/api/v1/started-tasks/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.detail || 'Task action failed.');
    await fetchTaskState();
  };

  const sendMessage = async () => {
    if (!input.trim() || !userId || !id) return;
    const text = input.trim();
    setInput('');
    try {
      const response = await fetch(`${API_BASE}/api/v1/messages/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ application_id: id, sender_id: userId, text }) });
      if (!response.ok) throw new Error('Message failed');
      const message = await response.json();
      setMessages((previous) => previous.some((item) => item.id === message.id) ? previous : [...previous, message]);
    } catch (error) {
      console.error('Failed to send message:', error);
      setInput(text);
      Alert.alert('Error', 'Could not send message.');
    }
  };

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;
  if (!application || !gig || !student) return <View style={styles.center}><Text style={styles.error}>Failed to load complete task workspace.</Text></View>;

  const coords = gig.location?.coordinates?.length === 2 ? gig.location.coordinates : [80.5234, 6.6191];
  const daysLeft = Math.max(0, Math.ceil((new Date(application.task_deadline).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86400000));

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>‹ Back to Applications</Text></TouchableOpacity>
        <View style={styles.taskCard}><View style={styles.taskMain}><Text style={styles.date}>📅 {application.task_deadline || 'TBD'}</Text><Text style={styles.taskTitle}>{gig.title}</Text><Text style={styles.applicant}>♙ Applicant: {student.display_name}</Text><Text style={styles.budget}>LKR {gig.budget?.toLocaleString() || 0}</Text><Text style={styles.location}>📍 Specific location pinned on map</Text></View><View style={styles.description}><Text style={styles.sectionTitle}>Task Description</Text><Text style={styles.body}>{gig.description}</Text><Text style={styles.label}>REQUIRED SKILLS</Text><View style={styles.skills}>{(gig.skills_required || []).map((skill: string) => <Text style={styles.skill} key={skill}>{skill}</Text>)}</View></View></View>
        <View style={styles.row}><View style={styles.deadlineCard}><Text style={styles.icon}>▣</Text><Text style={styles.label}>DEADLINE</Text><Text style={styles.days}>{daysLeft} <Text style={styles.daysUnit}>Days</Text></Text><Text style={styles.muted}>{daysLeft ? `Until ${application.task_deadline}` : 'Deadline has passed or is today'}</Text></View><View style={styles.profileCard}><Text style={styles.sectionTitle}>♙ Student Profile</Text><Info label="Name" value={student.display_name} /><Info label="Contact Email" value={student.email || 'Not provided'} /><Info label="Phone Number" value={student.phone_number || 'Not provided'} /><Info label="Address / Location" value={student.address || 'Not provided'} /><Info label="About" value={student.bio || 'No bio provided.'} /></View></View>
        <View style={styles.controlCard}><View style={styles.controlHeader}><Text style={styles.sectionTitle}>▷ Task Starter</Text><Text style={styles.controlTag}>Poster Control</Text></View>{taskState?.task_close ? <Text style={styles.closed}>✓ Task Officially Closed</Text> : taskState?.task_start ? <><Text style={styles.active}>● Student On Site & Working</Text>{taskState.end_code ? <><Text style={styles.body}>Enter the 4-digit code displayed on the student screen:</Text><View style={styles.codeRow}><TextInput style={styles.codeInput} value={endCode} onChangeText={(value) => setEndCode(value.replace(/\D/g, '').slice(0, 4))} keyboardType="number-pad" placeholder="4-Digit PIN" /><TouchableOpacity style={styles.verifyButton} onPress={() => postAction('verify-end-code', { application_id: id, code: endCode }).catch((error) => Alert.alert('Error', error.message))}><Text style={styles.buttonText}>Verify</Text></TouchableOpacity></View></> : <TouchableOpacity style={styles.endButton} onPress={() => postAction('initiate-end', { application_id: id }).catch((error) => Alert.alert('Error', error.message))}><Text style={styles.buttonText}>Task End With Code</Text></TouchableOpacity>}</> : <Text style={styles.muted}>Waiting for the student to initiate the task from their device...</Text>}</View>
        <View style={styles.mapCard}><Text style={styles.sectionTitle}>⌖ Task Location</Text><TaskMap coordinates={coords} /></View>
        <View style={styles.chatCard}><Text style={styles.sectionTitle}>Task Workspace Chat</Text><ScrollView style={styles.messages}>{messages.length === 0 ? <Text style={styles.muted}>No messages yet. Say hello to get started!</Text> : messages.map((message) => <View key={message.id} style={[styles.message, message.sender_id === userId && styles.myMessage]}><Text style={styles.messageText}>{message.text}</Text><Text style={styles.time}>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text></View>)}</ScrollView><View style={styles.composer}><TextInput style={styles.messageInput} value={input} onChangeText={setInput} placeholder="Type your message..." multiline /><TouchableOpacity style={styles.sendButton} onPress={sendMessage}><Text style={styles.buttonText}>Send</Text></TouchableOpacity></View></View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Info({ label, value }: { label: string; value: string }) { return <View style={styles.info}><Text style={styles.label}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>; }

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f7f5' },
  loader: { marginTop: 50 },
  container: { padding: 16, paddingBottom: 60 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  error: { color: '#dc2626', fontWeight: '700' },
  back: { marginBottom: 12 },
  backText: { color: '#2f96df', fontWeight: '700' },
  taskCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 16, marginBottom: 12 },
  taskMain: { borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 15, marginBottom: 15 },
  date: { color: '#94a3b8', fontSize: 12, textAlign: 'right', marginBottom: 10 },
  taskTitle: { color: '#0f172a', fontSize: 22, fontWeight: '800', marginBottom: 6 },
  applicant: { color: '#64748b', fontSize: 13, marginBottom: 12 },
  budget: { color: '#007fff', fontSize: 28, fontWeight: '900', marginBottom: 10 },
  location: { color: '#64748b', backgroundColor: '#f8fafc', padding: 8, alignSelf: 'flex-start', borderRadius: 6, fontSize: 12 },
  description: {},
  sectionTitle: { color: '#0f172a', fontWeight: '800', fontSize: 16, marginBottom: 10 },
  body: { color: '#64748b', fontSize: 13, lineHeight: 20 },
  label: { color: '#94a3b8', fontSize: 10, fontWeight: '800', letterSpacing: 0.5, marginTop: 12, marginBottom: 5 },
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skill: { backgroundColor: '#4285f4', color: '#fff', fontSize: 11, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 5 },
  row: { gap: 12, marginBottom: 12 },
  deadlineCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 18, alignItems: 'center' },
  profileCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 16 },
  icon: { fontSize: 24, color: '#64748b' },
  days: { color: '#0f172a', fontSize: 40, fontWeight: '900', marginVertical: 5 },
  daysUnit: { color: '#94a3b8', fontSize: 16 },
  muted: { color: '#94a3b8', fontSize: 12, textAlign: 'center', lineHeight: 19 },
  info: { marginBottom: 8 },
  infoValue: { color: '#475569', fontSize: 13 },
  controlCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 16, marginBottom: 12 },
  controlHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  controlTag: { backgroundColor: '#f1f5f9', color: '#64748b', fontSize: 10, fontWeight: '700', padding: 5, borderRadius: 10 },
  closed: { color: '#059669', backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#a7f3d0', padding: 14, borderRadius: 8, textAlign: 'center', fontWeight: '800' },
  active: { color: '#1d4ed8', backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe', padding: 12, borderRadius: 8, fontWeight: '800', marginBottom: 10 },
  endButton: { backgroundColor: '#e66d22', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  codeRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  codeInput: { flex: 1, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10 },
  verifyButton: { backgroundColor: '#2f96df', borderRadius: 8, justifyContent: 'center', paddingHorizontal: 18 },
  buttonText: { color: '#fff', fontWeight: '800' },
  mapCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 16, marginBottom: 12 },
  map: { height: 220, borderRadius: 8 },
  chatCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 14, minHeight: 400 },
  messages: { maxHeight: 320, backgroundColor: '#f8fafc', padding: 10, borderRadius: 8 },
  message: { alignSelf: 'flex-start', maxWidth: '85%', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 10, marginBottom: 8 },
  myMessage: { alignSelf: 'flex-end', borderColor: '#2f96df' },
  messageText: { color: '#1e293b', fontSize: 14 },
  time: { color: '#94a3b8', fontSize: 10, marginTop: 4, textAlign: 'right' },
  composer: { flexDirection: 'row', gap: 8, marginTop: 10, alignItems: 'flex-end' },
  messageInput: { flex: 1, minHeight: 46, maxHeight: 100, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, textAlignVertical: 'top' },
  sendButton: { backgroundColor: '#2f96df', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 13 },
});
