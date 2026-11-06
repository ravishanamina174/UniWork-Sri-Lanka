import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useLocalSearchParams } from 'expo-router';
import { ChevronDown, ChevronUp, Edit3, Save, X } from 'lucide-react-native';
import { API_BASE } from './_layout';

type ProfessionalProfile = {
  bio: string;
  skills: string[];
  primary_location: string;
  secondary_location: string;
  working_hours: string;
  languages: string[];
  transportation: string;
};

const emptyProfessionalProfile: ProfessionalProfile = {
  bio: '',
  skills: [],
  primary_location: '',
  secondary_location: '',
  working_hours: '',
  languages: [],
  transportation: '',
};

export default function ProfileScreen() {
  const { userId } = useAuth();
  const { user } = useUser();
  const { userRole } = useLocalSearchParams<{ userRole: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [professionalProfile, setProfessionalProfile] = useState<ProfessionalProfile>(emptyProfessionalProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isProfessionalOpen, setIsProfessionalOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState({
    display_name: '',
    email: '',
    phone_number: '',
    address: '',
    bio: '',
  });

  useEffect(() => {
    if (!userId) return;
    const fetchProfiles = async () => {
      try {
        const profileResponse = await fetch(`${API_BASE}/api/v1/profiles/${userId}`);
        if (profileResponse.ok) {
          const data = await profileResponse.json();
          setProfile(data);
          setFormData({
            display_name: data.display_name || '',
            email: data.email || user?.primaryEmailAddress?.emailAddress || '',
            phone_number: data.phone_number || '',
            address: data.address || '',
            bio: data.bio || '',
          });
        }

        if (userRole === 'STUDENT_EARNER') {
          const professionalResponse = await fetch(`${API_BASE}/api/v1/student-workers/profile/${userId}`);
          if (professionalResponse.ok) {
            const data = await professionalResponse.json();
            setProfessionalProfile({
              bio: data.bio || '',
              skills: data.skills || [],
              primary_location: data.primary_location || '',
              secondary_location: data.secondary_location || '',
              working_hours: data.working_hours || '',
              languages: data.languages || [],
              transportation: data.transportation || '',
            });
          }
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        Alert.alert('Error', 'Could not load your profile.');
      } finally {
        setLoading(false);
      }
    };
    void fetchProfiles();
  }, [userId, user, userRole]);

  const handleSave = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!userId || !email) {
      Alert.alert('Error', 'User email not found. Please sign in again.');
      return;
    }

    try {
      const standardResponse = await fetch(`${API_BASE}/api/v1/profiles/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, email }),
      });

      let professionalResponseOk = true;
      if (userRole === 'STUDENT_EARNER') {
        const professionalResponse = await fetch(`${API_BASE}/api/v1/student-workers/profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_clerk_id: userId, ...professionalProfile }),
        });
        professionalResponseOk = professionalResponse.ok;
      }

      if (!standardResponse.ok || !professionalResponseOk) {
        const errorData = await standardResponse.json().catch(() => ({}));
        Alert.alert('Validation Error', errorData.detail?.[0]?.msg || 'Could not update profile.');
        return;
      }

      setProfile((previous: any) => ({ ...previous, ...formData, email }));
      setIsEditing(false);
    } catch (error) {
      console.error('Profile save error:', error);
      Alert.alert('Error', 'A network error occurred while saving.');
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && professionalProfile.skills.length < 10 && !professionalProfile.skills.includes(skill)) {
      setProfessionalProfile((previous) => ({ ...previous, skills: [...previous.skills, skill] }));
      setSkillInput('');
    }
  };

  const toggleLanguage = (language: string) => {
    setProfessionalProfile((previous) => ({
      ...previous,
      languages: previous.languages.includes(language)
        ? previous.languages.filter((item) => item !== language)
        : [...previous.languages, language],
    }));
  };

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarEmoji}>{userRole === 'STUDENT_EARNER' ? '🎓' : userRole === 'TASK_POSTER' ? '💡' : '🏢'}</Text>
          </View>
          <View style={styles.headerDetails}>
            {isEditing ? (
              <TextInput style={styles.nameInput} value={formData.display_name} onChangeText={(value) => setFormData({ ...formData, display_name: value })} placeholder="Enter your name" />
            ) : (
              <Text style={styles.nameText}>{profile?.display_name || 'Anonymous User'}</Text>
            )}
            <View style={styles.roleTag}><Text style={styles.roleTagText}>{String(userRole).replace('_', ' ')}</Text></View>
          </View>
        </View>

        <View style={styles.divider} />
        <ProfileField label="Email Address" value={user?.primaryEmailAddress?.emailAddress || formData.email} />
        <ProfileField label="Phone Number" value={formData.phone_number} editing={isEditing} onChangeText={(value) => setFormData({ ...formData, phone_number: value })} placeholder="(123) 456-7890" />
        <ProfileField label="Physical Address" value={formData.address} editing={isEditing} onChangeText={(value) => setFormData({ ...formData, address: value })} placeholder="Country, Region, City" />
        <ProfileField label="Bio / Description" value={formData.bio} editing={isEditing} onChangeText={(value) => setFormData({ ...formData, bio: value })} placeholder="How are you utilizing the platform?" multiline />

        {userRole === 'STUDENT_EARNER' && (
          <View style={styles.professionalSection}>
            <TouchableOpacity style={styles.sectionHeader} onPress={() => setIsProfessionalOpen((open) => !open)}>
              <View><Text style={styles.sectionTitle}>🧑🏻‍🔧 Professional Worker Profile</Text><Text style={styles.sectionSubtitle}>Used for Student Lookup & Matching</Text></View>
              {isProfessionalOpen ? <ChevronUp size={20} color="#37352f" /> : <ChevronDown size={20} color="#37352f" />}
            </TouchableOpacity>
            {isProfessionalOpen && (
              <View style={styles.professionalBody}>
                <Text style={styles.label}>Professional Summary</Text>
                {isEditing ? <TextInput style={[styles.input, styles.multiline]} value={professionalProfile.bio} onChangeText={(value) => setProfessionalProfile({ ...professionalProfile, bio: value })} multiline placeholder="Describe your expertise and task preferences..." /> : <Text style={styles.readOnlyText}>{professionalProfile.bio || 'No summary provided.'}</Text>}
                <Text style={styles.label}>Key Skills (up to 10)</Text>
                {isEditing && professionalProfile.skills.length < 10 && <View style={styles.skillInputRow}><TextInput style={[styles.input, styles.skillInput]} value={skillInput} onChangeText={setSkillInput} onSubmitEditing={addSkill} placeholder="Type a skill and press Enter" returnKeyType="done" /><TouchableOpacity style={styles.addButton} onPress={addSkill}><Text style={styles.addButtonText}>Add</Text></TouchableOpacity></View>}
                <View style={styles.skillsRow}>{professionalProfile.skills.map((skill) => <View key={skill} style={styles.skillBadge}><Text style={styles.skillText}>{skill}</Text>{isEditing && <TouchableOpacity onPress={() => setProfessionalProfile({ ...professionalProfile, skills: professionalProfile.skills.filter((item) => item !== skill) })}><Text style={styles.removeSkill}>×</Text></TouchableOpacity>}</View>)}</View>
                <ProfileField label="Primary Location" value={professionalProfile.primary_location} editing={isEditing} onChangeText={(value) => setProfessionalProfile({ ...professionalProfile, primary_location: value })} placeholder="e.g. Colombo 07" />
                <ProfileField label="Secondary Location" value={professionalProfile.secondary_location} editing={isEditing} onChangeText={(value) => setProfessionalProfile({ ...professionalProfile, secondary_location: value })} placeholder="e.g. Moratuwa" />
                <ProfileField label="Availability" value={professionalProfile.working_hours} editing={isEditing} onChangeText={(value) => setProfessionalProfile({ ...professionalProfile, working_hours: value })} placeholder="e.g. Weekends only" />
                <ProfileField label="Transportation" value={professionalProfile.transportation} editing={isEditing} onChangeText={(value) => setProfessionalProfile({ ...professionalProfile, transportation: value })} placeholder="e.g. Bicycle" />
                <Text style={styles.label}>Languages Spoken</Text>
                <View style={styles.languageRow}>{['Sinhala', 'Tamil', 'English'].map((language) => <TouchableOpacity key={language} disabled={!isEditing} onPress={() => toggleLanguage(language)} style={[styles.languageButton, professionalProfile.languages.includes(language) && styles.languageActive]}><Text style={professionalProfile.languages.includes(language) ? styles.languageActiveText : styles.languageText}>{language}</Text></TouchableOpacity>)}</View>
              </View>
            )}
          </View>
        )}

        <View style={styles.actionRow}>
          {isEditing ? <><TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditing(false)}><X size={16} color="#37352f" /><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity><TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Save size={16} color="#FFFFFF" /><Text style={styles.saveBtnText}>Save Changes</Text></TouchableOpacity></> : <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}><Edit3 size={16} color="#37352f" /><Text style={styles.editBtnText}>Edit Profile</Text></TouchableOpacity>}
        </View>
      </View>
    </ScrollView>
  );
}

