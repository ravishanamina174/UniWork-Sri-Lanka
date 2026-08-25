'use client';

import { useState, useEffect, KeyboardEvent } from 'react';
import { Save, X, Edit3, Briefcase, MapPin, Clock, Globe, Bike, Check, XCircle } from 'lucide-react';

interface ProfessionalProfileProps {
  userId: string;
  userRole: string; 
  displayName?: string; // Add this
  phoneNumber?: string; // Add this
}

export default function ProfessionalProfile({ userId, userRole, displayName = '', phoneNumber = '' }: ProfessionalProfileProps) {
  // Only render for students
  if (userRole !== 'STUDENT_EARNER') return null;

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [skillInput, setSkillInput] = useState('');
  
  const [formData, setFormData] = useState({
    bio: '',
    skills: [] as string[],
    primary_location: '',
    secondary_location: '',
    working_hours: '',
    languages: [] as string[],
    transportation: '',
  });

  // Fetch existing professional profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/student-workers/profile/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            bio: data.bio || '',
            skills: data.skills || [],
            primary_location: data.primary_location || '',
            secondary_location: data.secondary_location || '',
            working_hours: data.working_hours || '',
            languages: data.languages || [],
            transportation: data.transportation || ''
          });
        }
      } catch (err) {
        console.error("Failed to load professional profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleSave = async () => {
    try {
      const payload = {
        student_clerk_id: userId,
        display_name: displayName, // Add this
        phone_number: phoneNumber, // Add this
        ...formData
      };

      const response = await fetch(`http://127.0.0.1:8000/api/v1/student-workers/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsEditing(false);
      } else {
        console.error("Failed to save professional profile.");
      }
    } catch (err) {
      console.error("API error:", err);
    }
  };

  // Helpers for Arrays
  const addSkill = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim() !== '') {
      e.preventDefault();
      if (formData.skills.length < 10 && !formData.skills.includes(skillInput.trim())) {
        setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
        setSkillInput('');
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillToRemove) });
  };

  const toggleLanguage = (lang: string) => {
    const updated = formData.languages.includes(lang)
      ? formData.languages.filter(l => l !== lang)
      : [...formData.languages, lang];
    setFormData({ ...formData, languages: updated });
  };

  const bioWordCount = formData.bio.trim().split(/\s+/).filter(w => w.length > 0).length;

  if (isLoading) return <div className="w-full max-w-5xl px-20 pt-8 text-[#787774] text-sm animate-pulse">Loading AI Matching Data...</div>;

  return (
    // Notice the pt-8 here to give it exactly the spacing you asked for
    <div className="w-full max-w-5xl px-20 pt-8 pb-10 font-sans text-[#37352f]">
      
      {/* Notion-style Clean Page Container (Matches your current UI exactly) */}
      <div className="bg-white rounded-md sm:p-10 shadow-sm border border-[#e0e0e0]/50">
        
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            {/* Minimalist Icon Box */}
            <div className="w-16 h-16 rounded-[7px] shadow-sm border border-[#e0e0e0] flex items-center justify-center text-3xl bg-white shrink-0">
              🧑🏻‍🔧
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#37352f] tracking-tight">Professional Worker Profile</h2>
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-[#f1f1ef] text-[#787774] text-sm font-medium">
                Used for Student Lookup
              </div>
            </div>
          </div>

          {/* Notion-style Buttons */}
          <div className="flex w-full sm:w-auto gap-2">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#efefef] border border-[#e0e0e0] rounded text-[#37352f] text-sm font-medium transition-colors">
                  <X size={16} /> Cancel
                </button>
                <button onClick={handleSave} disabled={bioWordCount > 300} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#2383e2] hover:bg-[#1d6bba] disabled:opacity-50 disabled:hover:bg-[#2383e2] rounded text-white text-sm font-medium transition-colors">
                  <Save size={16} /> Save
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#efefef] border border-[#e0e0e0] rounded text-[#37352f] text-sm font-medium transition-colors">
                <Edit3 size={16} /> Edit Data
              </button>
            )}
          </div>
        </div>

        <div className="w-full h-px bg-[#ededed] mb-10" /> 

        {/* Clean Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          {/* Professional Bio */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-[#787774]">Professional Summary</label>
              <span className={`text-xs ${bioWordCount > 300 ? 'text-red-500 font-bold' : 'text-[#d3d3d3]'}`}>
                {bioWordCount} / 300 words
              </span>
            </div>
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full bg-[#fbfbfa] border border-[#e0e0e0] rounded px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:border-[#2383e2] focus:bg-white transition-colors resize-none placeholder:text-[#d3d3d3]"
                placeholder="Describe your expertise, tools you own (e.g., laptop, camera), and task preferences..."
              />
            ) : (
              <div className="px-3 py-2 text-sm text-[#37352f] leading-relaxed min-h-[100px] whitespace-pre-wrap">
                {formData.bio || <span className="text-[#9ca3af] italic">No summary provided.</span>}
              </div>
            )}
          </div>

          {/* Skills Array */}
          <div className="space-y-2 md:col-span-2 border-b border-[#ededed] pb-8">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-[#787774]">Key Skills</label>
              <span className="text-xs text-[#d3d3d3]">{formData.skills.length} / 10 max</span>
            </div>
            {isEditing && formData.skills.length < 10 && (
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
                placeholder="Type a skill and press Enter..."
                className="w-full bg-[#fbfbfa] border border-[#e0e0e0] rounded px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:border-[#2383e2] focus:bg-white transition-colors mb-2 placeholder:text-[#d3d3d3]"
              />
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#f1f1ef] text-[#37352f] text-xs font-medium border border-[#e0e0e0]">
                  {skill}
                  {isEditing && <XCircle size={12} className="cursor-pointer text-[#787774] hover:text-red-500" onClick={() => removeSkill(skill)} />}
                </span>
              ))}
              {formData.skills.length === 0 && !isEditing && <span className="text-[#9ca3af] text-sm italic px-3 font-normal">No skills added.</span>}
            </div>
          </div>

          {/* Primary Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#787774] flex items-center gap-2">
              <MapPin size={14} /> Primary Location
            </label>
            {isEditing ? (
              <input type="text" value={formData.primary_location} onChange={(e) => setFormData({ ...formData, primary_location: e.target.value })} placeholder="e.g. Colombo 07" className="w-full bg-[#fbfbfa] border border-[#e0e0e0] rounded px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:border-[#2383e2] focus:bg-white placeholder:text-[#d3d3d3]" />
            ) : (
              <div className="px-3 py-2 text-sm font-medium text-[#37352f] bg-transparent">{formData.primary_location || '-'}</div>
            )}
          </div>

          {/* Secondary Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#787774] flex items-center gap-2">
              <MapPin size={14} /> Secondary Location
            </label>
            {isEditing ? (
              <input type="text" value={formData.secondary_location} onChange={(e) => setFormData({ ...formData, secondary_location: e.target.value })} placeholder="e.g. Moratuwa" className="w-full bg-[#fbfbfa] border border-[#e0e0e0] rounded px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:border-[#2383e2] focus:bg-white placeholder:text-[#d3d3d3]" />
            ) : (
              <div className="px-3 py-2 text-sm font-medium text-[#37352f] bg-transparent">{formData.secondary_location || '-'}</div>
            )}
          </div>

          {/* Working Hours */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#787774] flex items-center gap-2">
              <Clock size={14} /> Availability
            </label>
            {isEditing ? (
              <select value={formData.working_hours} onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })} className="w-full bg-[#fbfbfa] border border-[#e0e0e0] rounded px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:border-[#2383e2] focus:bg-white">
                <option value="">Select availability...</option>
                <option value="Everyday">Everyday</option>
                <option value="Every weekday">Every weekday</option>
                <option value="Weekends only">Weekends only</option>
                <option value="After 5 PM">After 5 PM</option>
                <option value="Full-time during holidays">Full-time during holidays</option>
              </select>
            ) : (
              <div className="px-3 py-2 text-sm font-medium text-[#37352f] bg-transparent">{formData.working_hours || '-'}</div>
            )}
          </div>

          {/* Transportation */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#787774] flex items-center gap-2">
              <Bike size={14} /> Transportation
            </label>
            {isEditing ? (
              <select value={formData.transportation} onChange={(e) => setFormData({ ...formData, transportation: e.target.value })} className="w-full bg-[#fbfbfa] border border-[#e0e0e0] rounded px-3 py-2 text-sm text-[#37352f] focus:outline-none focus:border-[#2383e2] focus:bg-white">
                <option value="">Select mode...</option>
                <option value="Motorbike">Motorbike</option>
                <option value="Public Transit Only">Public Transit Only</option>
                <option value="Bicycle">Bicycle</option>
                <option value="Car / Van">Car / Van</option>
              </select>
            ) : (
              <div className="px-3 py-2 text-sm font-medium text-[#37352f] bg-transparent">{formData.transportation || '-'}</div>
            )}
          </div>

        {/* Languages */}
        <div className="space-y-2 md:col-span-2 mt-4">
            <label className="text-sm font-medium text-[#787774] flex items-center gap-2 mb-3">
              <Globe size={14} /> Languages Spoken
            </label>
            <div className="flex gap-4">
              {['Sinhala', 'Tamil', 'English'].map(lang => {
                const isActive = formData.languages.includes(lang);
                return isEditing ? (
                  <button 
                    type="button" 
                    key={lang} 
                    onClick={() => toggleLanguage(lang)} 
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 ${isActive ? 'bg-[#2383e2]/10 border-[#2383e2] text-[#2383e2]' : 'bg-white border-[#e0e0e0] text-[#787774] hover:bg-[#fbfbfa]'}`}
                  >
                    {isActive && <Check size={12} />} {lang}
                  </button>
                ) : (
                  isActive && <span key={lang} className="px-3 py-1 bg-[#f1f1ef] rounded text-[#37352f] text-xs font-medium border border-[#e0e0e0]">{lang}</span>
                );
              })}
              {!isEditing && formData.languages.length === 0 && <span className="text-[#9ca3af] text-sm italic px-3 font-normal">No languages specified.</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}