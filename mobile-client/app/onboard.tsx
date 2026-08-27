import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Send } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { API_BASE_URL, setAuthProfileCache } from '../constants/api';

type Role = 'STUDENT' | 'POSTER' | 'CORPORATE';

export default function OnboardScreen() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [role, setRole] = useState<Role>('STUDENT');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  const [formData, setFormData] = useState({
    phone_number: '',
    nic: '',
    encrypted_uni_id: '',
    faculty: '',
    university_campus: '',
    academic_department: '',
    business_name: '',
    registration_number: '',
  });

  useEffect(() => {
    async function checkExistingUser() {
      if (!isLoaded || !user) return;

      try {
        const res = await fetch(`${API_BASE_URL}/auth/user/clerk/${user.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
          setAuthProfileCache(true);
          router.replace('/');
        } else {
          setIsCheckingUser(false);
        }
      } catch (err) {
        console.error('Error checking user existence:', err);
        setIsCheckingUser(false);
      }
    }

    void checkExistingUser();
  }, [user, isLoaded, router]);

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
    } else {
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
        setAuthProfileCache(true);
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

  if (!isLoaded || isCheckingUser) {
    return (
      <View style={styles.verifyingContainer}>
        <View style={styles.verifyingCard}>
          <Text style={styles.verifyingText}>Verifying security profile initialization...</Text>
        </View>
        <Text style={styles.watermark}>UNIWORK</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.illustration}>
              <Image
                source={require('@/assets/images/grass.jpg')}
                style={styles.illustrationImage}
                resizeMode="cover"
              />
            </View>

            <View style={styles.formPane}>
              <Text style={styles.title}>Complete Your Profile</Text>
              <Text style={styles.subtitle}>Please select your primary role profile configuration.</Text>

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

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0771234567"
                  placeholderTextColor="#c6c6c6"
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
                    placeholderTextColor="#c6c6c6"
                    value={formData.nic}
                    onChangeText={(val) => handleInputChange('nic', val)}
                  />
                </View>
              )}

              {role === 'STUDENT' && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>University</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="University of Moratuwa"
                      placeholderTextColor="#c6c6c6"
                      value={formData.university_campus}
                      onChangeText={(val) => handleInputChange('university_campus', val)}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Student ID</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="200123A"
                      placeholderTextColor="#c6c6c6"
                      value={formData.encrypted_uni_id}
                      onChangeText={(val) => handleInputChange('encrypted_uni_id', val)}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Faculty</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Engineering"
                      placeholderTextColor="#c6c6c6"
                      value={formData.faculty}
                      onChangeText={(val) => handleInputChange('faculty', val)}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Department</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Computer Science"
                      placeholderTextColor="#c6c6c6"
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
                      placeholderTextColor="#c6c6c6"
                      value={formData.business_name}
                      onChangeText={(val) => handleInputChange('business_name', val)}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Registration Number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="PV123456"
                      placeholderTextColor="#c6c6c6"
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
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <Text style={styles.submitButtonText}>Saving Profile...</Text>
                ) : (
                  <View style={styles.submitInner}>
                    <Text style={styles.submitButtonText}>Complete Registration</Text>
                    <Send size={16} color="#28292b" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#f4f1ee' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  verifyingContainer: {
    flex: 1,
    backgroundColor: '#f4f1ee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyingCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 18,
    zIndex: 10,
  },
  verifyingText: {
    color: '#1b1b1b',
    fontWeight: '500',
    fontSize: 14,
  },
  watermark: {
    marginTop: 8,
    fontSize: 64,
    fontWeight: '900',
    color: '#0f172a',
    opacity: 0.03,
    letterSpacing: -2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  illustration: {
    height: 180,
    backgroundColor: '#f8fafc',
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  formPane: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8185',
    fontWeight: '300',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(241, 245, 249, 0.7)',
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  roleButtonActive: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  roleTextActive: {
    color: '#337d28',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
    textTransform: 'uppercase',
    marginBottom: 6,
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#262626',
  },
  submitButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#afb2b6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#28292b',
    fontSize: 14,
    fontWeight: '600',
  },
});
