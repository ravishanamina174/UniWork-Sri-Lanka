'use client';

import { useState } from 'react';
import { Edit2, Save, X, Mail, Phone, MapPin, Award, Shield } from 'lucide-react';

interface ProfileViewProps {
  userId: string;
  userRole: string;
  baseEmail: string;
  initialProfile: any | null; // Can be null if 404 from Mongo
}

export default function ProfileView({ userId, userRole, baseEmail, initialProfile }: ProfileViewProps) {
  // If initialProfile is null, we start with an empty form (ready to be saved to Mongo)
  const [profile, setProfile] = useState(initialProfile);
  
  // If they have no profile yet, immediately start them in editing mode
  const [isEditing, setIsEditing] = useState(initialProfile === null);
  
  const [formData, setFormData] = useState({
    display_name: initialProfile?.display_name || '',
    email: initialProfile?.email || baseEmail || '', // Fallback to Postgres email
    phone_number: initialProfile?.phone_number || '',
    address: initialProfile?.address || '',
    bio: initialProfile?.bio || ''
  });

  const handleSave = async () => {
    try {
      // Once clicked, this sends the data to your backend to be stored in MongoDB
      const response = await fetch(`http://127.0.0.1:8000/api/v1/profiles/${userId}`, {
        method: 'PUT', // or 'POST' depending on how your backend handles upserts
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setProfile((prev: any) => ({ ...prev, ...formData }));
        setIsEditing(false);
      } else {
        console.error("Backend rejected the profile save request.");
      }
    } catch (err) {
      console.error("Failed to commit database modifications:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Upper Brand Badge Identity Container */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 relative flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
          {userRole === 'STUDENT_EARNER' && <Award size={40} className="text-gray-400" />}
          {userRole === 'TASK_POSTER' && <Shield size={40} className="text-gray-400" />}
          {userRole === 'CORPORATE_CLIENT' && <Shield size={40} className="text-gray-400" />}
        </div>

        <div className="text-center sm:text-left space-y-2 flex-1">
          {isEditing ? (
            <input
              type="text"
              placeholder="Enter your display name"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-gray-900 px-1 py-0.5 w-full max-w-sm"
            />
          ) : (
            <h1 className="text-2xl font-bold text-gray-900">{profile?.display_name || "Anonymous User"}</h1>
          )}
          
          <div className="text-xs font-mono uppercase bg-gray-100 text-gray-600 px-2 py-1 rounded inline-block">
            {/* Safely relying on Postgres Role instead of Mongo Profile Role */}
            Role: {userRole.replace('_', ' ')}
          </div>

          {/* Dynamic Platform Counter Metrics Grid */}
          <div className="flex gap-8 justify-center sm:justify-start pt-2 border-t border-gray-100 mt-2">
            <div>
              <div className="text-xl font-bold text-gray-900">{profile?.metrics?.primary_stat || 0}</div>
              <div className="text-xs text-gray-400">{profile?.metrics?.primary_label || 'Tasks Completed'}</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{profile?.metrics?.secondary_stat || 0}</div>
              <div className="text-xs text-gray-400">{profile?.metrics?.secondary_label || 'Rating'}</div>
            </div>
          </div>
        </div>

        {/* Action Toggle Mechanics - Save only triggers handleSave */}
        <div className="absolute top-6 right-6">
          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={handleSave} className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 transition" title="Save to Database">
                <Save size={20} />
              </button>
              {profile !== null && ( // Only allow cancelling if they already have a saved profile
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition">
                  <X size={20} />
                </button>
              )}
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition">
              <Edit2 size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Primary Bio & Verification Information Layout Segment */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Core Account Specifics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email View Section */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 block font-medium">Contact Email</label>
            <div className="flex items-center gap-2 text-gray-700">
              <Mail size={16} className="text-gray-400" />
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-gray-900"
                />
              ) : (
                <span className="text-sm">{profile?.email || baseEmail}</span>
              )}
            </div>
          </div>

          {/* Phone Number View Section */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 block font-medium">Contact Number</label>
            <div className="flex items-center gap-2 text-gray-700">
              <Phone size={16} className="text-gray-400" />
              {isEditing ? (
                <input
                  type="text"
                  placeholder="+1 234 567 8900"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-gray-900"
                />
              ) : (
                <span className="text-sm">{profile?.phone_number || 'Not provided'}</span>
              )}
            </div>
          </div>

          {/* Physical Address View Section */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs text-gray-400 block font-medium">Permanent/Mailing Address</label>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin size={16} className="text-gray-400" />
              {isEditing ? (
                <input
                  type="text"
                  placeholder="Enter your full address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-gray-900"
                />
              ) : (
                <span className="text-sm">{profile?.address || 'No physical address supplied'}</span>
              )}
            </div>
          </div>

          {/* Custom Role Condition Variant Rendering Metadata Box (Only show if profile exists) */}
          {profile?.metadata && (
            <div className="space-y-1 md:col-span-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <label className="text-xs text-gray-400 block font-semibold">{profile.metadata.extra_label}</label>
              <span className="text-sm text-gray-700 font-medium">{profile.metadata.extra_value}</span>
            </div>
          )}
        </div>

        {/* Bio / Description Block Text Field Area */}
        <div className="space-y-2 pt-4 border-t border-gray-100">
          <label className="text-xs text-gray-400 block font-medium">Profile Biography</label>
          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full border border-gray-200 rounded p-2 text-sm focus:outline-none focus:border-gray-900 resize-none"
              placeholder="Tell the community about yourself..."
            />
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600 min-h-20">
              {profile?.bio || <span className="italic text-gray-400">No profile description provided yet. Click edit to add one.</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}