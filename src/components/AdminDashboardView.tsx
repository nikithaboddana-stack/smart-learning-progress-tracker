import React, { useState } from 'react';
import { User, Subject } from '../types';

interface AdminDashboardViewProps {
  currentUser: User;
  users: User[];
  subjects: Subject[];
  onToggleStatus: (userId: number) => void;
  onSelectStudent: (student: User) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  users,
  subjects,
  onToggleStatus,
  onSelectStudent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedStudentDossier, setSelectedStudentDossier] = useState<User | null>(null);

  const students = users.filter(u => u.role === 'STUDENT');
  const activeStudents = students.filter(s => s.status === 'ACTIVE');
  const totalSubjectsCount = subjects.length;

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (student.department && student.department.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = deptFilter === 'ALL' || student.department === deptFilter;
    const matchesStatus = statusFilter === 'ALL' || student.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const uniqueDepartments = Array.from(new Set(students.map(s => s.department).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/30 text-indigo-200 px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-indigo-400/30">
            <span>🛡️ Institutional Administration Portal</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            Academic Monitoring &amp; Student Operations
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Logged in as <span className="text-white font-semibold">{currentUser.name}</span> ({currentUser.email}). Real-time visibility into student progress, syllabi completion, and academic interventions.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Students</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg text-lg">👥</span>
          </div>
          <p className="text-3xl font-black text-slate-800 mt-2">{students.length}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-emerald-600 font-medium">
            <span>●</span>
            <span>{activeStudents.length} Active accounts</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Master Subjects</span>
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg text-lg">📚</span>
          </div>
          <p className="text-3xl font-black text-slate-800 mt-2">{totalSubjectsCount}</p>
          <p className="text-xs text-slate-500 mt-2">Active university curriculum</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Logged Study Hours</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg text-lg">⏱️</span>
          </div>
          <p className="text-3xl font-black text-slate-800 mt-2">128.5 hrs</p>
          <p className="text-xs text-emerald-600 mt-2 font-medium">↑ 14% higher than last week</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Campus Average Score</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg text-lg">📊</span>
          </div>
          <p className="text-3xl font-black text-slate-800 mt-2">82.4%</p>
          <p className="text-xs text-slate-500 mt-2">Based on latest midterm results</p>
        </div>
      </div>

      {/* Student Management Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Student Directory &amp; Performance Records</h2>
            <p className="text-xs text-slate-500">Monitor individual learning trajectories and account statuses</p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
              />
              <span className="absolute left-3 top-2 text-slate-400 text-xs">🔍</span>
            </div>

            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
            >
              <option value="ALL">All Departments</option>
              {uniqueDepartments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Department &amp; Semester</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Target CGPA</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No students match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{student.name}</p>
                          <p className="text-[11px] text-slate-400">@{student.username || student.email.split('@')[0]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-700">{student.department || 'Computer Science'}</p>
                      <p className="text-[11px] text-slate-400">{student.semester || '6th Semester'} &bull; {student.course || 'B.Tech'}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <p>{student.email}</p>
                      <p className="text-[11px] text-slate-400">{student.phone || 'N/A'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800">{student.targetCgpa || '8.5'}/10.0</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        student.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {student.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedStudentDossier(student)}
                          className="px-2.5 py-1 text-[11px] font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                        >
                          View Dossier
                        </button>
                        <button
                          onClick={() => onToggleStatus(student.id)}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                            student.status === 'ACTIVE'
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          {student.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Dossier Modal */}
      {selectedStudentDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center">
                  {selectedStudentDossier.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedStudentDossier.name}</h3>
                  <p className="text-xs text-slate-500">
                    {selectedStudentDossier.department} &bull; {selectedStudentDossier.semester}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentDossier(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Study Streak</span>
                <p className="text-lg font-black text-amber-600 mt-1">4 Days 🔥</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Test Average</span>
                <p className="text-lg font-black text-blue-600 mt-1">82.4%</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Target CGPA</span>
                <p className="text-lg font-black text-emerald-600 mt-1">{selectedStudentDossier.targetCgpa || 8.8}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Account Status</span>
                <p className="text-xs font-bold text-emerald-700 mt-2">{selectedStudentDossier.status || 'ACTIVE'}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Contact &amp; Academic Info</h4>
              <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p><span className="font-semibold text-slate-800">Email:</span> {selectedStudentDossier.email}</p>
                <p><span className="font-semibold text-slate-800">Phone:</span> {selectedStudentDossier.phone || '+91 9876543210'}</p>
                <p><span className="font-semibold text-slate-800">Degree Course:</span> {selectedStudentDossier.course || 'B.Tech'}</p>
                <p><span className="font-semibold text-slate-800">Bio:</span> {selectedStudentDossier.bio || 'Active full-time engineering scholar.'}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => {
                  onSelectStudent(selectedStudentDossier);
                  setSelectedStudentDossier(null);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors"
              >
                Switch to this Student View
              </button>
              <button
                onClick={() => setSelectedStudentDossier(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
