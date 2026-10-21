import React, { useState } from 'react';
import { RoadmapTopic, StudentProfile } from '../types';

interface RoadmapViewProps {
  profile: StudentProfile;
  topics: RoadmapTopic[];
  onToggleTopic: (topicId: number) => void;
  onNavigateToAI: (query: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  profile,
  topics,
  onToggleTopic,
  onNavigateToAI
}) => {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('ALL');

  const careerTopics = topics.filter(t => t.careerPathId === profile.careerPathId);
  const completedCount = careerTopics.filter(t => t.isCompleted).length;
  const progressPct = careerTopics.length > 0
    ? Math.round((completedCount / careerTopics.length) * 100)
    : 0;

  const filteredTopics = filterDifficulty === 'ALL'
    ? careerTopics
    : careerTopics.filter(t => t.difficulty === filterDifficulty);

  // Group by phase
  const phases = Array.from(new Set(careerTopics.map(t => t.phaseNumber))).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <span>🗺️ Personalized Curriculum: {profile.careerTitle}</span>
          </div>
          <h2 className="text-2xl font-black text-white">Your Step-by-Step Learning Roadmap</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Tailored specifically for your <span className="text-slate-200 font-semibold">{profile.skillLevel}</span> skill level, targeting <span className="text-slate-200 font-semibold">{profile.targetJobRole}</span>. Check off topics as you finish them to unlock advanced career modules.
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shrink-0 text-center min-w-[170px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Completion</span>
          <p className="text-3xl font-black text-cyan-400 mt-1">{progressPct}%</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 mt-1.5 block">
            {completedCount} of {careerTopics.length} Milestones
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {['ALL', 'Beginner', 'Intermediate', 'Advanced'].map(diff => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                filterDifficulty === diff
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {diff === 'ALL' ? 'All Milestones' : diff}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          Showing {filteredTopics.length} modules
        </span>
      </div>

      {/* Phases and Topic Cards */}
      <div className="space-y-8">
        {phases.map(phaseNum => {
          const phaseTopics = filteredTopics.filter(t => t.phaseNumber === phaseNum);
          if (phaseTopics.length === 0) return null;
          const phaseTitle = phaseTopics[0].phaseTitle;

          return (
            <div key={phaseNum} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-300 font-black text-sm flex items-center justify-center">
                  {phaseNum}
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">{phaseTitle}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {phaseTopics.map(topic => (
                  <div
                    key={topic.id}
                    className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                      topic.isCompleted
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onToggleTopic(topic.id)}
                            className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs cursor-pointer transition-colors ${
                              topic.isCompleted
                                ? 'bg-emerald-500 border-emerald-400 text-white'
                                : 'border-slate-700 hover:border-blue-400 text-transparent'
                            }`}
                          >
                            ✓
                          </button>
                          <h4 className={`text-sm font-bold ${topic.isCompleted ? 'text-emerald-300 line-through' : 'text-white'}`}>
                            {topic.topicName}
                          </h4>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono shrink-0 ${
                          topic.difficulty === 'Beginner'
                            ? 'bg-blue-500/20 text-blue-300'
                            : topic.difficulty === 'Intermediate'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {topic.difficulty}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">{topic.description}</p>

                      <div className="mt-4 pt-3 border-t border-slate-800/80">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">Mastery Checklist:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {topic.keyConcepts.map((kc, kidx) => (
                            <span key={kidx} className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-md">
                              {kc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">⏳ ~{topic.estimatedHours} Hours</span>
                      <button
                        onClick={() => onNavigateToAI(`Explain ${topic.topicName} in depth with code examples and interview questions for a ${profile.skillLevel} student.`)}
                        className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <span>Ask AI to Explain</span>
                        <span>🤖</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
