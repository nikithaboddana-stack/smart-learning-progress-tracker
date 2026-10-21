import React, { useState } from 'react';
import { CareerPath, Skill, StudentProfile, User } from '../types';

interface ProfileSetupWizardProps {
  user: User;
  careerPaths: CareerPath[];
  skills: Skill[];
  onCompleteProfile: (profile: StudentProfile) => void;
}

export const ProfileSetupWizard: React.FC<ProfileSetupWizardProps> = ({
  user,
  careerPaths,
  skills,
  onCompleteProfile
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedCareerId, setSelectedCareerId] = useState<number>(careerPaths[0]?.id || 1);
  const [targetJobRole, setTargetJobRole] = useState<string>('Generative AI Engineer');
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([1, 5]); // default Python, SQL
  const [learningGoal, setLearningGoal] = useState<StudentProfile['learningGoal']>('Placement');
  const [weeklyHours, setWeeklyHours] = useState<number>(15);
  const [targetCompletionDate, setTargetCompletionDate] = useState<string>('2027-04-30');
  const [preferredFormat, setPreferredFormat] = useState<StudentProfile['preferredFormat']>('Hands-on coding');

  const selectedCareer = careerPaths.find(c => c.id === selectedCareerId) || careerPaths[0];

  const handleToggleSkill = (skillId: number) => {
    if (selectedSkillIds.includes(skillId)) {
      setSelectedSkillIds(selectedSkillIds.filter(id => id !== skillId));
    } else {
      setSelectedSkillIds([...selectedSkillIds, skillId]);
    }
  };

  const handleFinishWizard = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: StudentProfile = {
      id: Date.now(),
      userId: user.id,
      careerPathId: selectedCareer.id,
      careerTitle: selectedCareer.title,
      targetJobRole: targetJobRole.trim() || selectedCareer.title,
      skillLevel,
      existingSkillIds: selectedSkillIds,
      learningGoal,
      weeklyHours: Number(weeklyHours),
      targetCompletionDate,
      preferredFormat,
      isCompleted: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onCompleteProfile(newProfile);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden">
        {/* Progress Stepper Header */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Step {step} of 3</span>
              <h2 className="text-xl font-black text-white mt-0.5">
                {step === 1 && '🎯 Select Your Career Objective & Target Role'}
                {step === 2 && '📊 Current Skill Level & Knowledge Audit'}
                {step === 3 && '🏁 Learning Goals & Study Commitment'}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Student: </span>
              <span className="text-xs font-bold text-white">{user.name}</span>
            </div>
          </div>

          {/* Stepper bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Content */}
        <div className="p-8">
          {/* STEP 1: CAREER SELECTION */}
          {step === 1 && (
            <div className="space-y-6">
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose the industry specialization you want to prepare for. Your personalized syllabus, interview challenges, and AI assistant prompt will be strictly structured around this choice.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {careerPaths.map(cp => {
                  const isSelected = cp.id === selectedCareerId;
                  return (
                    <div
                      key={cp.id}
                      onClick={() => {
                        setSelectedCareerId(cp.id);
                        setTargetJobRole(cp.title);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-500 bg-blue-950/40 shadow-lg shadow-blue-500/10'
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-2xl">{cp.icon}</span>
                        <input
                          type="radio"
                          name="career"
                          checked={isSelected}
                          onChange={() => {}}
                          className="mt-1 accent-blue-500 cursor-pointer"
                        />
                      </div>
                      <div className="mt-2">
                        <h4 className="text-sm font-bold text-white">{cp.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{cp.description}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                        <span>~{cp.estimatedMonths} Months</span>
                        <span className="text-blue-400 font-semibold">{cp.demandLevel} Demand</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Specific Target Job Title (Optional fine-tuning)
                </label>
                <input
                  type="text"
                  value={targetJobRole}
                  onChange={e => setTargetJobRole(e.target.value)}
                  placeholder="e.g. Junior Generative AI Engineer, SOC Analyst L1"
                  className="w-full text-xs p-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-blue-600/30 flex items-center gap-1.5"
                >
                  <span>Continue to Skill Audit</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SKILL LEVEL & EXISTING KNOWLEDGE */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select Your Current Experience Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSkillLevel(lvl)}
                      className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                        skillLevel === lvl
                          ? 'border-blue-500 bg-blue-950/50 text-white shadow-md'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <p className="font-bold text-xs">{lvl}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {lvl === 'Beginner' && 'Little to no experience'}
                        {lvl === 'Intermediate' && 'Built small projects'}
                        {lvl === 'Advanced' && 'Production ready / deep knowledge'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Check Any Skills You Already Know
                </label>
                <p className="text-[11px] text-slate-500 mb-3">
                  We'll bypass foundational modules you have already mastered so you don't waste valuable study time.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {skills.map(sk => {
                    const isChecked = selectedSkillIds.includes(sk.id);
                    return (
                      <label
                        key={sk.id}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-blue-950/40 border-blue-500/60 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSkill(sk.id)}
                          className="accent-blue-500 cursor-pointer"
                        />
                        <span className="text-xs font-medium">{sk.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-blue-600/30 flex items-center gap-1.5"
                >
                  <span>Continue to Goals</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: LEARNING GOAL & TIMELINE */}
          {step === 3 && (
            <form onSubmit={handleFinishWizard} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  What is Your Primary Objective?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    ['Placement', 'Internship', 'Job', 'Career Switch', 'Freelancing', 'Higher Studies', 'Certification', 'Personal Learning'] as const
                  ).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setLearningGoal(g)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs font-semibold ${
                        learningGoal === g
                          ? 'border-blue-500 bg-blue-950/50 text-white shadow-sm'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Study Commitment (Hours per Week)
                  </label>
                  <input
                    type="number"
                    min="4"
                    max="60"
                    value={weeklyHours}
                    onChange={e => setWeeklyHours(Number(e.target.value))}
                    className="w-full text-xs p-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Recommended for {learningGoal}: 12–20 hrs/week</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    value={targetCompletionDate}
                    onChange={e => setTargetCompletionDate(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Preferred Learning Format
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    ['Hands-on coding', 'Projects', 'Courses', 'Videos', 'Reading', 'Mixed'] as const
                  ).map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setPreferredFormat(f)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs font-medium ${
                        preferredFormat === f
                          ? 'border-blue-500 bg-blue-950/50 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-xl shadow-blue-600/30 flex items-center gap-2"
                >
                  <span>Generate My Personalized Roadmap</span>
                  <span>✨</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
