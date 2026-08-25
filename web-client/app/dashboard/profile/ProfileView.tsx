'use client';

import { useState } from 'react';
import { Save, X, Mail, Phone, MapPin, Edit3, ShieldAlert, MessageCircle } from 'lucide-react';

interface ProfileViewProps {
  userId: string;
  userRole: string;
  baseEmail: string;
  initialProfile: any | null; 
}

export default function ProfileView({ userId, userRole, baseEmail, initialProfile }: ProfileViewProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(initialProfile === null);

  const [formData, setFormData] = useState({
    display_name: initialProfile?.display_name || '',
    email: initialProfile?.email || baseEmail || '',
    phone_number: initialProfile?.phone_number || '',
    address: initialProfile?.address || '',
    bio: initialProfile?.bio || '',
    // New Safety Fields - Prefilled with your demo number for the university panel
    is_safety_enabled: initialProfile?.is_safety_enabled || false,
    emergency_whatsapp_number: initialProfile?.emergency_whatsapp_number || '0701470882'
  });

  const handleSave = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/profiles/${userId}`, {
        method: 'PUT',
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

  // Notion-inspired status dots
  const getRoleIndicator = (role: string) => {
    switch (role) {
      case 'STUDENT_EARNER': return 'bg-blue-500'; 
      case 'TASK_POSTER': return 'bg-green-500'; 
      case 'CORPORATE_CLIENT': return 'bg-orange-500'; 
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="w-full max-w-5xl py-10 px-20 font-sans text-[#37352f]">

      {/* Notion-style Clean Page Container */}
      <div className="bg-white rounded-md sm:p-10 shadow-sm border border-[#e0e0e0]/50">

        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            {/* Minimalist Icon Box */}
            <div className="w-16 h-16 rounded-[7px] shadow-sm border border-[#e0e0e0] flex items-center justify-center text-3xl bg-white shrink-0">
              {userRole === 'STUDENT_EARNER' ? '🎓' : userRole === 'TASK_POSTER' ? '💡' : '🏢'}
            </div>

            <div className="space-y-1">
              {isEditing ? (
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  className="text-3xl font-bold text-[#37352f] w-full bg-transparent border-b border-[#e0e0e0] focus:outline-none focus:border-[#2383e2] pb-1 placeholder:text-[#d3d3d3] transition-colors"
                />
              ) : (
                <h1 className="text-3xl font-bold text-[#37352f] tracking-tight">
                  {profile?.display_name || "Anonymous User"}
                </h1>
              )}

              {/* Notion-style Status Tag */}
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-[#f1f1ef] text-[#37352f] text-sm font-medium">
                <div className={`w-2 h-2 rounded-full ${getRoleIndicator(userRole)}`} />
                {userRole.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Notion-style Buttons */}
          <div className="flex w-full sm:w-auto gap-2">
            {isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#efefef] border border-[#e0e0e0] rounded text-[#37352f] text-sm font-medium transition-colors"
                >
                  <X size={16} /> Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#2383e2] hover:bg-[#1d6bba] rounded text-white text-sm font-medium transition-colors"
                >
                  <Save size={16} /> Save
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)} 
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#efefef] border border-[#e0e0e0] rounded text-[#37352f] text-sm font-medium transition-colors"
              >
                <Edit3 size={16} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="w-full h-px bg-[#ededed] mb-10" /> 

        {/* Clean Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#787774] flex items-center gap-2">
              <Mail size={14} /> Email Address <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                className="w-full bg-[#fbfbfa] border border-[#e0e0e0] rounded px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:border-[#2383e2] focus:bg-white transition-colors" 
              />
            ) : (
              <div className="px-3 py-2 text-sm font-medium text-[#37352f] bg-transparent border border-transparent">
                {profile?.email || baseEmail}
              </div>
            )}
          </div>

          {/* Phone Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#787774] flex items-center gap-2">
              <Phone size={14} /> Phone Number
            </label>
            {isEditing ? (
              <input 
                type="text" 
                placeholder="(123) 456-7890" 
                value={formData.phone_number} 
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} 
                className="w-full bg-[#fbfbfa] border border-[#e0e0e0] rounded px-3 py-2 text-sm text-[#37352f] placeholder:text-[#d3d3d3] focus:outline-none focus:border-[#2383e2] focus:bg-white transition-colors" 
              />
            ) : (
              <div className="px-3 py-2 text-sm font-medium text-[#37352f] bg-transparent border border-transparent">
                {profile?.phone_number || <span className="text-[#9ca3af] font-normal italic">Not provided</span>}
              </div>
            )}
          </div>

          {/* Address Input */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-[#787774] flex items-center gap-2">
              <MapPin size={14} /> Physical Address
            </label>
            {isEditing ? (
              <input 
                type="text" 
                placeholder="Country, Region, City" 
                value={formData.address} 
                onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                className="w-full bg-[#fbfbfa] border border-[#e0e0e0] rounded px-3 py-2 text-sm text-[#37352f] placeholder:text-[#d3d3d3] focus:outline-none focus:border-[#2383e2] focus:bg-white transition-colors" 
              />
            ) : (
              <div className="px-3 py-2 text-sm font-medium text-[#37352f] bg-transparent border border-transparent">
                {profile?.address || <span className="text-[#9ca3af] font-normal italic">Not provided</span>}
              </div>
            )}
          </div>

          {/* Bio Textarea */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-[#787774]">
              Provide more details (Bio)
            </label>
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full bg-[#fbfbfa] border border-[#e0e0e0] rounded px-3 py-2 text-sm text-[#37352f] placeholder:text-[#d3d3d3] focus:outline-none focus:border-[#2383e2] focus:bg-white resize-none transition-colors"
                placeholder="How are you utilizing the platform?"
              />
            ) : (
              <div className="px-3 py-2 text-sm text-[#37352f] leading-relaxed min-h-[100px] whitespace-pre-wrap">
                {profile?.bio || <span className="text-[#9ca3af] italic">No description provided.</span>}
              </div>
            )}
          </div>
        </div>

        {/* --- NEW SECURITY COMPONENT (Only for Students) --- */}
        {userRole === 'STUDENT_EARNER' && (
          <div className="mb-10 p-5 rounded-lg border border-red-100 bg-red-50/30">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-red-100 p-2 rounded text-red-600">
                <ShieldAlert size={20} />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-semibold text-[#37352f]">Emergency Location Alerts</h3>
                    <p className="text-sm text-[#787774] mt-0.5">Automatically send a WhatsApp message with your live location to a trusted contact when starting a physical task.</p>
                  </div>
                  
                  {/* Tailwind Toggle Switch */}
                  <button
                    type="button"
                    disabled={!isEditing}
                    onClick={() => setFormData({ ...formData, is_safety_enabled: !formData.is_safety_enabled })}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''} ${formData.is_safety_enabled ? 'bg-red-500' : 'bg-gray-200'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.is_safety_enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* WhatsApp Number Input (Reveals when toggled ON) */}
                {formData.is_safety_enabled && (
                  <div className="pt-2">
                    <label className="text-sm font-medium text-[#787774] flex items-center gap-2 mb-2">
                      <MessageCircle size={14} className="text-green-600" /> WhatsApp Emergency Number
                    </label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.emergency_whatsapp_number} 
                        onChange={(e) => setFormData({ ...formData, emergency_whatsapp_number: e.target.value })} 
                        className="w-full max-w-md bg-white border border-[#e0e0e0] rounded px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:border-red-400 transition-colors" 
                        placeholder="e.g. 0701470882"
                      />
                    ) : (
                      <div className="px-3 py-2 text-sm font-medium text-[#37352f] bg-white border border-[#e0e0e0] rounded max-w-md">
                        {profile?.emergency_whatsapp_number || formData.emergency_whatsapp_number}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* --- END SECURITY COMPONENT --- */}

        {/* Minimalist Metrics Footer - ONLY VISIBLE TO STUDENTS */}
        {profile?.metrics && userRole === 'STUDENT_EARNER' && (
          <>
            <div className="w-full h-px bg-[#ededed] mb-6" />
            <div className="flex gap-16">
              <div className="space-y-1">
                <div className="text-xs font-medium text-[#787774] uppercase tracking-wider">
                  {profile?.metrics?.primary_label || 'Completed Tasks'}
                </div>
                <div className="text-2xl font-semibold text-[#37352f]">
                  {profile?.metrics?.primary_stat || 0}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-medium text-[#787774] uppercase tracking-wider">
                  {profile?.metrics?.secondary_label || 'Total Earnings (LKR)'}
                </div>
                <div className="text-2xl font-semibold text-[#37352f]">
                  {profile?.metrics?.secondary_stat?.toLocaleString() || 0}
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}