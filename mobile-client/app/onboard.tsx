import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../constants/api'; 

type Role = 'STUDENT' | 'POSTER' | 'CORPORATE';

export default function OnboardScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [role, setRole] = useState<Role>('STUDENT');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    phone_number: '',
    nic: '',
    encrypted_uni_id: '',
    faculty: '',
    university_campus: 'University of Moratuwa',
    academic_department: '',
    business_name: '',
    registration_number: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsLoading(true);

    const basePayload = {
      clerk_id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      phone_number: formData.phone_number,
      display_name: user.fullName || 'User',
    };

    let endpoint = '';
    let finalPayload = {};

    if (role === 'STUDENT') {
      endpoint = '/register/student';
      finalPayload = {
        ...basePayload,
        encrypted_uni_id: formData.encrypted_uni_id,
        faculty: formData.faculty,
        nic: formData.nic,
        university_campus: formData.university_campus,
        academic_department: formData.academic_department,
        skill_tags: [],
      };
    } else if (role === 'POSTER') {
      endpoint = '/register/poster';
      finalPayload = { ...basePayload, nic: formData.nic };
    } else if (role === 'CORPORATE') {
      endpoint = '/register/corporate';
      finalPayload = {
        ...basePayload,
        business_name: formData.business_name,
        registration_number: formData.registration_number,
      };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      });

      if (res.ok) {
        router.replace('/');
      } else {
        const errorData = await res.json();
        Alert.alert('Error', errorData.detail || 'Failed to complete registration.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      Alert.alert('Network Error', 'Could not connect to the backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Complete Profile</Text>
          <Text style={styles.subtitle}>Select your primary role configuration.</Text>
        </View>

        {/* Role Selector */}
        <View style={styles.roleContainer}>
          {(['STUDENT', 'POSTER', 'CORPORATE'] as Role[]).map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.roleButton, role === r && styles.roleButtonActive]}
              onPress={() => setRole(r)}
            >
              <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                {r.charAt(0) + r.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dynamic Form Fields */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="0771234567"
            placeholderTextColor="#94a3b8"
            keyboardType="phone-pad"
            value={formData.phone_number}
            onChangeText={(val) => handleInputChange('phone_number', val)}
          />
        </View>

        {(role === 'STUDENT' || role === 'POSTER') && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>National ID (NIC)</Text>
            <TextInput
              style={styles.input}
              placeholder="200012345678"
              placeholderTextColor="#94a3b8"
              value={formData.nic}
              onChangeText={(val) => handleInputChange('nic', val)}
            />
          </View>
        )}

        {role === 'STUDENT' && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Student ID</Text>
              <TextInput
                style={styles.input}
                placeholder="200123A"
                placeholderTextColor="#94a3b8"
                value={formData.encrypted_uni_id}
                onChangeText={(val) => handleInputChange('encrypted_uni_id', val)}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Faculty</Text>
              <TextInput
                style={styles.input}
                placeholder="Engineering"
                placeholderTextColor="#94a3b8"
                value={formData.faculty}
                onChangeText={(val) => handleInputChange('faculty', val)}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Department</Text>
              <TextInput
                style={styles.input}
                placeholder="Computer Science"
                placeholderTextColor="#94a3b8"
                value={formData.academic_department}
                onChangeText={(val) => handleInputChange('academic_department', val)}
              />
            </View>
          </>
        )}

        {role === 'CORPORATE' && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Business Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Acme Corp"
                placeholderTextColor="#94a3b8"
                value={formData.business_name}
                onChangeText={(val) => handleInputChange('business_name', val)}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Registration Number</Text>
              <TextInput
                style={styles.input}
                placeholder="PV123456"
                placeholderTextColor="#94a3b8"
                value={formData.registration_number}
                onChangeText={(val) => handleInputChange('registration_number', val)}
              />
            </View>
          </>
        )}

        <TouchableOpacity 
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Complete Registration</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { padding: 24, paddingTop: 60, paddingBottom: 60 },
  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 8 },
  
  roleContainer: { flexDirection: 'row', backgroundColor: '#e2e8f0', padding: 4, borderRadius: 12, marginBottom: 24 },
  roleButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  roleButtonActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  roleText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  roleTextActive: { color: '#ea580c' },
  
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.5 },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 14, fontSize: 15, color: '#0f172a' },
  
  submitButton: { backgroundColor: '#0f172a', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' }
});