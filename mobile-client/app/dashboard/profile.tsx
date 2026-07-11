import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useLocalSearchParams } from 'expo-router';
import { Save, X, Edit3 } from 'lucide-react-native';
import { API_BASE } from './_layout';

export default function ProfileScreen() {
  const { userId } = useAuth();
  const { user } = useUser();
  const { userRole } = useLocalSearchParams();
  
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
const [formData, setFormData] = useState({
    display_name: '',
    email: '', // Add this back
    phone_number: '',
    address: '',
    bio: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/profiles/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setFormData({
            display_name: data.display_name || '',
            email: data.email || user?.primaryEmailAddress?.emailAddress || '', // Add this back
            phone_number: data.phone_number || '',
            address: data.address || '',
            bio: data.bio || ''
          });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId, user]); // Add user to dependency array if you use it here

const handleSave = async () => {
    try {
      // 1. Grab the definitive email from Clerk at the moment of saving
      const currentEmail = user?.primaryEmailAddress?.emailAddress;

      if (!currentEmail) {
        Alert.alert("Error", "User email not found. Please try logging in again.");
        return;
      }

      // 2. Combine the form state with the strict email requirement
      const payload = {
        ...formData,
        email: currentEmail
      };

      const res = await fetch(`${API_BASE}/api/v1/profiles/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), // Send the combined payload
      });
      
      if (res.ok) {
        setProfile((prev: any) => ({ ...prev, ...formData, email: currentEmail }));
        setIsEditing(false);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Backend rejected save:", errorData);
        
        // Extract a readable message from Pydantic's error array if possible
        const errorMessage = errorData.detail?.[0]?.msg || "Could not update profile.";
        Alert.alert("Validation Error", errorMessage);
      }
    } catch (err) {
      console.error("Network or parsing error:", err);
      Alert.alert("Error", "A network error occurred while saving.");
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        
        {/* Header Area */}
        <View style={styles.headerRow}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarEmoji}>
              {userRole === 'STUDENT_EARNER' ? '🎓' : userRole === 'TASK_POSTER' ? '💡' : '🏢'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            {isEditing ? (
              <TextInput 
                style={styles.nameInput}
                value={formData.display_name}
                onChangeText={(t) => setFormData({...formData, display_name: t})}
                placeholder="Enter your name"
              />
            ) : (
              <Text style={styles.nameText}>{profile?.display_name || "Anonymous User"}</Text>
            )}
            <View style={styles.roleTag}>
              <Text style={styles.roleTagText}>{String(userRole).replace('_', ' ')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Fields */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email Address (Read Only)</Text>
          <Text style={styles.readOnlyText}>{user?.primaryEmailAddress?.emailAddress}</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Phone Number</Text>
          {isEditing ? (
            <TextInput style={styles.input} value={formData.phone_number} onChangeText={(t) => setFormData({...formData, phone_number: t})} placeholder="(123) 456-7890" />
          ) : (
            <Text style={styles.readOnlyText}>{profile?.phone_number || "Not provided"}</Text>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Bio</Text>
          {isEditing ? (
            <TextInput style={[styles.input, { height: 80 }]} value={formData.bio} onChangeText={(t) => setFormData({...formData, bio: t})} placeholder="Tell us about yourself" multiline />
          ) : (
            <Text style={styles.readOnlyText}>{profile?.bio || "No description provided."}</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          {isEditing ? (
            <>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditing(false)}>
                <X size={16} color="#37352f" /><Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Save size={16} color="#FFFFFF" /><Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
              <Edit3 size={16} color="#37352f" /><Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#ededed' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  avatarBox: { width: 56, height: 56, borderRadius: 12, borderWidth: 1, borderColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' },
  avatarEmoji: { fontSize: 28 },
  nameText: { fontSize: 22, fontWeight: '700', color: '#37352f', marginBottom: 4 },
  nameInput: { fontSize: 22, fontWeight: '700', color: '#37352f', borderBottomWidth: 1, borderBottomColor: '#2383e2', paddingVertical: 0, marginBottom: 4 },
  roleTag: { alignSelf: 'flex-start', backgroundColor: '#f1f1ef', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  roleTagText: { fontSize: 11, fontWeight: '600', color: '#37352f' },
  divider: { height: 1, backgroundColor: '#ededed', marginBottom: 20 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#787774', marginBottom: 6 },
  readOnlyText: { fontSize: 14, color: '#37352f', backgroundColor: '#FAFAFA', padding: 12, borderRadius: 8, overflow: 'hidden' },
  input: { fontSize: 14, color: '#37352f', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#e0e0e0', padding: 12, borderRadius: 8 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  editBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#e0e0e0', paddingVertical: 12, borderRadius: 8 },
  editBtnText: { fontSize: 14, fontWeight: '600', color: '#37352f' },
  cancelBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#e0e0e0', paddingVertical: 12, borderRadius: 8 },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: '#37352f' },
  saveBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: '#2383e2', paddingVertical: 12, borderRadius: 8 },
  saveBtnText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
});