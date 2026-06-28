'use client';

import { useState } from 'react';
import { Save, X, Mail, Phone, MapPin, Edit3 } from 'lucide-react';

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
    bio: initialProfile?.bio || ''
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
      <div className="bg-white rounded-md sm:p-10">
        
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          
          <div className="flex items-center gap-4">
            {/* Minimalist Icon Box */}
            <div className="w-16 h-16 rounded shadow-sm border border-[#e0e0e0] flex items-center justify-center text-3xl bg-white shrink-0">
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

        <div className="w-full h-px bg-[#ededed] mb-10" /> {/* Clean Divider */}

        {/* Clean Form Grid (Inspired by the Sales Contact Form) */}
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

        {/* Minimalist Metrics Footer */}
        {profile?.metrics && (
          <>
            <div className="w-full h-px bg-[#ededed] mb-6" />
            <div className="flex gap-16">
              <div className="space-y-1">
                <div className="text-xs font-medium text-[#787774] uppercase tracking-wider">
                  {profile?.metrics?.primary_label || 'Tasks Completed'}
                </div>
                <div className="text-2xl font-semibold text-[#37352f]">
                  {profile?.metrics?.primary_stat || 0}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-medium text-[#787774] uppercase tracking-wider">
                  {profile?.metrics?.secondary_label || 'Rating'}
                </div>
                <div className="text-2xl font-semibold text-[#37352f]">
                  {profile?.metrics?.secondary_stat || 0}
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}