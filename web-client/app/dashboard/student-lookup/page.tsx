'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  MapPin, 
  Clock, 
  Bike, 
  Languages, 
  CheckCircle2, 
  Briefcase,
  AlertCircle,
  Loader2,
  Award
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface AgentMatch {
  student_clerk_id: string;
  fit_score: number;
  match_reason: string;
}

interface HydratedStudent {
  clerk_id: string;
  fit_score: number;
  match_reason: string;
  display_name: string;
  bio: string;
  skills: string[];
  primary_location: string;
  secondary_location?: string;
  working_hours: string;
  transportation: string;
  languages: string[];
  completed_tasks: number;
  total_earnings: number;
}

export default function StudentLookupPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzedCount, setAnalyzedCount] = useState<number | null>(null);
  const [students, setStudents] = useState<HydratedStudent[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setStudents([]);

    try {
      // 1. Call Multi-Agent AI Endpoint
      const agentRes = await fetch(`${API_BASE_URL}/api/v1/student-workers/lookup-agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poster_query: query, limit: 1 }),
      });

      if (!agentRes.ok) {
        throw new Error('Failed to run AI candidate lookup.');
      }

      const agentData = await agentRes.json();
      setAnalyzedCount(agentData.total_candidates_analyzed || 0);

      const matches: AgentMatch[] = agentData.matched_students || [];

      if (matches.length === 0) {
        setIsLoading(false);
        return;
      }

      // 2. Hydrate profiles concurrently from user_profiles and professional_student_workers
      const hydratedResults = await Promise.all(
        matches.map(async (match) => {
          try {
            const [baseProfileRes, profProfileRes] = await Promise.all([
              fetch(`${API_BASE_URL}/api/v1/profiles/${match.student_clerk_id}`),
              fetch(`${API_BASE_URL}/api/v1/student-workers/profile/${match.student_clerk_id}`)
            ]);

            const baseData = baseProfileRes.ok ? await baseProfileRes.json() : {};
            const profData = profProfileRes.ok ? await profProfileRes.json() : {};

            return {
              clerk_id: match.student_clerk_id,
              fit_score: match.fit_score,
              match_reason: match.match_reason,
              display_name: baseData.display_name || 'Verified Student Worker',
              completed_tasks: baseData.metrics?.primary_stat ?? 0,
              total_earnings: baseData.metrics?.secondary_stat ?? 0,
              bio: profData.bio || 'No professional bio available.',
              skills: profData.skills || [],
              primary_location: profData.primary_location || 'Not specified',
              secondary_location: profData.secondary_location || '',
              working_hours: profData.working_hours || 'Flexible',
              transportation: profData.transportation || 'Public Transport',
              languages: profData.languages || [],
            } as HydratedStudent;
          } catch (err) {
            console.error(`Error hydrating ${match.student_clerk_id}:`, err);
            return null;
          }
        })
      );

      setStudents(hydratedResults.filter((s): s is HydratedStudent => s !== null));
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while matching students.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#EC5B38]" />
            AI Student Talent Matcher
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Describe the kind of student earner you need for your task. Our AI multi-agent graph will evaluate candidates across skills, availability, and location.
          </p>
        </div>

        {/* Task Poster Query Input */}
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            Task Requirements & Skill Criteria
          </label>
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Need a reliable photographer in Meepe or Colombo with a motorbike available on weekends for product photography..."
              rows={3}
              className="w-full p-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition resize-none"
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-400">
              Matches evaluated in real-time using Gemini Multi-Agent Routing
            </span>
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium text-sm rounded-xl shadow-sm transition"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Candidates...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Find Best Match
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Search Metadata Info */}
        {analyzedCount !== null && !isLoading && (
          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <span>Analyzed {analyzedCount} active candidate profiles</span>
            <span>Showing top {students.length} matches</span>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-100 rounded w-16"></div>
                  <div className="h-6 bg-gray-100 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results List */}
        {!isLoading && students.length > 0 && (
          <div className="space-y-6">
            {students.map((student) => (
              <div 
                key={student.clerk_id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-200 transition space-y-5"
              >
                {/* Profile Header & Fit Score */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-lg">
                      {student.display_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{student.display_name}</h3>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {student.completed_tasks} Tasks Completed
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          LKR {student.total_earnings.toLocaleString()} Earned
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Fit Badge */}
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl self-start sm:self-center">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">
                      {student.fit_score}% Match
                    </span>
                  </div>
                </div>

                {/* AI Match Reason Box */}
                <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-700">
                  <span className="font-semibold text-slate-900">AI Recommendation: </span>
                  {student.match_reason}
                </div>

                {/* Professional Summary / Bio */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Professional Summary
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {student.bio}
                  </p>
                </div>

                {/* Key Skills Badges */}
                {student.skills.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Key Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {student.skills.map((skill, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Operational Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-gray-100 text-xs">
                  {/* Locations */}
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Locations</div>
                      <div>{student.primary_location}</div>
                      {student.secondary_location && (
                        <div className="text-gray-400">{student.secondary_location}</div>
                      )}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-start gap-2 text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Availability</div>
                      <div>{student.working_hours}</div>
                    </div>
                  </div>

                  {/* Transportation */}
                  <div className="flex items-start gap-2 text-gray-600">
                    <Bike className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Transportation</div>
                      <div>{student.transportation}</div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="flex items-start gap-2 text-gray-600">
                    <Languages className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Languages</div>
                      <div>{student.languages.join(', ') || 'Not listed'}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty Search Result State */}
        {!isLoading && hasSearched && students.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-base font-semibold text-gray-800">No Student Matches Found</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              We couldn't find student candidates matching those exact criteria. Try broadening your task description location or required working hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}