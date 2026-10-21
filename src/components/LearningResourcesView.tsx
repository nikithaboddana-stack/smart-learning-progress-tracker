import React, { useState } from 'react';
import { LearningResource, LiveEvent, InstructorProfile } from '../types';

interface LearningResourcesViewProps {
  resources: LearningResource[];
  liveEvents: LiveEvent[];
  instructors: InstructorProfile[];
  userCareerCategory: string;
}

export const LearningResourcesView: React.FC<LearningResourcesViewProps> = ({
  resources,
  liveEvents,
  instructors,
  userCareerCategory
}) => {
  const [activeTab, setActiveTab] = useState<'resources' | 'live' | 'instructors'>('resources');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = resources.filter(r => {
    const matchesCategory = r.careerCategory === userCareerCategory || r.careerCategory === 'All';
    const matchesType = selectedType === 'ALL' || r.resourceType === selectedType;
    const matchesLevel = selectedLevel === 'ALL' || r.skillLevel === selectedLevel || r.skillLevel === 'All Levels';
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.provider.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesType && matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'resources'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            📚 Learning Catalog ({filteredResources.length})
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'live'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>🔴 Live Learning &amp; Webinars</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </button>
          <button
            onClick={() => setActiveTab('instructors')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'instructors'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            🎓 Faculty &amp; Industry Experts ({instructors.length})
          </button>
        </div>

        {activeTab === 'resources' && (
          <div className="relative">
            <input
              type="text"
              placeholder="Search resources, providers..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
            <span className="absolute left-2.5 top-2 text-slate-500 text-xs">🔍</span>
          </div>
        )}
      </div>

      {/* TAB 1: CURATED RESOURCES */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {['ALL', 'Course', 'Documentation', 'Video', 'Project'].map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    selectedType === t ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t === 'ALL' ? 'All Types' : t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs">Level:</span>
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1 text-xs"
              >
                <option value="ALL">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map(res => (
              <div
                key={res.id}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-blue-400 uppercase tracking-wider">{res.provider}</span>
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                      {res.resourceType}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2 leading-snug">{res.title}</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{res.description}</p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Topic: <strong className="text-slate-200">{res.topic}</strong></span>
                    <span className="text-emerald-400 font-semibold">{res.isFree ? '100% Free' : 'Verified'}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{res.duration || 'Self-paced'}</span>
                  <a
                    href={res.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Official Resource</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE CLASSES & WEBINARS */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
            <div>
              <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                <span>🔴 Verified Live Sessions</span>
              </div>
              <h3 className="text-2xl font-black text-white">Live Industry Workshops &amp; Masterclasses</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Interact with principal engineers and security directors in live Zoom and Google Meet webinars.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveEvents.length === 0 ? (
              <div className="col-span-2 text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400 text-xs">
                No verified upcoming live session is currently available. Check back soon for new webinar schedules.
              </div>
            ) : (
              liveEvents.map(evt => (
                <div key={evt.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">{evt.careerCategory}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono">
                      {evt.platform}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white">{evt.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Instructor: <strong className="text-slate-200">{evt.instructor}</strong> ({evt.organization})
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                    <span>📅 {evt.date}</span>
                    <span>⏰ {evt.time}</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-400 font-semibold">✓ Verified Session</span>
                    <a
                      href={evt.registrationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Register Now →
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: INSTRUCTORS */}
      {activeTab === 'instructors' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {instructors.map(inst => (
            <div key={inst.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold text-lg flex items-center justify-center">
                  {inst.name.charAt(0)}
                </div>
                <h4 className="text-base font-bold text-white mt-3">{inst.name}</h4>
                <p className="text-xs text-blue-400 font-medium">{inst.role}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{inst.organization}</p>
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">{inst.bio}</p>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">Expertise:</span>
                <div className="flex flex-wrap gap-1.5">
                  {inst.expertise.map((exp, eIdx) => (
                    <span key={eIdx} className="text-[10px] bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
