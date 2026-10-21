import React, { useState } from 'react';
import { User } from '../types';

interface AuthModalsProps {
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  users: User[];
  onClose: () => void;
  onLogin: (user: User) => void;
  onRegister: (newUser: User) => void;
  onSwitchToRegister: () => void;
  onSwitchToLogin: () => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  isLoginOpen,
  isRegisterOpen,
  users,
  onClose,
  onLogin,
  onRegister,
  onSwitchToRegister,
  onSwitchToLogin
}) => {
  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('rahul@smarttracker.edu');
  const [loginPassword, setLoginPassword] = useState('rahul123');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDepartment, setRegDepartment] = useState('Computer Science & Engineering');
  const [regSemester, setRegSemester] = useState('6th Semester');
  const [regError, setRegError] = useState<string | null>(null);

  if (!isLoginOpen && !isRegisterOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const identifierClean = loginIdentifier.trim().toLowerCase();
    const foundUser = users.find(
      u => u.email.toLowerCase() === identifierClean || u.username.toLowerCase() === identifierClean
    );

    if (foundUser) {
      if (foundUser.status === 'SUSPENDED') {
        setLoginError('This account is suspended. Please contact the administrator.');
        return;
      }
      onLogin(foundUser);
      onClose();
    } else {
      setLoginError('Invalid username/email or password. Try one of the demo accounts below.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('Please complete all required fields.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    const emailTaken = users.some(u => u.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (emailTaken) {
      setRegError('An account with this email already exists.');
      return;
    }

    const usernameFinal = regUsername.trim() || regEmail.split('@')[0];
    const usernameTaken = users.some(u => u.username.toLowerCase() === usernameFinal.toLowerCase());
    if (usernameTaken) {
      setRegError('This username is already taken. Please pick another.');
      return;
    }

    const newUser: User = {
      id: Date.now(),
      name: regName.trim(),
      username: usernameFinal,
      email: regEmail.trim().toLowerCase(),
      role: 'STUDENT',
      phone: regPhone.trim() || '+91 9876543210',
      department: regDepartment,
      course: 'B.Tech',
      semester: regSemester,
      status: 'ACTIVE',
      targetCgpa: 8.5,
      bio: 'New student on Smart Learning Progress Tracker.',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onRegister(newUser);
    onClose();
  };

  const quickFill = (user: User) => {
    setLoginIdentifier(user.email);
    setLoginPassword(user.role === 'ADMIN' ? 'admin123' : 'pass123');
    onLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-blue-600 rounded-xl text-lg">🎓</span>
            <div>
              <h3 className="font-bold text-base">
                {isLoginOpen ? 'Sign In to Smart Tracker' : 'Student Registration'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isLoginOpen ? 'Access your personalized learning dashboard' : 'Join your university academic tracking portal'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer">
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoginOpen ? (
            <div>
              {loginError && (
                <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email or Username</label>
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. rahul@smarttracker.edu or rahul"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Sign In
                </button>
              </form>

              {/* Quick Preset Buttons for College Evaluation */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 text-center">
                  Instant Demo Login (1-Click)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => quickFill(users[1])}
                    className="p-2 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 cursor-pointer transition-colors"
                  >
                    <p className="text-[11px] font-bold text-blue-900">Rahul Kumar</p>
                    <p className="text-[9px] text-blue-600">Student (CSE)</p>
                  </button>
                  <button
                    onClick={() => quickFill(users[2])}
                    className="p-2 text-left bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 cursor-pointer transition-colors"
                  >
                    <p className="text-[11px] font-bold text-indigo-900">Priya Sharma</p>
                    <p className="text-[9px] text-indigo-600">Student (IT)</p>
                  </button>
                  <button
                    onClick={() => quickFill(users[0])}
                    className="p-2 text-left bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 cursor-pointer transition-colors"
                  >
                    <p className="text-[11px] font-bold text-slate-900">Administrator</p>
                    <p className="text-[9px] text-slate-600">Admin Role</p>
                  </button>
                </div>
              </div>

              <div className="mt-4 text-center text-xs text-slate-500">
                Don't have an account?{' '}
                <button
                  onClick={onSwitchToRegister}
                  className="text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Register here
                </button>
              </div>
            </div>
          ) : (
            <div>
              {regError && (
                <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg">
                  {regError}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="e.g. Rahul Kumar"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Username *</label>
                    <input
                      type="text"
                      value={regUsername}
                      onChange={e => setRegUsername(e.target.value)}
                      placeholder="e.g. rahul"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">College Email *</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="e.g. rahul@college.edu"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                    <select
                      value={regDepartment}
                      onChange={e => setRegDepartment(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                    >
                      <option value="Computer Science & Engineering">CSE</option>
                      <option value="Information Technology">IT</option>
                      <option value="AI & Data Science">AI &amp; DS</option>
                      <option value="Electronics & Communication">ECE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Year / Semester</label>
                    <select
                      value={regSemester}
                      onChange={e => setRegSemester(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                    >
                      <option value="1st Semester">Year 1 &bull; Sem 1</option>
                      <option value="2nd Semester">Year 1 &bull; Sem 2</option>
                      <option value="3rd Semester">Year 2 &bull; Sem 3</option>
                      <option value="4th Semester">Year 2 &bull; Sem 4</option>
                      <option value="5th Semester">Year 3 &bull; Sem 5</option>
                      <option value="6th Semester">Year 3 &bull; Sem 6</option>
                      <option value="7th Semester">Year 4 &bull; Sem 7</option>
                      <option value="8th Semester">Year 4 &bull; Sem 8</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-sm mt-3"
                >
                  Create Student Account
                </button>
              </form>

              <div className="mt-4 text-center text-xs text-slate-500">
                Already registered?{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
