import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import TaskMap from '@/components/TaskMap';
import { API_BASE } from '../_layout';
import { API_BASE_URL } from '@/constants/api';

type Application = { id: string; gig_id: string; gig_title: string; poster_clerk_id: string; application_confirm: string; task_deadline: string };
type Gig = { title: string; description: string; budget: number; skills_required: string[]; location?: { coordinates?: [number, number]; address?: string } };
type Profile = { display_name?: string; email?: string; phone_number?: string };
type TaskState = { task_start: boolean; inside_location_approve: boolean; task_close: boolean; start_code?: string | null; end_code?: string | null };
type Message = { id: string; application_id?: string; sender_id: string; text: string; timestamp: string };

export default function StudentTaskWorkspaceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [gig, setGig] = useState<Gig | null>(null);
  const [poster, setPoster] = useState<Profile | null>(null);
  const [taskState, setTaskState] = useState<TaskState | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [startCode, setStartCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const fetchTaskState = useCallback(async () => {
    if (!id) return;
    const response = await fetch(`${API_BASE}/api/v1/started-tasks/application/${id}`);
    if (response.ok) setTaskState(await response.json() as TaskState);
  }, [id]);

  const loadWorkspace = useCallback(async () => {
    if (!id) return;
    try {
      const applicationResponse = await fetch(`${API_BASE}/api/v1/applications/${id}`);
      if (!applicationResponse.ok) throw new Error('Application not found.');
      const applicationData = await applicationResponse.json() as Application;
      setApplication(applicationData);
      const [gigResponse, posterResponse, messagesResponse] = await Promise.all([
        fetch(`${API_BASE}/api/v1/gigs/${applicationData.gig_id}`),
        fetch(`${API_BASE}/api/v1/profiles/${applicationData.poster_clerk_id}`),
        fetch(`${API_BASE}/api/v1/messages/${id}`),
      ]);
      if (gigResponse.ok) setGig(await gigResponse.json() as Gig);
      if (posterResponse.ok) setPoster(await posterResponse.json() as Profile);
      if (messagesResponse.ok) setMessages(await messagesResponse.json() as Message[]);
      await fetchTaskState();
    } catch (error) {
      console.error('Failed to load student workspace:', error);
      Alert.alert('Error', 'Could not load this task workspace.');
    } finally {
      setLoading(false);
    }
  }, [fetchTaskState, id]);

  useEffect(() => { void loadWorkspace(); }, [loadWorkspace]);

  useEffect(() => {
    if (!id) return;
    const interval = setInterval(() => { void fetchTaskState(); }, 3000);
    return () => clearInterval(interval);
  }, [fetchTaskState, id]);

  useEffect(() => {
    if (!userId || !id) return;
    const websocketBase = API_BASE_URL.replace(/^http/, 'ws').replace(/\/api\/v1\/?$/, '');
    const socket = new WebSocket(`${websocketBase}/ws/${userId}`);
    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as { type?: string; data?: Message };
        if (payload.type === 'NEW_MESSAGE' && payload.data?.application_id === id) {
          setMessages((current) => current.some((message) => message.id === payload.data?.id) ? current : [...current, payload.data as Message]);
        }
      } catch (error) {
        console.error('Failed to parse workspace message:', error);
      }
    };
    return () => socket.close();
  }, [id, userId]);

  const postAction = async (path: string, body: object) => {
    setBusy(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/started-tasks/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await response.json().catch(() => ({})) as { detail?: string };
      if (!response.ok) throw new Error(data.detail || 'Task action failed.');
      await fetchTaskState();
    } catch (error: unknown) {
      Alert.alert('Task action failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const verifyLocationAndStart = async () => {
    if (!id) return;
    setBusy(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') throw new Error('Location permission is required to start this task.');
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const response = await fetch(`${API_BASE}/api/v1/started-tasks/verify-location`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ application_id: id, latitude: location.coords.latitude, longitude: location.coords.longitude }) });
      const data = await response.json().catch(() => ({})) as { detail?: string };
      if (!response.ok) throw new Error(data.detail || 'Location verification failed.');
      await fetchTaskState();
      Alert.alert('Task started', 'Your location was verified and the task is now active.');
    } catch (error: unknown) {
      Alert.alert('Could not start task', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const sendMessage = async () => {
    if (!id || !userId || !input.trim()) return;
    const text = input.trim();
    setInput('');
    try {
      const response = await fetch(`${API_BASE}/api/v1/messages/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ application_id: id, sender_id: userId, text }) });
      if (!response.ok) throw new Error('Message could not be sent.');
      const message = await response.json() as Message;
      setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, message]);
    } catch (error: unknown) {
      setInput(text);
      Alert.alert('Message failed', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#007FFF" style={styles.loader} />;
  if (!application || !gig) return <View style={styles.center}><Text style={styles.error}>Failed to load complete task workspace.</Text></View>;

  const approved = application.application_confirm === 'approve';
  const coords: [number, number] = gig.location?.coordinates?.length === 2 ? gig.location.coordinates : [80.5234, 6.6191];

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹ Back to My Tasks</Text></TouchableOpacity>
        <View style={styles.card}><Text style={styles.deadline}>📅 {application.task_deadline || 'TBD'}</Text><Text style={styles.title}>{gig.title || application.gig_title}</Text><Text style={styles.poster}>🏢 {poster?.display_name || 'Task Poster'}</Text><Text style={styles.budget}>LKR {gig.budget.toLocaleString()}</Text><Text style={styles.location}>📍 {gig.location?.address || 'Specific location pinned on map'}</Text><Text style={styles.sectionTitle}>Task Description</Text><Text style={styles.body}>{gig.description}</Text><View style={styles.skills}>{(gig.skills_required || []).map((skill) => <Text style={styles.skill} key={skill}>{skill}</Text>)}</View></View>
        <View style={styles.card}><Text style={styles.sectionTitle}>Application Status</Text><View style={[styles.status, approved ? styles.approved : styles.pending]}><Text style={approved ? styles.approvedText : styles.pendingText}>{approved ? '✓ Candidate Confirmed' : '⌛ Application Pending'}</Text></View>{!approved && <Text style={styles.muted}>The task workspace will unlock when the poster confirms your application.</Text>}</View>
        {approved && <>
          <View style={styles.card}><Text style={styles.sectionTitle}>Task Starter</Text>{taskState?.task_close ? <Text style={styles.closed}>✓ Task Completed</Text> : taskState?.task_start ? <><Text style={styles.active}>● Task Active</Text><TouchableOpacity style={styles.endButton} disabled={busy} onPress={() => void postAction('student-end', { application_id: id })}><Text style={styles.buttonText}>{busy ? 'Closing...' : 'Mark Task Complete'}</Text></TouchableOpacity></> : !taskState?.inside_location_approve ? <>{taskState?.start_code ? <><Text style={styles.body}>Enter the 4-digit code from the poster.</Text><View style={styles.codeRow}><TextInput value={startCode} onChangeText={(value) => setStartCode(value.replace(/\D/g, '').slice(0, 4))} keyboardType="number-pad" placeholder="4-digit code" style={styles.codeInput} /><TouchableOpacity style={styles.verifyButton} disabled={busy || startCode.length !== 4} onPress={() => void postAction('verify-start-code', { application_id: id, code: startCode })}><Text style={styles.buttonText}>Verify</Text></TouchableOpacity></View><TouchableOpacity style={styles.startButton} disabled={busy} onPress={() => void verifyLocationAndStart()}><Text style={styles.buttonText}>Verify Location & Start</Text></TouchableOpacity></> : <><Text style={styles.muted}>Request a start code from the poster before beginning this task.</Text><TouchableOpacity style={styles.startButton} disabled={busy} onPress={() => void postAction('initiate-start', { application_id: id })}><Text style={styles.buttonText}>{busy ? 'Requesting...' : 'Request Start Code'}</Text></TouchableOpacity></>}</> : <TouchableOpacity style={styles.startButton} disabled={busy} onPress={() => void verifyLocationAndStart()}><Text style={styles.buttonText}>{busy ? 'Starting...' : 'Verify Location & Start'}</Text></TouchableOpacity>}</View>
          <View style={styles.card}><Text style={styles.sectionTitle}>Task Location</Text><TaskMap coordinates={coords} /></View>
          <View style={styles.card}><Text style={styles.sectionTitle}>Workspace Chat</Text><ScrollView style={styles.messages}>{messages.length === 0 ? <Text style={styles.muted}>No messages yet. Say hello to get started!</Text> : messages.map((message) => <View key={message.id} style={[styles.message, message.sender_id === userId && styles.myMessage]}><Text style={styles.messageText}>{message.text}</Text><Text style={styles.time}>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text></View>)}</ScrollView><View style={styles.composer}><TextInput value={input} onChangeText={setInput} placeholder="Type your message..." multiline style={styles.messageInput} /><TouchableOpacity style={styles.sendButton} onPress={() => void sendMessage()}><Text style={styles.buttonText}>Send</Text></TouchableOpacity></View></View>
        </>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F7F5' }, loader: { flex: 1, marginTop: 50 }, container: { padding: 16, paddingBottom: 80 }, center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }, error: { color: '#DC2626', fontWeight: '700' }, back: { color: '#2F96DF', fontWeight: '700', marginBottom: 12 }, card: { backgroundColor: '#FFF', borderColor: '#E2E8F0', borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 12 }, deadline: { color: '#94A3B8', fontSize: 12, textAlign: 'right', marginBottom: 8 }, title: { color: '#0F172A', fontSize: 24, fontWeight: '800', marginBottom: 5 }, poster: { color: '#64748B', fontSize: 13, marginBottom: 12 }, budget: { color: '#007FFF', fontSize: 28, fontWeight: '900', marginBottom: 10 }, location: { color: '#475569', backgroundColor: '#F8FAFC', borderRadius: 7, padding: 9, alignSelf: 'flex-start', marginBottom: 16 }, sectionTitle: { color: '#0F172A', fontSize: 16, fontWeight: '800', marginBottom: 10 }, body: { color: '#64748B', fontSize: 14, lineHeight: 21 }, skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 14 }, skill: { backgroundColor: '#4285F4', borderRadius: 5, color: '#FFF', fontSize: 11, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 5 }, status: { alignItems: 'center', borderRadius: 8, borderWidth: 1, padding: 12 }, approved: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }, pending: { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }, approvedText: { color: '#047857', fontWeight: '800' }, pendingText: { color: '#C2410C', fontWeight: '800' }, muted: { color: '#94A3B8', fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 10 }, active: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', borderWidth: 1, borderRadius: 8, color: '#1D4ED8', fontWeight: '800', padding: 12 }, closed: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0', borderWidth: 1, borderRadius: 8, color: '#047857', fontWeight: '800', padding: 12, textAlign: 'center' }, startButton: { backgroundColor: '#007FFF', borderRadius: 8, alignItems: 'center', padding: 13, marginTop: 12 }, endButton: { backgroundColor: '#E66D22', borderRadius: 8, alignItems: 'center', padding: 13, marginTop: 12 }, buttonText: { color: '#FFF', fontWeight: '800' }, codeRow: { flexDirection: 'row', gap: 8, marginTop: 10 }, codeInput: { flex: 1, borderColor: '#CBD5E1', borderWidth: 1, borderRadius: 8, padding: 10 }, verifyButton: { backgroundColor: '#2F96DF', borderRadius: 8, justifyContent: 'center', paddingHorizontal: 18 }, map: { height: 220, borderRadius: 9 }, messages: { maxHeight: 300, backgroundColor: '#F8FAFC', borderRadius: 8, padding: 10 }, message: { alignSelf: 'flex-start', backgroundColor: '#FFF', borderColor: '#E2E8F0', borderRadius: 12, borderWidth: 1, maxWidth: '85%', padding: 10, marginBottom: 8 }, myMessage: { alignSelf: 'flex-end', borderColor: '#2F96DF' }, messageText: { color: '#1E293B', fontSize: 14 }, time: { color: '#94A3B8', fontSize: 10, marginTop: 4, textAlign: 'right' }, composer: { alignItems: 'flex-end', flexDirection: 'row', gap: 8, marginTop: 10 }, messageInput: { borderColor: '#CBD5E1', borderRadius: 8, borderWidth: 1, flex: 1, maxHeight: 100, minHeight: 46, padding: 10, textAlignVertical: 'top' }, sendButton: { backgroundColor: '#2F96DF', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 13 },
});
