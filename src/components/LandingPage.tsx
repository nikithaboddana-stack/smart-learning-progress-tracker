import React from 'react';
import { CareerPath } from '../types';

interface LandingPageProps {
  careerPaths: CareerPath[];
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onQuickDemoLogin: (email: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  careerPaths,
  onOpenLogin,
  onOpenRegister,
  onQuickDemoLogin
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
            ⚡
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              Smart Career
              <span className="text-[10px] uppercase font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                AI Powered
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Learn. Prepare. Build Skills. Get Hired.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onQuickDemoLogin('admin@smartcareer.edu')}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer hidden md:inline-flex items-center gap-1.5"
          >
            <span>🛡️</span>
            <span>Admin Portal</span>
          </button>
          <button
            onClick={onOpenLogin}
            className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={onOpenRegister}
            className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-600/30 cursor-pointer flex items-center gap-1.5"
          >
            <span>Create Student Account</span>
            <span>→</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 px-6 lg:px-12 max-w-6xl mx-auto text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-500/30 px-4 py-1.5 rounded-full text-xs font-semibold text-blue-300 shadow-inner">
            <span>✨ Personalized Career Architect &bull; Powered by Gemini AI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Learn. Prepare. Build Skills.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              Get Hired.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stop learning aimlessly. Select your target career path, let our AI architect a customized topic roadmap, practice real interview questions, and build portfolio projects that recruiters love.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onOpenRegister}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
            >
              <span>🚀 Start Your Free Career Profile</span>
              <span>→</span>
            </button>
            <button
              onClick={onOpenLogin}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors cursor-pointer"
            >
              Sign In to Your Dashboard
            </button>
          </div>

          {/* Quick Demo Evaluation Bar */}
          <div className="pt-8 max-w-xl mx-auto">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 text-center">
                Instant College Viva / Presentation Accounts (1-Click)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => onQuickDemoLogin('rahul@smartcareer.edu')}
                  className="p-2.5 text-left rounded-xl bg-slate-800/90 hover:bg-blue-950/60 border border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer"
                >
                  <p className="font-bold text-white text-xs">Rahul Kumar</p>
                  <p className="text-[10px] text-blue-400">Generative AI Engineer</p>
                </button>
                <button
                  onClick={() => onQuickDemoLogin('priya@smartcareer.edu')}
                  className="p-2.5 text-left rounded-xl bg-slate-800/90 hover:bg-indigo-950/60 border border-slate-700 hover:border-indigo-500/50 transition-all cursor-pointer"
                >
                  <p className="font-bold text-white text-xs">Priya Sharma</p>
                  <p className="text-[10px] text-indigo-400">Cybersecurity Analyst</p>
                </button>
                <button
                  onClick={() => onQuickDemoLogin('admin@smartcareer.edu')}
                  className="p-2.5 text-left rounded-xl bg-slate-800/90 hover:bg-amber-950/60 border border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer"
                >
                  <p className="font-bold text-white text-xs">Administrator</p>
                  <p className="text-[10px] text-amber-400">Admin Control Panel</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Career Paths */}
      <section className="py-16 px-6 lg:px-12 max-w-6xl mx-auto border-t border-slate-800/80 w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">Targeted Specializations</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">High-Demand Career Tracks</h2>
          <p className="text-xs text-slate-400 mt-2">Every track includes customized roadmaps, interview question banks, and project blueprints.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {careerPaths.map(cp => (
            <div
              key={cp.id}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{cp.icon}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    cp.demandLevel === 'Ultra High'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {cp.demandLevel} Demand
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-4">{cp.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{cp.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] font-semibold uppercase text-slate-500 block mb-2">Core Competencies:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {cp.keySkills.slice(0, 4).map((s, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60">
                        {s}
                      </span>
                    ))}
                    {cp.keySkills.length > 4 && (
                      <span className="text-[10px] text-slate-400 px-1 py-0.5">+{cp.keySkills.length - 4} more</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">⏱️ ~{cp.estimatedMonths} Months</span>
                <button
                  onClick={onOpenRegister}
                  className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer flex items-center gap-1"
                >
                  <span>Select Track</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-16 px-6 lg:px-12 max-w-6xl mx-auto border-t border-slate-800/80 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-3xl">🗺️</span>
            <h3 className="text-base font-bold text-white">No Fake Academic Data</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every topic and roadmap milestone is dynamically mapped to your selected career role, skill level, and placement goal. Zero generic fillers.
            </p>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-3xl">🤖</span>
            <h3 className="text-base font-bold text-white">Grounded Gemini AI Mentor</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask deep technical questions, simulate mock interviews, and receive personalized code reviews tailored specifically to your active track.
            </p>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-3xl">💼</span>
            <h3 className="text-base font-bold text-white">Targeted Placement Preparation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Master company-tagged technical interview questions, architecture trade-offs, and behavioral scenarios with expert evaluation keys.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-400">⚡ Smart Career — AI-Powered Career Guidance &amp; Personalized Learning Platform</p>
        <p className="mt-1">Built with Jakarta Servlets 6.0 &bull; Java 17 &bull; JSP &bull; JDBC &bull; MySQL &bull; Apache Tomcat 10.1+</p>
      </footer>
    </div>
  );
};