function ProfileField({ label, value, editing = false, onChangeText, placeholder, multiline = false }: { label: string; value: string; editing?: boolean; onChangeText?: (value: string) => void; placeholder?: string; multiline?: boolean }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      {editing && onChangeText ? <TextInput style={[styles.input, multiline && styles.multiline]} value={value} onChangeText={onChangeText} placeholder={placeholder} multiline={multiline} /> : <Text style={styles.readOnlyText}>{value || 'Not provided'}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { marginTop: 50 },
  container: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#ededed' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  headerDetails: { flex: 1 },
  avatarBox: { width: 56, height: 56, borderRadius: 12, borderWidth: 1, borderColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' },
  avatarEmoji: { fontSize: 28 },
  nameText: { fontSize: 22, fontWeight: '700', color: '#37352f', marginBottom: 4 },
  nameInput: { fontSize: 22, fontWeight: '700', color: '#37352f', borderBottomWidth: 1, borderBottomColor: '#2383e2', paddingVertical: 0, marginBottom: 4 },
  roleTag: { alignSelf: 'flex-start', backgroundColor: '#f1f1ef', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  roleTagText: { fontSize: 11, fontWeight: '600', color: '#37352f' },
  divider: { height: 1, backgroundColor: '#ededed', marginBottom: 20 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#787774', marginBottom: 6 },
  readOnlyText: { fontSize: 14, color: '#37352f', backgroundColor: '#FAFAFA', padding: 12, borderRadius: 8 },
  input: { fontSize: 14, color: '#37352f', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#e0e0e0', padding: 12, borderRadius: 8 },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  professionalSection: { borderTopWidth: 1, borderTopColor: '#ededed', paddingTop: 20, marginTop: 4 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#37352f' },
  sectionSubtitle: { fontSize: 12, color: '#787774', marginTop: 3 },
  professionalBody: { backgroundColor: '#fbfbfa', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#e0e0e0' },
  skillInputRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  skillInput: { flex: 1 },
  addButton: { backgroundColor: '#2383e2', borderRadius: 8, justifyContent: 'center', paddingHorizontal: 14 },
  addButtonText: { color: '#fff', fontWeight: '700' },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  skillBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 6, paddingHorizontal: 9, paddingVertical: 6 },
  skillText: { color: '#37352f', fontSize: 12 },
  removeSkill: { color: '#d44c47', fontSize: 16 },
  languageRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  languageButton: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8 },
  languageActive: { backgroundColor: '#2383e2', borderColor: '#2383e2' },
  languageText: { color: '#37352f', fontSize: 12 },
  languageActiveText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  editBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#e0e0e0', paddingVertical: 12, borderRadius: 8 },
  editBtnText: { fontSize: 14, fontWeight: '600', color: '#37352f' },
  cancelBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#e0e0e0', paddingVertical: 12, borderRadius: 8 },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: '#37352f' },
  saveBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: '#2383e2', paddingVertical: 12, borderRadius: 8 },
  saveBtnText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
});
