import React, { useState } from 'react';
import { User } from '../types';

interface StudentProfileViewProps {
  user: User;
  onUpdateUser: (updated: User) => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone || '+91 9876543210',
    department: user.department || 'Computer Science & Engineering',
    course: user.course || 'B.Tech',
    semester: user.semester || '6th Semester',
    targetCgpa: user.targetCgpa || 8.8,
    bio: user.bio || 'Aspiring software engineer dedicated to mastering core computer science.'
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...user,
      ...formData
    };
    onUpdateUser(updatedUser);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center justify-between">
          <span className="font-semibold">✓ Profile updated successfully! Changes saved to student record.</span>
          <button onClick={() => setSaveSuccess(false)} className="text-emerald-700 font-bold">&times;</button>
        </div>
      )}

      {/* Profile Card Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-800 relative" />
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
              <div className="w-full h-full rounded-xl bg-blue-600 text-white font-black text-3xl flex items-center justify-center">
                {user.name.charAt(0)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {user.department} &bull; {user.semester}
              </p>
              <p className="text-xs text-slate-400">@{user.username || user.email.split('@')[0]}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-slate-300 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>✏️</span>
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Academic Credentials */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Academic Standing</h3>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block">Target CGPA / Percentage</span>
              <span className="text-base font-bold text-slate-800">{user.targetCgpa || 8.8} / 10.0</span>
            </div>
            <div>
              <span className="text-slate-400 block">Current Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {user.status || 'Active Enrollment'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Registered Email</span>
              <span className="font-medium text-slate-700">{user.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Member Since</span>
              <span className="text-slate-600">{user.createdAt}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Earned Badges</h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-md">
                🔥 4-Day Streak
              </span>
              <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-1 rounded-md">
                ☕ Jakarta Master
              </span>
              <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-md">
                🎯 Goal Setter
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info or Edit Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Edit Academic Profile</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Degree / Course</label>
                  <input
                    type="text"
                    value={formData.course}
                    onChange={e => setFormData({ ...formData, course: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
                  <input
                    type="text"
                    value={formData.semester}
                    onChange={e => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target CGPA (out of 10.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={formData.targetCgpa}
                    onChange={e => setFormData({ ...formData, targetCgpa: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Personal Bio &amp; Career Aspirations</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer shadow-sm"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Academic Profile Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Department</span>
                  <span className="font-semibold text-slate-800">{user.department}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Degree Program</span>
                  <span className="font-semibold text-slate-800">{user.course} &bull; {user.semester}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contact Phone</span>
                  <span className="font-semibold text-slate-800">{user.phone || '+91 9876543210'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Student Username</span>
                  <span className="font-semibold text-slate-800">@{user.username || 'rahul'}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-700 mb-1">Bio &amp; Research Focus</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {user.bio || 'Aspiring software engineer dedicated to mastering core computer science.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
