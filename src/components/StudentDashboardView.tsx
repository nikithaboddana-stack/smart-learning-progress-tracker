import React from 'react';
import { User, StudentProfile, RoadmapTopic, LearningResource } from '../types';

interface StudentDashboardViewProps {
  user: User;
  profile: StudentProfile;
  topics: RoadmapTopic[];
  resources: LearningResource[];
  onNavigate: (page: string) => void;
  onToggleTopic: (topicId: number) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  user,
  profile,
  topics,
  resources,
  onNavigate,
  onToggleTopic
}) => {
  const firstName = user.name.split(' ')[0];
  const careerTopics = topics.filter(t => t.careerPathId === profile.careerPathId);
  const completedCount = careerTopics.filter(t => t.isCompleted).length;
  const progressPct = careerTopics.length > 0
    ? Math.round((completedCount / careerTopics.length) * 100)
    : 0;

  const currentTopic = careerTopics.find(t => !t.isCompleted) || careerTopics[0];
  const nextTopics = careerTopics.filter(t => !t.isCompleted).slice(0, 3);
  const relevantResources = resources.filter(r => r.careerCategory === (profile.careerPathId === 1 ? 'AI & Data' : profile.careerPathId === 2 ? 'Cybersecurity' : 'Software Engineering')).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 border border-slate-800 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold">
              <span>🎯 Career Track: {profile.careerTitle}</span>
              <span>&bull;</span>
              <span>{profile.skillLevel} Level</span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
              Welcome back, {firstName} 👋
            </h1>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Targeting <span className="text-white font-semibold">{profile.targetJobRole}</span> for <span className="text-white font-semibold">{profile.learningGoal}</span> &bull; {profile.weeklyHours} hours/week commitment &bull; Target: {profile.targetCompletionDate}
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shrink-0 text-center min-w-[160px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Roadmap Progress</span>
            <div className="text-3xl font-black text-cyan-400 mt-1">{progressPct}%</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 mt-1.5 block">
              {completedCount} of {careerTopics.length} Milestones
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Role</span>
          <p className="text-sm font-bold text-white mt-1 truncate">{profile.targetJobRole}</p>
          <p className="text-[10px] text-blue-400 mt-0.5">{profile.skillLevel} Phase</p>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Weekly Hours</span>
          <p className="text-sm font-bold text-emerald-400 mt-1">{profile.weeklyHours}h / week</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Preferred: {profile.preferredFormat}</p>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Placement Readiness</span>
          <p className="text-sm font-bold text-amber-400 mt-1">{Math.min(95, Math.max(30, progressPct + 25))}%</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Based on milestones</p>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Study Streak</span>
          <p className="text-sm font-bold text-rose-400 mt-1">5 Days 🔥</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Keep daily velocity</p>
        </div>
      </div>

      {/* Main Grid: Today's Focus & AI Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Today's Roadmap Focus */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>📍</span>
                  <span>Active Roadmap Milestones</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your customized progression for {profile.careerTitle}
                </p>
              </div>
              <button
                onClick={() => onNavigate('roadmap')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                View Full Roadmap →
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {nextTopics.map((topic, idx) => (
                <div
                  key={topic.id}
                  className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 flex items-start justify-between gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleTopic(topic.id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs mt-0.5 cursor-pointer transition-colors ${
                        topic.isCompleted
                          ? 'bg-emerald-500 border-emerald-400 text-white'
                          : 'border-slate-700 hover:border-blue-400 text-transparent'
                      }`}
                    >
                      ✓
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{topic.topicName}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                          {topic.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{topic.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {topic.keyConcepts.map((kc, kIdx) => (
                          <span key={kIdx} className="text-[10px] bg-blue-950/40 text-blue-300 border border-blue-900/50 px-2 py-0.5 rounded-md">
                            {kc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-slate-500 font-medium shrink-0">~{topic.estimatedHours}h</span>
                </div>
              ))}
            </div>
          </div>

          {/* Placement Quick Prep Banner */}
          <div className="bg-gradient-to-r from-blue-950 to-slate-900 border border-blue-900/40 rounded-2xl p-6 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Interview Training</span>
              <h4 className="text-sm font-bold text-white mt-1">Ready to test your {profile.targetJobRole} readiness?</h4>
              <p className="text-xs text-slate-300 mt-1">
                Access technical questions, coding scenarios, and system design challenges tagged with real company benchmarks.
              </p>
            </div>
            <button
              onClick={() => onNavigate('placement')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0 shadow-md shadow-blue-600/20"
            >
              Start Placement Drills →
            </button>
          </div>
        </div>

        {/* Right Column (1 Col): AI Mentor & Curated Resources */}
        <div className="space-y-6">
          {/* AI Career Recommendation Card */}
          <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-900/50">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <h4 className="text-sm font-bold text-white">AI Mentor Recommendation</h4>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-mono">
                Gemini Active
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              {profile.careerPathId === 1 && (
                <>
                  "Hello {firstName}! Since you are preparing for <strong>{profile.targetJobRole}</strong>, your highest ROI focus right now is <strong>{currentTopic?.topicName || 'Transformers & Vector Databases'}</strong>. Complete the hands-on RAG project to solidify your resume."
                </>
              )}
              {profile.careerPathId === 2 && (
                <>
                  "Hello {firstName}! In cybersecurity SOC interviews, hiring managers prioritize hands-on Wireshark pcap analysis and OWASP Top 10 remediation. Spend 45 minutes practicing the SIEM correlation scenario today."
                </>
              )}
              {profile.careerPathId > 2 && (
                <>
                  "Hello {firstName}! Build consistency by writing clean, modular code for your active milestone. Once completed, add the deliverable to your GitHub portfolio."
                </>
              )}
            </p>

            <button
              onClick={() => onNavigate('ai-assistant')}
              className="w-full mt-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              <span>Ask AI Career Advisor</span>
              <span>💬</span>
            </button>
          </div>

          {/* Curated Resources Widget */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Verified Resources</h4>
              <button
                onClick={() => onNavigate('resources')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                Catalog →
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {relevantResources.map(res => (
                <a
                  key={res.id}
                  href={res.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors text-xs group"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-blue-400">{res.provider}</span>
                    <span>{res.resourceType}</span>
                  </div>
                  <p className="font-bold text-white mt-1 group-hover:text-blue-300 transition-colors">{res.title}</p>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{res.description}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
