import React, { useState } from 'react';
import { Subject, WeeklyPlanItem } from '../types';

interface WeeklyPlannerViewProps {
  subjects: Subject[];
  initialPlan: WeeklyPlanItem[];
}

export const WeeklyPlannerView: React.FC<WeeklyPlannerViewProps> = ({ subjects, initialPlan }) => {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlanItem[]>(initialPlan);
  const [selectedDay, setSelectedDay] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlanItem, setNewPlanItem] = useState({
    subjectId: subjects[0]?.id || 1,
    dayOfWeek: 'Monday' as WeeklyPlanItem['dayOfWeek'],
    plannedMinutes: 90,
    focusNotes: ''
  });

  const days: WeeklyPlanItem['dayOfWeek'][] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const handleToggleStatus = (id: number) => {
    setWeeklyPlan(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === 'Completed' ? 'Pending' : 'Completed' }
          : item
      )
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const subj = subjects.find(s => s.id === Number(newPlanItem.subjectId));
    const newItem: WeeklyPlanItem = {
      id: Date.now(),
      userId: 2,
      subjectId: Number(newPlanItem.subjectId),
      subjectName: subj?.name || 'General',
      dayOfWeek: newPlanItem.dayOfWeek,
      planDate: '2026-10-08',
      plannedMinutes: Number(newPlanItem.plannedMinutes),
      focusNotes: newPlanItem.focusNotes || 'Focused revision block',
      status: 'Pending'
    };
    setWeeklyPlan(prev => [...prev, newItem]);
    setIsAddModalOpen(false);
    setNewPlanItem({
      subjectId: subjects[0]?.id || 1,
      dayOfWeek: 'Monday',
      plannedMinutes: 90,
      focusNotes: ''
    });
  };

  const handleGenerateSmartPlan = () => {
    // Generate intelligent weekly allocation based on subjects' priority
    const smartSchedule: WeeklyPlanItem[] = days.map((day, idx) => {
      const subject = subjects[idx % subjects.length];
      const isWeekend = day === 'Saturday' || day === 'Sunday';
      const duration = subject.priority === 'High' ? 120 : isWeekend ? 60 : 90;
      return {
        id: Date.now() + idx,
        userId: 2,
        subjectId: subject.id,
        subjectName: subject.name,
        dayOfWeek: day,
        planDate: `2026-10-${String(idx + 5).padStart(2, '0')}`,
        plannedMinutes: duration,
        focusNotes: `${subject.priority} Priority review: Active recall & problem-solving drill`,
        status: idx === 0 ? 'Completed' : 'Pending'
      };
    });
    setWeeklyPlan(smartSchedule);
  };

  const filteredItems = selectedDay === 'ALL'
    ? weeklyPlan
    : weeklyPlan.filter(item => item.dayOfWeek === selectedDay);

  const totalPlannedMinutes = weeklyPlan.reduce((acc, item) => acc + item.plannedMinutes, 0);
  const totalCompletedMinutes = weeklyPlan
    .filter(item => item.status === 'Completed')
    .reduce((acc, item) => acc + item.plannedMinutes, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg text-lg">📅</span>
            <h2 className="text-xl font-bold text-slate-800">Weekly Academic Study Timetable</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Structured day-by-day distribution targeting high-priority and weak subjects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateSmartPlan}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer border border-indigo-200 flex items-center gap-1.5"
          >
            <span>⚡</span>
            <span>Auto-Generate Plan</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Add Study Slot</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Planned Hours</span>
          <p className="text-xl font-black text-slate-800 mt-1">{(totalPlannedMinutes / 60).toFixed(1)} hrs</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Completed Hours</span>
          <p className="text-xl font-black text-emerald-600 mt-1">{(totalCompletedMinutes / 60).toFixed(1)} hrs</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Schedule Adherence</span>
          <p className="text-xl font-black text-blue-600 mt-1">
            {totalPlannedMinutes > 0 ? Math.round((totalCompletedMinutes / totalPlannedMinutes) * 100) : 0}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Remaining Slots</span>
          <p className="text-xl font-black text-amber-600 mt-1">
            {weeklyPlan.filter(i => i.status === 'Pending').length} slots
          </p>
        </div>
      </div>

      {/* Day Selector Filter */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => setSelectedDay('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
            selectedDay === 'ALL' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All 7 Days
        </button>
        {days.map(d => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              selectedDay === d ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {d.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Planner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`bg-white rounded-xl border p-4 shadow-xs transition-all flex flex-col justify-between ${
              item.status === 'Completed'
                ? 'border-emerald-300 bg-emerald-50/20'
                : 'border-slate-200 hover:border-blue-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{item.dayOfWeek}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    item.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mt-2">{item.subjectName}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.focusNotes}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">⏳ {item.plannedMinutes} mins</span>
              <button
                onClick={() => handleToggleStatus(item.id)}
                className={`text-xs font-semibold px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                  item.status === 'Completed'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                }`}
              >
                {item.status === 'Completed' ? '✓ Done' : 'Mark Complete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Slot Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add Study Timetable Slot</h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={newPlanItem.subjectId}
                  onChange={e => setNewPlanItem({ ...newPlanItem, subjectId: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.priority} Priority)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Day of Week</label>
                <select
                  value={newPlanItem.dayOfWeek}
                  onChange={e => setNewPlanItem({ ...newPlanItem, dayOfWeek: e.target.value as any })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  {days.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  value={newPlanItem.plannedMinutes}
                  onChange={e => setNewPlanItem({ ...newPlanItem, plannedMinutes: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Focus Notes / Chapter</label>
                <input
                  type="text"
                  placeholder="e.g. Solve previous year exam questions on JDBC"
                  value={newPlanItem.focusNotes}
                  onChange={e => setNewPlanItem({ ...newPlanItem, focusNotes: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer shadow-sm"
                >
                  Save Study Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
