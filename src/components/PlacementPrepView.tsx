import React, { useState } from 'react';
import { PlacementItem, StudentProfile } from '../types';

interface PlacementPrepViewProps {
  profile: StudentProfile;
  questions: PlacementItem[];
  onNavigateToAI: (query: string) => void;
}

export const PlacementPrepView: React.FC<PlacementPrepViewProps> = ({
  profile,
  questions,
  onNavigateToAI
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [searchFilter, setSearchFilter] = useState('');

  // Map career to category
  const targetCategory = profile.careerPathId === 1
    ? 'AI & Data'
    : profile.careerPathId === 2
    ? 'Cybersecurity'
    : 'Software Engineering';

  const careerQuestions = questions.filter(q => q.careerCategory === targetCategory || q.category === 'HR');

  const filteredQuestions = careerQuestions.filter(q => {
    const matchesCat = selectedCategory === 'ALL' || q.category === selectedCategory;
    const matchesSearch = q.question.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          q.companyTags.some(t => t.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <span>💼 Placement &amp; Job Interview Preparation</span>
          </div>
          <h2 className="text-2xl font-black text-white">Career-Specific Interview Masterclass</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Curated question bank with company benchmarks and evaluation rubrics for <span className="text-slate-200 font-semibold">{profile.targetJobRole}</span> positions.
          </p>
        </div>

        <button
          onClick={() => onNavigateToAI(`Conduct a 5-question mock technical interview with me for a ${profile.targetJobRole} role. Ask me one question at a time and evaluate my answers.`)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/30 cursor-pointer flex items-center gap-2 shrink-0"
        >
          <span>🤖 Start AI Mock Interview</span>
          <span>→</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {['ALL', 'Technical', 'Coding', 'System Design', 'HR'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'All Questions' : cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search questions, company tags..."
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          <span className="absolute left-2.5 top-2 text-slate-500 text-xs">🔍</span>
        </div>
      </div>

      {/* Question Accordion List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400 text-xs">
            No interview questions match your current category or search filter.
          </div>
        ) : (
          filteredQuestions.map(item => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isExpanded
                    ? 'bg-slate-900 border-blue-500/50 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        item.difficulty === 'Easy'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : item.difficulty === 'Medium'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {item.difficulty}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      {item.companyTags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] bg-blue-950/40 text-blue-300 border border-blue-900/40 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h4 className="text-sm font-bold text-white leading-relaxed">
                      {item.question}
                    </h4>
                  </div>

                  <span className="text-slate-400 text-lg font-bold shrink-0 mt-1">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-slate-800/80 space-y-4 text-xs">
                    <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
                      <span className="text-[10px] uppercase font-bold text-blue-400 block mb-1">Model Answer / Architectural Approach:</span>
                      <p>{item.answer}</p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Key Criteria Hiring Managers Check:</span>
                      <ul className="space-y-1.5">
                        {item.keyPoints.map((kp, kpIdx) => (
                          <li key={kpIdx} className="flex items-center gap-2 text-slate-300 text-xs">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>{kp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => onNavigateToAI(`Help me practice answering this interview question: "${item.question}". What are the edge cases I should mention to sound like a senior engineer?`)}
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Drill with AI Interviewer</span>
                        <span>🤖</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
