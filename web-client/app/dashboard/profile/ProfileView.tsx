'use client';
import { API_BASE_URL } from "@/lib/api";
import { useState, KeyboardEvent } from 'react';
import { 
  Save, X, Mail, Phone, MapPin, Edit3, ShieldAlert, 
  Briefcase, Clock, Bike, Globe, Check, XCircle, ChevronDown, ChevronUp 
} from 'lucide-react';

interface ProfileViewProps {
  userId: string;
  userRole: string;
  baseEmail: string;
  initialProfile: any | null;
  initialProfessionalProfile: any | null;
}

export default function ProfileView({ 
  userId, 
  userRole, 
  baseEmail, 
  initialProfile, 
  initialProfessionalProfile 
}: ProfileViewProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [profProfile, setProfProfile] = useState(initialProfessionalProfile);
  
  const [isEditing, setIsEditing] = useState(initialProfile === null);
  const [isProfSectionOpen, setIsProfSectionOpen] = useState(true);
  const [skillInput, setSkillInput] = useState('');

  // Standard Profile Form State
  const [formData, setFormData] = useState({
    display_name: initialProfile?.display_name || '',
    email: initialProfile?.email || baseEmail || '',
    phone_number: initialProfile?.phone_number || '',
    address: initialProfile?.address || '',
    bio: initialProfile?.bio || '',
    is_safety_enabled: initialProfile?.is_safety_enabled || false,
    emergency_whatsapp_number: initialProfile?.emergency_whatsapp_number || '0701470882'
  });

  // Professional Worker Profile Form State
  const [profFormData, setProfFormData] = useState({
    bio: initialProfessionalProfile?.bio || '',
    skills: initialProfessionalProfile?.skills || [] as string[],
    primary_location: initialProfessionalProfile?.primary_location || '',
    secondary_location: initialProfessionalProfile?.secondary_location || '',
    working_hours: initialProfessionalProfile?.working_hours || '',
    languages: initialProfessionalProfile?.languages || [] as string[],
    transportation: initialProfessionalProfile?.transportation || '',
  });

  // Save both standard profile and professional profile
  const handleSave = async () => {
    try {
      // 1. Save Standard Profile
      const standardRes = await fetch(`${API_BASE_URL}/api/v1/profiles/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // 2. Save Professional Profile if Student Earner
      let profResOk = true;
      if (userRole === 'STUDENT_EARNER') {
        const profPayload = {
          student_clerk_id: userId,
          ...profFormData
        };
        const profRes = await fetch(`${API_BASE_URL}/api/v1/student-workers/profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profPayload),
        });
        profResOk = profRes.ok;
      }

      if (standardRes.ok && profResOk) {
        setProfile((prev: any) => ({ ...prev, ...formData }));
        setProfProfile((prev: any) => ({ ...prev, ...profFormData }));
        setIsEditing(false);
      } else {
        console.error("Backend rejected one or more profile save requests.");
      }
    } catch (err) {
      console.error("Failed to commit database modifications:", err);
    }
  };

  // Skill Helpers
  const addSkill = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim() !== '') {
      e.preventDefault();
      if (profFormData.skills.length < 10 && !profFormData.skills.includes(skillInput.trim())) {
        setProfFormData({ ...profFormData, skills: [...profFormData.skills, skillInput.trim()] });
        setSkillInput('');
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfFormData({ ...profFormData, skills: profFormData.skills.filter((s: string) => s !== skillToRemove) });
  };

  const toggleLanguage = (lang: string) => {
    const updated = profFormData.languages.includes(lang)
      ? profFormData.languages.filter((l: string) => l !== lang)
      : [...profFormData.languages, lang];
    setProfFormData({ ...profFormData, languages: updated });
  };

const bioWordCount = profFormData.bio.trim().split(/\s+/).filter((w: string) => w.length > 0).length;

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
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

              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-[#f1f1ef] text-[#37352f] text-sm font-medium">
                <div className={`w-2 h-2 rounded-full ${getRoleIndicator(userRole)}`} />
                {userRole.replace('_', ' ')}
              </div>
            </div>
          </div>

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
                  disabled={userRole === 'STUDENT_EARNER' && bioWordCount > 300}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#2383e2] hover:bg-[#1d6bba] disabled:opacity-50 rounded text-white text-sm font-medium transition-colors"
                >
                  <Save size={16} /> Save Changes
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

        <div className="w-full h-px bg-[#ededed] mb-8" /> 

        {/* --- SECTION 1: Standard Account Information --- */}
        <div className="space-y-6 mb-8">
          <h2 className="text-lg font-semibold text-[#37352f] flex items-center gap-2">
            👤 Account Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
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
                <div className="px-3 py-2 text-sm font-medium text-[#37352f]">
                  {profile?.email || baseEmail}
                </div>
              )}
            </div>

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
                  className="w-full bg-[#fbfbfa] border border-[#e0e0e0] rounded px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:border-[#2383e2] focus:bg-white transition-colors" 
                />
              ) : (
                <div className="px-3 py-2 text-sm font-medium text-[#37352f]">
                  {profile?.phone_number || <span className="text-[#9ca3af] font-normal italic">Not provided</span>}
                </div>
              )}
            </div>

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
                  className="w-full bg-[#fbfbfa] border border-[#e0e0e0] rounded px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:border-[#2383e2] focus:bg-white transition-colors" 
                />
              ) : (
                <div className="px-3 py-2 text-sm font-medium text-[#37352f]">
                  {profile?.address || <span className="text-[#9ca3af] font-normal italic">Not provided</span>}
                </div>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-[#787774]">Bio / Description</label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full bg-[#fbfbfa] border border-[#e0e0e0] rounded px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:border-[#2383e2] focus:bg-white resize-none transition-colors"
                  placeholder="How are you utilizing the platform?"
                />
              ) : (
                <div className="px-3 py-2 text-sm text-[#37352f] leading-relaxed whitespace-pre-wrap">
                  {profile?.bio || <span className="text-[#9ca3af] italic">No description provided.</span>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- SAFETY COMPONENT (Only for Students) --- */}
        {userRole === 'STUDENT_EARNER' && (
          <div className="mb-8 p-5 rounded-lg border border-red-100 bg-red-50/30">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-red-100 p-2 rounded text-red-600">
                <ShieldAlert size={20} />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-semibold text-[#37352f]">Emergency Location Alerts</h3>
                    <p className="text-sm text-[#787774] mt-0.5">Automatically send a WhatsApp message with your live location when starting a physical task.</p>
                  </div>
                  
                  <button
                    type="button"
                    disabled={!isEditing}
                    onClick={() => setFormData({ ...formData, is_safety_enabled: !formData.is_safety_enabled })}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''} ${formData.is_safety_enabled ? 'bg-red-500' : 'bg-gray-200'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.is_safety_enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {formData.is_safety_enabled && (
                  <div className="pt-2">
                    <label className="text-sm font-medium text-[#787774] flex items-center gap-2 mb-2">
                      WhatsApp Emergency Number
                    </label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={formData.emergency_whatsapp_number} 
                        onChange={(e) => setFormData({ ...formData, emergency_whatsapp_number: e.target.value })} 
                        className="w-full bg-white border border-[#e0e0e0] rounded px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:border-red-400 transition-colors" 
                        placeholder="e.g. 0701470882"
                      />
                    ) : (
                      <div className="px-3 py-2 text-sm font-medium text-[#37352f] bg-white border border-[#e0e0e0] rounded">
                        {formData.emergency_whatsapp_number}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- SECTION 2: Professional Worker Profile (STUDENT_EARNER Only with Hiding/Showing Toggle) --- */}
        {userRole === 'STUDENT_EARNER' && (
          <div className="border-t border-[#ededed] pt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧑🏻‍🔧</span>
                <div>
                  <h2 className="text-lg font-semibold text-[#37352f] tracking-tight">Professional Worker Profile</h2>
                  <p className="text-xs text-[#787774]">Used for Student Lookup & Matching</p>
                </div>
              </div>

              {/* Show / Hide Toggle Button */}
              <button
                type="button"
                onClick={() => setIsProfSectionOpen(!isProfSectionOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f1f1ef] hover:bg-[#e4e4e1] text-[#37352f] rounded text-xs font-medium transition-colors"
              >
                {isProfSectionOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {isProfSectionOpen ? "Hide Professional Area" : "Show Professional Area"}
              </button>
            </div>

            {isProfSectionOpen && (
              <div className="bg-[#fbfbfa] p-6 rounded-md border border-[#e0e0e0]/70 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-4">
                
                {/* Professional Bio */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-medium text-[#787774]">Professional Summary</label>
                    <span className={`text-xs ${bioWordCount > 300 ? 'text-red-500 font-bold' : 'text-[#9ca3af]'}`}>
                      {bioWordCount} / 300 words
                    </span>
                  </div>
                  {isEditing ? (
                    <textarea
                      value={profFormData.bio}
                      onChange={(e) => setProfFormData({ ...profFormData, bio: e.target.value })}
                      rows={3}
                      className="w-full bg-white border border-[#e0e0e0] rounded px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:border-[#2383e2] resize-none"
                      placeholder="Describe your expertise, equipment (laptop, camera), and task preferences..."
                    />
                  ) : (
                    <div className="px-3 py-2 text-sm text-[#37352f] leading-relaxed whitespace-pre-wrap bg-white border border-[#e0e0e0]/50 rounded">
                      {profFormData.bio || <span className="text-[#9ca3af] italic">No summary provided.</span>}
                    </div>
                  )}
                </div>

                {/* Skills */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-medium text-[#787774]">Key Skills</label>
                    <span className="text-xs text-[#9ca3af]">{profFormData.skills.length} / 10 max</span>
                  </div>
                  {isEditing && profFormData.skills.length < 10 && (
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={addSkill}
                      placeholder="Type a skill and press Enter..."
                      className="w-full bg-white border border-[#e0e0e0] rounded px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:border-[#2383e2] mb-2"
                    />
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profFormData.skills.map((skill: string) => (
                      <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white text-[#37352f] text-xs font-medium border border-[#e0e0e0]">
                        {skill}
                        {isEditing && <XCircle size={12} className="cursor-pointer text-[#787774] hover:text-red-500" onClick={() => removeSkill(skill)} />}
                      </span>
                    ))}
                    {profFormData.skills.length === 0 && <span className="text-[#9ca3af] text-sm italic">No skills added.</span>}
                  </div>
                </div>

                {/* Primary Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#787774] flex items-center gap-2">
                    <MapPin size={14} /> Primary Location
                  </label>
                  {isEditing ? (
                    <input type="text" value={profFormData.primary_location} onChange={(e) => setProfFormData({ ...profFormData, primary_location: e.target.value })} placeholder="e.g. Colombo 07" className="w-full bg-white border border-[#e0e0e0] rounded px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:border-[#2383e2]" />
                  ) : (
                    <div className="px-3 py-2 text-sm font-medium text-[#37352f] bg-white border border-[#e0e0e0]/50 rounded">{profFormData.primary_location || '-'}</div>
                  )}
                </div>

                {/* Secondary Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#787774] flex items-center gap-2">
                    <MapPin size={14} /> Secondary Location
                  </label>
                  {isEditing ? (
                    <input type="text" value={profFormData.secondary_location} onChange={(e) => setProfFormData({ ...profFormData, secondary_location: e.target.value })} placeholder="e.g. Moratuwa" className="w-full bg-white border border-[#e0e0e0] rounded px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:border-[#2383e2]" />
                  ) : (
                    <div className="px-3 py-2 text-sm font-medium text-[#37352f] bg-white border border-[#e0e0e0]/50 rounded">{profFormData.secondary_location || '-'}</div>
                  )}
                </div>

                {/* Availability */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#787774] flex items-center gap-2">
                    <Clock size={14} /> Availability
                  </label>
                  {isEditing ? (
                    <select value={profFormData.working_hours} onChange={(e) => setProfFormData({ ...profFormData, working_hours: e.target.value })} className="w-full bg-white border border-[#e0e0e0] rounded px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:border-[#2383e2]">
                      <option value="">Select availability...</option>
                      <option value="Everyday">Everyday</option>
                      <option value="Every weekday">Every weekday</option>
                      <option value="Weekends only">Weekends only</option>
                      <option value="After 5 PM">After 5 PM</option>
                      <option value="Full-time during holidays">Full-time during holidays</option>
                    </select>
                  ) : (
                    <div className="px-3 py-2 text-sm font-medium text-[#37352f] bg-white border border-[#e0e0e0]/50 rounded">{profFormData.working_hours || '-'}</div>
                  )}
                </div>

                {/* Transportation */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#787774] flex items-center gap-2">
                    <Bike size={14} /> Transportation
                  </label>
                  {isEditing ? (
                    <select value={profFormData.transportation} onChange={(e) => setProfFormData({ ...profFormData, transportation: e.target.value })} className="w-full bg-white border border-[#e0e0e0] rounded px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:border-[#2383e2]">
                      <option value="">Select mode...</option>
                      <option value="Motorbike">Motorbike</option>
                      <option value="Public Transit Only">Public Transit Only</option>
                      <option value="Bicycle">Bicycle</option>
                      <option value="Car / Van">Car / Van</option>
                    </select>
                  ) : (
                    <div className="px-3 py-2 text-sm font-medium text-[#37352f] bg-white border border-[#e0e0e0]/50 rounded">{profFormData.transportation || '-'}</div>
                  )}
                </div>

                {/* Languages */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-[#787774] flex items-center gap-2 mb-2">
                    <Globe size={14} /> Languages Spoken
                  </label>
                  <div className="flex gap-3">
                    {['Sinhala', 'Tamil', 'English'].map((lang: string) => {
                      const isActive = profFormData.languages.includes(lang);
                      return isEditing ? (
                        <button 
                          type="button" 
                          key={lang} 
                          onClick={() => toggleLanguage(lang)} 
                          className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 ${isActive ? 'bg-[#2383e2]/10 border-[#2383e2] text-[#2383e2]' : 'bg-white border-[#e0e0e0] text-[#787774]'}`}
                        >
                          {isActive && <Check size={12} />} {lang}
                        </button>
                      ) : (
                        isActive && <span key={lang} className="px-3 py-1 bg-white rounded text-[#37352f] text-xs font-medium border border-[#e0e0e0]">{lang}</span>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}