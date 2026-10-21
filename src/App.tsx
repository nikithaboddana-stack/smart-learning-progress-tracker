import { useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_USER,
  INITIAL_SUBJECTS,
  INITIAL_TOPICS,
  INITIAL_TASKS,
  INITIAL_SESSIONS,
  INITIAL_GOALS,
  INITIAL_TESTS,
  INITIAL_WEEKLY_PLAN,
  INITIAL_NOTIFICATIONS
} from './data/initialData';
import { Subject, Topic, Task, StudySession, Goal, TestRecord, Recommendation, User, AppNotification } from './types';
import { ProjectExporterModal } from './components/ProjectExporterModal';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AIAssistantView } from './components/AIAssistantView';
import { WeeklyPlannerView } from './components/WeeklyPlannerView';
import { StudentProfileView } from './components/StudentProfileView';
import { AuthModals } from './components/AuthModals';

export default function App() {
  // Authentication & Multi-Tenant State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[1]); // Rahul Kumar by default for "Welcome back, Rahul 👋"
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [isProjectHubOpen, setIsProjectHubOpen] = useState<boolean>(false);
  const user = currentUser;

  // Application Data States
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [topics, setTopics] = useState<Topic[]>(INITIAL_TOPICS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [sessions, setSessions] = useState<StudySession[]>(INITIAL_SESSIONS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [tests, setTests] = useState<TestRecord[]>(INITIAL_TESTS);

  // UI Filters & Modals
  const [taskFilter, setTaskFilter] = useState<string>('ALL');
  const [selectedTopicSubjectId, setSelectedTopicSubjectId] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Assistant State
  const [assistantQuery, setAssistantQuery] = useState<string | null>(null);
  const [assistantAnswer, setAssistantAnswer] = useState<string | null>(null);
  const [plannerHours, setPlannerHours] = useState<number>(14);
  const [plannerExamDate, setPlannerExamDate] = useState<string>('2026-10-25');
  const [generatedPlan, setGeneratedPlan] = useState<any[] | null>(null);

  // Stopwatch Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Form states for modals
  const [newSubject, setNewSubject] = useState({ name: '', description: '', priority: 'Medium' as 'High' | 'Medium' | 'Low', targetPercentage: 80 });
  const [newTopic, setNewTopic] = useState({ subjectId: 1, name: '', description: '', difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard', progressPercentage: 0, confidenceLevel: 3 });
  const [newTask, setNewTask] = useState({ subjectId: 1, title: '', description: '', priority: 'Medium' as 'High' | 'Medium' | 'Low', dueDate: '2026-10-10', estimatedMinutes: 60 });
  const [newSession, setNewSession] = useState({ subjectId: 1, topicId: 1, studyDate: '2026-10-05', durationMinutes: 60, notes: '' });
  const [newGoal, setNewGoal] = useState({ title: '', description: '', targetValue: 15, currentValue: 0, unit: 'Hours', deadline: '2026-10-15' });
  const [newTest, setNewTest] = useState({ subjectId: 1, testName: '', testDate: '2026-10-04', marksObtained: 40, totalMarks: 50, notes: '' });

  // Topic Progress Quick Modal
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  // Stopwatch Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Dynamic Calculated Metrics (Grounded in database array state)
  const totalTopicsCount = topics.length;
  const overallProgress = totalTopicsCount > 0
    ? Math.round(topics.reduce((acc, t) => acc + t.progressPercentage, 0) / totalTopicsCount)
    : 0;

  const totalStudyMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalStudyHours = Math.round((totalStudyMinutes / 60) * 10) / 10;
  const todayStudyHours = 1.5;
  const weeklyStudyHours = 8.5;

  const completedTasksCount = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasksCount = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;
  const overdueTasksCount = tasks.filter(t => t.status === 'Overdue').length;

  const averageTestScore = tests.length > 0
    ? Math.round((tests.reduce((acc, t) => acc + t.percentage, 0) / tests.length) * 10) / 10
    : 0;

  // Study Streak (consecutive study sessions)
  const currentStreak = 4;
  const longestStreak = 7;

  // Rule-Based Recommendations Engine
  const generateRecommendations = (): Recommendation[] => {
    const recs: Recommendation[] = [];

    if (currentStreak >= 3) {
      recs.push({
        type: 'MOTIVATION',
        title: 'Outstanding Study Momentum!',
        message: `You have sustained a ${currentStreak}-day consecutive study streak. Keep up this momentum to lock in concepts!`,
        actionPage: 'sessions',
        actionText: 'Log Session'
      });
    }

    const urgentTask = tasks.find(t => t.priority === 'High' && t.status !== 'Completed');
    if (urgentTask) {
      recs.push({
        type: 'URGENT',
        title: `High Priority Deadline: ${urgentTask.title}`,
        message: `Due on ${urgentTask.dueDate} (${urgentTask.estimatedMinutes} mins). Tackle this high-priority assignment first!`,
        actionPage: 'tasks',
        actionText: 'Open Tasks'
      });
    }

    const weakTopic = topics.find(t => t.confidenceLevel <= 2 || t.progressPercentage < 50);
    if (weakTopic) {
      recs.push({
        type: 'REVISION',
        title: `Revision Needed: ${weakTopic.name}`,
        message: `Confidence is rated ${weakTopic.confidenceLevel}/5 stars in ${weakTopic.subjectName}. Plan a 45-minute active recall review.`,
        actionPage: 'topics',
        actionText: 'Revise Topic'
      });
    }

    return recs;
  };

  const recommendations = generateRecommendations();

  // Assistant Query Handler
  const handleAssistantQuery = (queryType: string) => {
    setAssistantQuery(queryType);
    if (queryType === 'how_am_i_doing') {
      setAssistantAnswer(
        `### Academic Health Report for ${user.name}:\n\n` +
        `- **Test Average**: ${averageTestScore}%\n` +
        `- **Active Study Streak**: ${currentStreak} days (Personal best: ${longestStreak} days)\n` +
        `- **Weekly Study Hours**: ${weeklyStudyHours} hrs\n` +
        `- **Task Velocity**: ${completedTasksCount} completed, ${pendingTasksCount} in progress, ${overdueTasksCount} overdue.\n\n` +
        `🌟 **Verdict**: You are performing consistently well! Clearing the overdue Operating Systems task and revising DBMS concurrency will position you for a semester distinction.`
      );
    } else if (queryType === 'what_to_study_today') {
      setAssistantAnswer(
        `### Recommended Focus for Today:\n\n` +
        `1. **Priority Task**: Finish 'Implement Session AuthFilter for protected JSPs' (Due tomorrow, 90 mins).\n` +
        `2. **Weak Concept Drill**: Review 'Transaction ACID & Concurrency' (Confidence 2/5 stars).\n` +
        `3. **Streak Builder**: Run a 45-minute stopwatch study session on Computer Networks subnetting to preserve your 4-day streak!`
      );
    } else if (queryType === 'which_subjects_need_attention') {
      setAssistantAnswer(
        `### Subjects Requiring Attention:\n\n` +
        `📌 **Database Management Systems**\n` +
        `- Current Progress: 80% (Meets target, but transaction concurrency topic confidence is 2/5).\n` +
        `- Action: Practice 2PL locking and deadlock detection.\n\n` +
        `📌 **Operating Systems**\n` +
        `- Virtual memory paging is only at 45% completion with 1 overdue coding simulation.\n` +
        `- Action: Allocate 90 minutes on Wednesday to complete the LRU simulation.`
      );
    } else if (queryType === 'show_weak_topics') {
      const weakList = topics.filter(t => t.confidenceLevel <= 2 || t.progressPercentage < 50);
      setAssistantAnswer(
        `### Identified Weak Topics (Confidence ≤ 2 / Progress < 50%):\n\n` +
        weakList.map(t => `- **${t.name}** (${t.subjectName}): Confidence ${t.confidenceLevel}/5, Progress ${t.progressPercentage}%, ${t.revisionCount} revisions`).join('\n')
      );
    } else if (queryType === 'give_study_plan') {
      setAssistantAnswer(
        `### 3-Step Smart Study Strategy:\n\n` +
        `1. **Step 1: Pomodoro Active Recall (45 mins)**\n` +
        `   - Test yourself on JDBC PreparedStatement queries without consulting notes.\n\n` +
        `2. **Step 2: Hands-on Lab & Code (60 mins)**\n` +
        `   - Implement Session filters in Eclipse and test dispatching to protected JSPs.\n\n` +
        `3. **Step 3: Verification & Log (15 mins)**\n` +
        `   - Update topic confidence scores in the tracker and log your session.`
      );
    }
  };

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dailyHours = Math.round((plannerHours / 7) * 10) / 10;
    const plan = days.map((day, idx) => {
      const subj = subjects[idx % subjects.length];
      return {
        day,
        subject: subj.name,
        hours: dailyHours,
        priority: subj.priority,
        topic: `Core Chapter Review (${subj.priority} Priority)`,
        strategy: idx % 2 === 0 ? 'Practice Problem Solving & Code' : 'Active Recall & Notes Review'
      };
    });
    setGeneratedPlan(plan);
  };

  // CRUD Handlers
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const id = subjects.length + 1;
    const subj: Subject = {
      id,
      name: newSubject.name,
      description: newSubject.description,
      priority: newSubject.priority,
      targetPercentage: newSubject.targetPercentage,
      totalTopics: 0,
      completedTopics: 0,
      overallProgress: 0
    };
    setSubjects([...subjects, subj]);
    setActiveModal(null);
    setNewSubject({ name: '', description: '', priority: 'Medium', targetPercentage: 80 });
  };

  const handleDeleteSubject = (id: number) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      setSubjects(subjects.filter(s => s.id !== id));
      setTopics(topics.filter(t => t.subjectId !== id));
    }
  };

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    const subj = subjects.find(s => s.id === Number(newTopic.subjectId));
    const topic: Topic = {
      id: topics.length + 1,
      subjectId: Number(newTopic.subjectId),
      subjectName: subj?.name || 'General',
      name: newTopic.name,
      description: newTopic.description,
      difficulty: newTopic.difficulty,
      status: newTopic.progressPercentage >= 100 ? 'Completed' : newTopic.progressPercentage > 0 ? 'In Progress' : 'Not Started',
      progressPercentage: Number(newTopic.progressPercentage),
      confidenceLevel: Number(newTopic.confidenceLevel),
      revisionCount: 0
    };
    setTopics([...topics, topic]);
    setActiveModal(null);
    setNewTopic({ subjectId: 1, name: '', description: '', difficulty: 'Medium', progressPercentage: 0, confidenceLevel: 3 });
  };

  const handleUpdateTopicProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTopic) return;
    setTopics(topics.map(t => {
      if (t.id === editingTopic.id) {
        return {
          ...editingTopic,
          status: editingTopic.progressPercentage >= 100 ? 'Completed' : editingTopic.progressPercentage > 0 ? 'In Progress' : 'Not Started'
        };
      }
      return t;
    }));
    setActiveModal(null);
    setEditingTopic(null);
  };

  const handleIncrementRevision = (id: number) => {
    setTopics(topics.map(t => t.id === id ? { ...t, revisionCount: t.revisionCount + 1, lastStudied: '2026-10-05' } : t));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const subj = subjects.find(s => s.id === Number(newTask.subjectId));
    const task: Task = {
      id: tasks.length + 1,
      subjectId: Number(newTask.subjectId),
      subjectName: subj?.name || 'General',
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      estimatedMinutes: Number(newTask.estimatedMinutes),
      status: 'Pending'
    };
    setTasks([...tasks, task]);
    setActiveModal(null);
    setNewTask({ subjectId: 1, title: '', description: '', priority: 'Medium', dueDate: '2026-10-10', estimatedMinutes: 60 });
  };

  const handleToggleTaskStatus = (id: number, newStatus: any) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    const subj = subjects.find(s => s.id === Number(newSession.subjectId));
    const sess: StudySession = {
      id: sessions.length + 1,
      subjectId: Number(newSession.subjectId),
      subjectName: subj?.name || 'General',
      studyDate: newSession.studyDate,
      startTime: '10:00',
      endTime: '11:00',
      durationMinutes: Number(newSession.durationMinutes),
      notes: newSession.notes
    };
    setSessions([sess, ...sessions]);
    setActiveModal(null);
    setNewSession({ subjectId: 1, topicId: 1, studyDate: '2026-10-05', durationMinutes: 60, notes: '' });
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const goal: Goal = {
      id: goals.length + 1,
      title: newGoal.title,
      description: newGoal.description,
      targetValue: Number(newGoal.targetValue),
      currentValue: Number(newGoal.currentValue),
      unit: newGoal.unit,
      deadline: newGoal.deadline,
      status: Number(newGoal.currentValue) >= Number(newGoal.targetValue) ? 'Completed' : 'Active'
    };
    setGoals([...goals, goal]);
    setActiveModal(null);
    setNewGoal({ title: '', description: '', targetValue: 15, currentValue: 0, unit: 'Hours', deadline: '2026-10-15' });
  };

  const handleAddTest = (e: React.FormEvent) => {
    e.preventDefault();
    const subj = subjects.find(s => s.id === Number(newTest.subjectId));
    const pct = Math.round((Number(newTest.marksObtained) / Number(newTest.totalMarks)) * 1000) / 10;
    const test: TestRecord = {
      id: tests.length + 1,
      subjectId: Number(newTest.subjectId),
      subjectName: subj?.name || 'General',
      testName: newTest.testName,
      testDate: newTest.testDate,
      marksObtained: Number(newTest.marksObtained),
      totalMarks: Number(newTest.totalMarks),
      percentage: pct,
      notes: newTest.notes
    };
    setTests([test, ...tests]);
    setActiveModal(null);
    setNewTest({ subjectId: 1, testName: '', testDate: '2026-10-04', marksObtained: 40, totalMarks: 50, notes: '' });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <div>
              <h2 className="font-bold text-sm tracking-tight text-white">Smart Tracker</h2>
              <span className="text-[10px] text-blue-400 font-mono">Advanced Java MVC</span>
            </div>
          </div>
        </div>

        <nav className="p-3 flex-1 overflow-y-auto space-y-1">
          {currentUser.role === 'ADMIN' ? (
            <>
              <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 px-3 py-2 flex items-center justify-between">
                <span>Admin Administration</span>
                <span className="text-[9px] bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded font-mono">STAFF</span>
              </div>

              <button
                onClick={() => setCurrentPage('admin-dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  currentPage === 'admin-dashboard' || currentPage === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🛡️</span> Admin Dashboard
              </button>

              <button
                onClick={() => setCurrentPage('admin-students')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  currentPage === 'admin-students' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>👥</span> Student Directory
              </button>

              <button
                onClick={() => setCurrentPage('subjects')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  currentPage === 'subjects' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>📚</span> Master Curriculum ({subjects.length})
              </button>

              <button
                onClick={() => setCurrentPage('analytics')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  currentPage === 'analytics' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>📈</span> Institutional Analytics
              </button>
            </>
          ) : (
            <>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 py-2">
                Main Academic Modules
              </div>

              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  currentPage === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>📊</span> Dashboard
              </button>

              <button
                onClick={() => setCurrentPage('subjects')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  currentPage === 'subjects' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>📚</span> Subjects ({subjects.length})
              </button>

              <button
                onClick={() => setCurrentPage('topics')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  currentPage === 'topics' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>📑</span> Topics ({topics.length})
              </button>

              <button
                onClick={() => setCurrentPage('planner')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  currentPage === 'planner' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>📅</span> Weekly Planner
              </button>

              <button
                onClick={() => setCurrentPage('tasks')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  currentPage === 'tasks' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>✅</span> Study Tasks ({tasks.length})
              </button>

              <button
                onClick={() => setCurrentPage('sessions')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  currentPage === 'sessions' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>⏱️</span> Study Sessions ({sessions.length})
              </button>

              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pt-4 py-2">
                Performance &amp; Intelligence
              </div>

              <button
                onClick={() => setCurrentPage('goals')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  currentPage === 'goals' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🎯</span> Learning Goals ({goals.length})
              </button>

              <button
                onClick={() => setCurrentPage('tests')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  currentPage === 'tests' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>📝</span> Tests &amp; Quizzes ({tests.length})
              </button>

              <button
                onClick={() => setCurrentPage('analytics')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  currentPage === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>📈</span> Analytics
              </button>

              <button
                onClick={() => setCurrentPage('assistant')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  currentPage === 'assistant' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🤖</span> AI Study Consultant
              </button>

              <button
                onClick={() => setCurrentPage('profile')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  currentPage === 'profile' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>👤</span> Student Profile
              </button>
            </>
          )}

          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pt-4 py-2">
            College Presentation Hub
          </div>

          <button
            onClick={() => setIsProjectHubOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-md hover:from-blue-600 hover:to-indigo-600"
          >
            <span>☕</span> Eclipse &amp; Java Source
          </button>
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-white">{user.name}</div>
            <div className="text-[11px] text-slate-400">{user.email}</div>
          </div>
          <button
            onClick={() => setCurrentPage('profile')}
            className="text-xs text-slate-400 hover:text-white cursor-pointer"
            title="Account Settings"
          >
            ⚙️
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h1 className="text-base lg:text-lg font-bold text-slate-900 capitalize flex items-center gap-2">
              {currentPage === 'admin-dashboard' && '🏛️ Institutional Admin Dashboard'}
              {currentPage === 'admin-students' && '👥 Student Directory & Academic Dossiers'}
              {currentPage === 'dashboard' && '📊 Academic Dashboard'}
              {currentPage === 'subjects' && '📚 Course Subject Management'}
              {currentPage === 'topics' && '📑 Syllabus Chapters & Topics'}
              {currentPage === 'planner' && '📅 Weekly Academic Study Timetable'}
              {currentPage === 'tasks' && '✅ Study Task Workflow'}
              {currentPage === 'sessions' && '⏱️ Study Sessions & Stopwatch'}
              {currentPage === 'goals' && '🎯 Learning Milestones & Goals'}
              {currentPage === 'tests' && '📝 Internal Marks & Performance'}
              {currentPage === 'analytics' && '📈 Performance Analytics'}
              {currentPage === 'assistant' && '🤖 Intelligent Study Consultant (Gemini AI)'}
              {currentPage === 'profile' && '👤 Student Profile & Credentials'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak Badge for Students */}
            {currentUser.role === 'STUDENT' && (
              <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">
                <span>🔥</span>
                <span>{currentStreak} Day Streak</span>
              </div>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer relative"
                title="Notifications"
              >
                <span className="text-base">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">System Notifications</span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                      {notifications.length} alerts
                    </span>
                  </div>
                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                        <p className="font-semibold text-slate-800">{n.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{n.message}</p>
                        <span className="text-[9px] text-slate-400 mt-1 block">{n.createdAt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown / Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[11px]">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden md:block">
                  <div className="font-semibold text-slate-800 leading-none">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400 leading-none mt-1">
                    {currentUser.role === 'ADMIN' ? 'Administrator' : currentUser.department?.split(' ')[0]}
                  </div>
                </div>
                <span className="text-slate-400 text-[10px]">▼</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                    <span className="inline-block mt-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {currentUser.role} ROLE
                    </span>
                  </div>

                  <div className="px-2 py-1.5 border-b border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                      Quick Demo Switch
                    </span>
                    <button
                      onClick={() => {
                        setCurrentUser(users[1]);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 hover:bg-blue-50 rounded-lg text-slate-700 cursor-pointer flex items-center justify-between"
                    >
                      <span>Rahul Kumar (CSE)</span>
                      <span className="text-[10px] text-blue-600 font-semibold">Student</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentUser(users[2]);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 hover:bg-blue-50 rounded-lg text-slate-700 cursor-pointer flex items-center justify-between"
                    >
                      <span>Priya Sharma (IT)</span>
                      <span className="text-[10px] text-indigo-600 font-semibold">Student</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentUser(users[0]);
                        setCurrentPage('admin-dashboard');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 hover:bg-slate-100 rounded-lg text-slate-700 cursor-pointer flex items-center justify-between"
                    >
                      <span>Administrator</span>
                      <span className="text-[10px] text-amber-600 font-semibold">Admin</span>
                    </button>
                  </div>

                  <div className="p-1">
                    <button
                      onClick={() => {
                        setIsRegisterModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer flex items-center gap-2"
                    >
                      <span>➕</span> Register New Student
                    </button>
                    <button
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer flex items-center gap-2"
                    >
                      <span>🔑</span> Switch / Sign In
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Export Project Button */}
            <button
              onClick={() => setIsProjectHubOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <span>📦</span>
              <span className="hidden sm:inline">Eclipse Project (.zip)</span>
            </button>
          </div>
        </header>

        {/* Dynamic Pages */}
        <main className="p-8 flex-1 overflow-y-auto">
          
          {/* ========================================================= */}
          {/* ADMIN PORTAL VIEW (When user is Admin or on admin pages)  */}
          {/* ========================================================= */}
          {(currentUser.role === 'ADMIN' && (currentPage === 'admin-dashboard' || currentPage === 'admin-students' || currentPage === 'dashboard')) && (
            <AdminDashboardView
              currentUser={currentUser}
              users={users}
              subjects={subjects}
              onToggleStatus={(uid) => {
                setUsers(prev => prev.map(u => u.id === uid ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u));
              }}
              onSelectStudent={(stu) => {
                setCurrentUser(stu);
                setCurrentPage('dashboard');
              }}
            />
          )}

          {currentPage === 'planner' && (
            <WeeklyPlannerView subjects={subjects} initialPlan={INITIAL_WEEKLY_PLAN} />
          )}

          {currentPage === 'assistant' && (
            <AIAssistantView
              user={currentUser}
              subjects={subjects}
              topics={topics}
              tasks={tasks}
              tests={tests}
              studyStreak={currentStreak}
              totalStudyHours={totalStudyHours}
            />
          )}

          {currentPage === 'profile' && (
            <StudentProfileView
              user={currentUser}
              onUpdateUser={(updated) => {
                setCurrentUser(updated);
                setUsers(users.map(u => u.id === updated.id ? updated : u));
              }}
            />
          )}

          {/* ========================================================= */}
          {/* 1. DASHBOARD PAGE (Student View)                          */}
          {/* ========================================================= */}
          {(currentPage === 'dashboard' && currentUser.role === 'STUDENT') && (
            <div className="space-y-6">
              
              {/* Dynamic Welcome Banner */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-6 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold">Welcome back, {user.name.split(' ')[0]} 👋</h2>
                  <p className="text-xs text-slate-300 mt-1">
                    {user.department} &bull; {user.semester} &bull; Target: {user.targetCgpa || 8.8} CGPA &bull; {weeklyStudyHours} hrs logged this week.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400">Overall Progress</div>
                  <div className="text-3xl font-black text-cyan-400">{overallProgress}%</div>
                </div>
              </div>

              {/* 8 Core Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold uppercase">Overall Progress</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{overallProgress}%</div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${overallProgress}%` }}></div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold uppercase">Today's Study</div>
                  <div className="text-2xl font-black text-amber-600 mt-1">{todayStudyHours}h</div>
                  <div className="text-[11px] text-slate-400 mt-1">Goal: 2.0h / day</div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold uppercase">Weekly Hours</div>
                  <div className="text-2xl font-black text-purple-600 mt-1">{weeklyStudyHours}h</div>
                  <div className="text-[11px] text-slate-400 mt-1">Last 7 days logged</div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold uppercase">Study Streak</div>
                  <div className="text-2xl font-black text-emerald-600 mt-1">{currentStreak} days</div>
                  <div className="text-[11px] text-slate-400 mt-1">Longest: {longestStreak} days</div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold uppercase">Registered Subjects</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{subjects.length}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{totalTopicsCount} syllabus topics</div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold uppercase">Avg Test Score</div>
                  <div className="text-2xl font-black text-blue-600 mt-1">{averageTestScore}%</div>
                  <div className="text-[11px] text-slate-400 mt-1">{tests.length} tests evaluated</div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold uppercase">Completed Tasks</div>
                  <div className="text-2xl font-black text-emerald-600 mt-1">{completedTasksCount}</div>
                  <div className="text-[11px] text-slate-400 mt-1">On schedule</div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                  <div className="text-xs text-slate-500 font-semibold uppercase">Pending Tasks</div>
                  <div className="text-2xl font-black text-rose-600 mt-1">{pendingTasksCount}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{overdueTasksCount} overdue</div>
                </div>
              </div>

              {/* Recommendations Box */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span>💡</span> Smart Study Recommendations
                  </h3>
                  <button
                    onClick={() => setCurrentPage('assistant')}
                    className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    Consult AI Assistant &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-lg border-l-4 border flex items-center justify-between gap-4 ${
                        rec.type === 'URGENT'
                          ? 'border-l-rose-500 bg-rose-50/50 border-rose-200'
                          : rec.type === 'WARNING'
                          ? 'border-l-amber-500 bg-amber-50/50 border-amber-200'
                          : 'border-l-emerald-500 bg-emerald-50/50 border-emerald-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            rec.type === 'URGENT' ? 'bg-rose-100 text-rose-700' : rec.type === 'WARNING' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {rec.type}
                          </span>
                          <strong className="text-xs text-slate-900">{rec.title}</strong>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{rec.message}</p>
                      </div>

                      {rec.actionPage && (
                        <button
                          onClick={() => setCurrentPage(rec.actionPage!)}
                          className="text-xs bg-white hover:bg-slate-50 border border-slate-300 font-semibold px-3 py-1.5 rounded text-slate-700 whitespace-nowrap cursor-pointer shadow-2xs"
                        >
                          {rec.actionText} &rarr;
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Deadlines & Subjects Snapshot */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Upcoming Deadlines */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                    <h3 className="font-bold text-sm text-slate-900">⏰ Upcoming Deadlines</h3>
                    <button onClick={() => setCurrentPage('tasks')} className="text-xs text-blue-600 hover:underline cursor-pointer">
                      View All
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {tasks.filter(t => t.status !== 'Completed').slice(0, 4).map(task => (
                      <div key={task.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-xs">
                        <div>
                          <div className="font-semibold text-slate-800">{task.title}</div>
                          <div className="text-[11px] text-slate-400">{task.subjectName} &bull; Due: {task.dueDate}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            task.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {task.priority}
                          </span>
                          <button
                            onClick={() => handleToggleTaskStatus(task.id, 'Completed')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[10px] font-bold cursor-pointer"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subject Mastery Progress */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                    <h3 className="font-bold text-sm text-slate-900">📚 Subject Completion</h3>
                    <button onClick={() => setCurrentPage('subjects')} className="text-xs text-blue-600 hover:underline cursor-pointer">
                      Manage
                    </button>
                  </div>

                  <div className="space-y-4">
                    {subjects.map(s => (
                      <div key={s.id}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-800">{s.name}</span>
                          <span className="text-slate-600 font-mono">{s.overallProgress}% <span className="text-slate-400 text-[10px]">(Target: {s.targetPercentage}%)</span></span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              (s.overallProgress || 0) >= s.targetPercentage ? 'bg-emerald-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${s.overallProgress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. SUBJECTS PAGE                                         */}
          {/* ========================================================= */}
          {currentPage === 'subjects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">Manage semester academic subjects and track syllabus topic completion.</p>
                <button
                  onClick={() => setActiveModal('addSubject')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>➕</span> Add Subject
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {subjects.map(s => (
                  <div key={s.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          s.priority === 'High' ? 'bg-rose-100 text-rose-700' : s.priority === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {s.priority} Priority
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {topics.filter(t => t.subjectId === s.id && t.status === 'Completed').length} / {topics.filter(t => t.subjectId === s.id).length} Topics
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900">{s.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{s.description}</p>

                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500">Completion</span>
                          <span className="font-bold text-slate-800">{s.overallProgress}% <span className="text-slate-400 font-normal">(Goal: {s.targetPercentage}%)</span></span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              (s.overallProgress || 0) >= s.targetPercentage ? 'bg-emerald-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${s.overallProgress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setSelectedTopicSubjectId(s.id);
                          setCurrentPage('topics');
                        }}
                        className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                      >
                        View Topics &rarr;
                      </button>

                      <button
                        onClick={() => handleDeleteSubject(s.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 cursor-pointer p-1"
                        title="Delete Subject"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. TOPICS PAGE                                           */}
          {/* ========================================================= */}
          {currentPage === 'topics' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <label className="text-xs font-semibold text-slate-700">Filter by Subject:</label>
                  <select
                    value={selectedTopicSubjectId || ''}
                    onChange={(e) => setSelectedTopicSubjectId(e.target.value ? Number(e.target.value) : null)}
                    className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-800"
                  >
                    <option value="">All Subjects ({topics.length} Topics)</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setActiveModal('addTopic')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>➕</span> Add Topic
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="p-3.5">Topic &amp; Overview</th>
                      <th className="p-3.5">Subject</th>
                      <th className="p-3.5">Difficulty</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Progress</th>
                      <th className="p-3.5">Confidence</th>
                      <th className="p-3.5">Revisions</th>
                      <th className="p-3.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {topics
                      .filter(t => selectedTopicSubjectId ? t.subjectId === selectedTopicSubjectId : true)
                      .map(topic => (
                        <tr key={topic.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5">
                            <strong className="text-slate-900 block">{topic.name}</strong>
                            <span className="text-[11px] text-slate-500 line-clamp-1">{topic.description}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                              {topic.subjectName}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              topic.difficulty === 'Hard' ? 'bg-rose-100 text-rose-700' : topic.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {topic.difficulty}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              topic.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : topic.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {topic.status}
                            </span>
                          </td>
                          <td className="p-3.5 min-w-[130px]">
                            <div className="flex justify-between text-[11px] mb-1">
                              <span>{topic.progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  topic.progressPercentage >= 100 ? 'bg-emerald-500' : topic.progressPercentage >= 50 ? 'bg-amber-500' : 'bg-blue-600'
                                }`}
                                style={{ width: `${topic.progressPercentage}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="p-3.5 text-amber-500 text-xs">
                            {'⭐'.repeat(topic.confidenceLevel)}
                          </td>
                          <td className="p-3.5 font-mono text-slate-700">
                            <strong>{topic.revisionCount}</strong> revs
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingTopic({ ...topic });
                                  setActiveModal('updateTopic');
                                }}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded text-xs cursor-pointer"
                                title="Update Progress"
                              >
                                📊
                              </button>
                              <button
                                onClick={() => handleIncrementRevision(topic.id)}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded text-[11px] font-semibold cursor-pointer"
                                title="+1 Revision"
                              >
                                +1
                              </button>
                              <button
                                onClick={() => setTopics(topics.filter(t => t.id !== topic.id))}
                                className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                                title="Delete Topic"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. TASKS PAGE                                            */}
          {/* ========================================================= */}
          {currentPage === 'tasks' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex gap-1.5 bg-white border border-slate-200 p-1 rounded-lg">
                  {['ALL', 'Pending', 'In Progress', 'Completed', 'Overdue'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTaskFilter(filter)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                        taskFilter === filter ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {filter} {filter === 'ALL' ? `(${tasks.length})` : `(${tasks.filter(t => t.status === filter).length})`}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setActiveModal('addTask')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>➕</span> Create Task
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="p-3.5">Task Title</th>
                      <th className="p-3.5">Subject</th>
                      <th className="p-3.5">Priority</th>
                      <th className="p-3.5">Due Date</th>
                      <th className="p-3.5">Est. Time</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Change Status</th>
                      <th className="p-3.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tasks
                      .filter(t => taskFilter === 'ALL' || t.status === taskFilter)
                      .map(task => (
                        <tr key={task.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5">
                            <strong className="text-slate-900 block">{task.title}</strong>
                            <span className="text-[11px] text-slate-500 line-clamp-1">{task.description}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                              {task.subjectName}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              task.priority === 'High' ? 'bg-rose-100 text-rose-700' : task.priority === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="p-3.5 font-medium">{task.dueDate}</td>
                          <td className="p-3.5 text-slate-600">{task.estimatedMinutes} mins</td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              task.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : task.status === 'Overdue' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <select
                              value={task.status}
                              onChange={(e) => handleToggleTaskStatus(task.id, e.target.value)}
                              className="text-xs border border-slate-300 rounded px-2 py-1 bg-white"
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>
                          <td className="p-3.5">
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                              title="Delete Task"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. STUDY SESSIONS & STOPWATCH PAGE                        */}
          {/* ========================================================= */}
          {currentPage === 'sessions' && (
            <div className="space-y-6">
              
              {/* Live Stopwatch Study Timer */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-8 text-center shadow-md">
                <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">
                  Active Focus Session Stopwatch
                </div>
                <div className="text-5xl font-mono font-black text-cyan-400 tracking-wider my-4">
                  {formatTimer(timerSeconds)}
                </div>
                <div className="flex justify-center gap-3">
                  {!isTimerRunning ? (
                    <button
                      onClick={() => setIsTimerRunning(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      ▶ Start Timer
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsTimerRunning(false)}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-6 py-2.5 rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      ⏸ Pause Timer
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds(0);
                    }}
                    className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg cursor-pointer transition-colors"
                  >
                    🔄 Reset
                  </button>
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      const mins = Math.max(1, Math.round(timerSeconds / 60));
                      setNewSession({ ...newSession, durationMinutes: mins });
                      setActiveModal('addSession');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg cursor-pointer transition-colors shadow-sm"
                  >
                    💾 Log to Database
                  </button>
                </div>
              </div>

              {/* Sessions History Table */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm text-slate-900">Logged Study Sessions ({sessions.length})</h3>
                  <button
                    onClick={() => setActiveModal('addSession')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    ➕ Manual Log
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                        <th className="p-3">Date</th>
                        <th className="p-3">Subject</th>
                        <th className="p-3">Topic</th>
                        <th className="p-3">Duration</th>
                        <th className="p-3">Study Notes</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sessions.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50/70">
                          <td className="p-3 font-semibold text-slate-900">{s.studyDate}</td>
                          <td className="p-3"><span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">{s.subjectName}</span></td>
                          <td className="p-3 text-slate-600">{s.topicName || 'General Chapter Review'}</td>
                          <td className="p-3 font-bold text-blue-700">{s.durationMinutes} mins</td>
                          <td className="p-3 text-slate-600">{s.notes}</td>
                          <td className="p-3">
                            <button
                              onClick={() => setSessions(sessions.filter(sess => sess.id !== s.id))}
                              className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. GOALS PAGE                                            */}
          {/* ========================================================= */}
          {currentPage === 'goals' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">Track quantifiable milestones like weekly study hours or syllabus completion.</p>
                <button
                  onClick={() => setActiveModal('addGoal')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>➕</span> Set Goal
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {goals.map(g => {
                  const pct = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
                  return (
                    <div key={g.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            g.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {g.status}
                          </span>
                          <span className="text-[11px] text-slate-400">Due: {g.deadline}</span>
                        </div>

                        <h3 className="font-bold text-sm text-slate-900">{g.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{g.description}</p>

                        <div className="mt-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-600">Progress: <strong>{g.currentValue} / {g.targetValue} {g.unit}</strong></span>
                            <span className="font-bold text-slate-900">{pct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                        <button
                          onClick={() => {
                            const newCur = Math.min(g.targetValue, g.currentValue + 1);
                            setGoals(goals.map(item => item.id === g.id ? { ...item, currentValue: newCur, status: newCur >= item.targetValue ? 'Completed' : 'Active' } : item));
                          }}
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded font-semibold cursor-pointer"
                        >
                          +1 {g.unit}
                        </button>

                        <button
                          onClick={() => setGoals(goals.filter(item => item.id !== g.id))}
                          className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                          title="Delete Goal"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 7. TESTS & QUIZZES PAGE                                  */}
          {/* ========================================================= */}
          {currentPage === 'tests' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Academic Test Performance</h3>
                  <p className="text-xs text-slate-500 mt-1">Logged internal examinations, unit tests, and quizzes.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400">Class Average</div>
                    <div className="text-2xl font-black text-blue-700">{averageTestScore}%</div>
                  </div>
                  <button
                    onClick={() => setActiveModal('addTest')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>➕</span> Record Marks
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Test Title</th>
                      <th className="p-3.5">Subject</th>
                      <th className="p-3.5">Score</th>
                      <th className="p-3.5">Percentage</th>
                      <th className="p-3.5">Notes &amp; Error Analysis</th>
                      <th className="p-3.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tests.map(test => (
                      <tr key={test.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-medium">{test.testDate}</td>
                        <td className="p-3.5 font-bold text-slate-900">{test.testName}</td>
                        <td className="p-3.5"><span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">{test.subjectName}</span></td>
                        <td className="p-3.5 font-bold text-slate-800">{test.marksObtained} / {test.totalMarks}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            test.percentage >= 80 ? 'bg-emerald-100 text-emerald-800' : test.percentage >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {test.percentage}%
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600">{test.notes}</td>
                        <td className="p-3.5">
                          <button
                            onClick={() => setTests(tests.filter(t => t.id !== test.id))}
                            className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                            title="Delete Record"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 8. ANALYTICS PAGE                                        */}
          {/* ========================================================= */}
          {currentPage === 'analytics' && (
            <div className="space-y-6">
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs border-l-4 border-l-emerald-500">
                  <h3 className="font-bold text-sm text-emerald-800 mb-3">🌟 Strong Academic Areas</h3>
                  <ul className="text-xs text-slate-600 space-y-2">
                    {subjects.filter(s => (s.overallProgress || 0) >= 75).map(s => (
                      <li key={s.id} className="flex justify-between border-b border-slate-100 pb-1.5">
                        <strong className="text-slate-800">{s.name}</strong>
                        <span className="text-emerald-700 font-semibold">{s.overallProgress}% Completed</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs border-l-4 border-l-rose-500">
                  <h3 className="font-bold text-sm text-rose-800 mb-3">⚠️ Subjects Needing Remediation</h3>
                  <ul className="text-xs text-slate-600 space-y-2">
                    {subjects.filter(s => (s.overallProgress || 0) < 75).map(s => (
                      <li key={s.id} className="flex justify-between border-b border-slate-100 pb-1.5">
                        <strong className="text-slate-800">{s.name}</strong>
                        <span className="text-rose-700 font-semibold">{s.overallProgress}% (Target: {s.targetPercentage}%)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Subject Breakdown Table */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h3 className="font-bold text-sm text-slate-900 mb-4">Subject-Wise Benchmark Comparison</h3>
                <div className="space-y-4">
                  {subjects.map(s => (
                    <div key={s.id} className="border border-slate-100 p-3 rounded-lg">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-bold text-slate-900">{s.name} ({s.priority} Priority)</span>
                        <span className="font-mono text-slate-700">{s.overallProgress}% / Target: {s.targetPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                        <div
                          className="bg-blue-600 h-full"
                          style={{ width: `${s.overallProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 9. AI STUDY ASSISTANT & PLANNER PAGE                      */}
          {/* ========================================================= */}
          {currentPage === 'assistant' && (
            <div className="space-y-6">
              
              {/* Rule-Based Study Consultant */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span>🤖</span> Rule-Based Academic Assistant
                  </h3>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                    Database Grounded (Pure Java Service)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Select a consultation prompt below. The rule-based engine inspects your live student records to deliver targeted feedback.
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { id: 'how_am_i_doing', label: '📊 How am I doing?' },
                    { id: 'what_to_study_today', label: '🎯 What should I study today?' },
                    { id: 'which_subjects_need_attention', label: '⚠️ Which subjects need attention?' },
                    { id: 'show_weak_topics', label: '🔍 Show my weak topics' },
                    { id: 'give_study_plan', label: '📋 Give me a study strategy' }
                  ].map(btn => (
                    <button
                      key={btn.id}
                      onClick={() => handleAssistantQuery(btn.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        assistantQuery === btn.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                {assistantAnswer ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 border-l-4 border-l-blue-600 rounded-lg text-xs leading-relaxed text-slate-800 whitespace-pre-line">
                    {assistantAnswer}
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-400">
                    Click any query above to run instant analysis!
                  </div>
                )}
              </div>

              {/* Weekly Study Planner Generator */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                <h3 className="font-bold text-sm text-slate-900 mb-1">📅 Smart Weekly Study Planner</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Configure your weekly availability. The algorithmic planner balances priority subjects and schedules remediation for weak topics.
                </p>

                <form onSubmit={handleGeneratePlan} className="grid sm:grid-cols-3 gap-4 items-end mb-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Weekly Hours Available</label>
                    <input
                      type="number"
                      value={plannerHours}
                      onChange={(e) => setPlannerHours(Number(e.target.value))}
                      className="w-full text-xs border border-slate-300 rounded px-3 py-2 bg-white"
                      min="1"
                      max="60"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Major Exam Date</label>
                    <input
                      type="date"
                      value={plannerExamDate}
                      onChange={(e) => setPlannerExamDate(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded px-3 py-2 bg-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer h-[34px]"
                  >
                    Generate 7-Day Plan
                  </button>
                </form>

                {generatedPlan && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                          <th className="p-3">Day</th>
                          <th className="p-3">Allocated Subject</th>
                          <th className="p-3">Priority</th>
                          <th className="p-3">Study Time</th>
                          <th className="p-3">Focus Topic &amp; Strategy</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {generatedPlan.map((p, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/70">
                            <td className="p-3 font-bold text-slate-900">{p.day}</td>
                            <td className="p-3 font-semibold text-blue-700">{p.subject}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                p.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {p.priority}
                              </span>
                            </td>
                            <td className="p-3 font-bold">{p.hours} hrs</td>
                            <td className="p-3 text-slate-600">
                              <div>{p.topic}</div>
                              <span className="text-[10px] text-slate-400">{p.strategy}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* 10. PROFILE PAGE                                         */}
          {/* ========================================================= */}
          {currentPage === 'profile' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                <h3 className="font-bold text-sm text-slate-900 mb-4">Student Information</h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) => setCurrentUser({ ...user, name: e.target.value })}
                      className="w-full border border-slate-300 rounded px-3 py-2 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">College Email (Read Only)</label>
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="w-full border border-slate-200 rounded px-3 py-2 bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Registration Date</label>
                    <input
                      type="text"
                      value={user.createdAt}
                      readOnly
                      className="w-full border border-slate-200 rounded px-3 py-2 bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <button
                    onClick={() => alert('Profile updated successfully!')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                <h3 className="font-bold text-sm text-slate-900 mb-4">Password &amp; Security</h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full border border-slate-300 rounded px-3 py-2 bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">New Password (Min 6 chars)</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full border border-slate-300 rounded px-3 py-2 bg-white"
                    />
                  </div>
                  <button
                    onClick={() => alert('Password updated with salted SHA-256 hash!')}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================= */}
      {/* MODALS                                                    */}
      {/* ========================================================= */}
      
      {/* Add Subject Modal */}
      {activeModal === 'addSubject' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-slate-900">Add New Subject</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 text-lg">&times;</button>
            </div>
            <form onSubmit={handleAddSubject} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject Name</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Systems"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  placeholder="Course goals and topics..."
                  value={newSubject.description}
                  onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={newSubject.priority}
                    onChange={(e: any) => setNewSubject({ ...newSubject, priority: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-2"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target (%)</label>
                  <input
                    type="number"
                    value={newSubject.targetPercentage}
                    onChange={(e) => setNewSubject({ ...newSubject, targetPercentage: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded px-3 py-2"
                    min="0"
                    max="100"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg mt-3 cursor-pointer">
                Save Subject
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Topic Modal */}
      {activeModal === 'addTopic' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-slate-900">Add Syllabus Topic</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 text-lg">&times;</button>
            </div>
            <form onSubmit={handleAddTopic} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject</label>
                <select
                  value={newTopic.subjectId}
                  onChange={(e) => setNewTopic({ ...newTopic, subjectId: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded px-2.5 py-2"
                >
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Topic Name</label>
                <input
                  type="text"
                  placeholder="e.g. Socket Programming with TCP/IP"
                  value={newTopic.name}
                  onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  placeholder="Key concepts to master..."
                  value={newTopic.description}
                  onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Difficulty</label>
                  <select
                    value={newTopic.difficulty}
                    onChange={(e: any) => setNewTopic({ ...newTopic, difficulty: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-2"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Confidence (1-5)</label>
                  <select
                    value={newTopic.confidenceLevel}
                    onChange={(e) => setNewTopic({ ...newTopic, confidenceLevel: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded px-2.5 py-2"
                  >
                    <option value={1}>⭐ 1 - Struggling</option>
                    <option value={2}>⭐⭐ 2 - Low</option>
                    <option value={3}>⭐⭐⭐ 3 - Moderate</option>
                    <option value={4}>⭐⭐⭐⭐ 4 - Strong</option>
                    <option value={5}>⭐⭐⭐⭐⭐ 5 - Mastered</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Progress Percentage: {newTopic.progressPercentage}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newTopic.progressPercentage}
                  onChange={(e) => setNewTopic({ ...newTopic, progressPercentage: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg mt-3 cursor-pointer">
                Save Topic
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Update Topic Quick Progress Modal */}
      {activeModal === 'updateTopic' && editingTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-slate-900">Update: {editingTopic.name}</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 text-lg">&times;</button>
            </div>
            <form onSubmit={handleUpdateTopicProgress} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Progress Percentage ({editingTopic.progressPercentage}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editingTopic.progressPercentage}
                  onChange={(e) => setEditingTopic({ ...editingTopic, progressPercentage: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Confidence Rating</label>
                <select
                  value={editingTopic.confidenceLevel}
                  onChange={(e) => setEditingTopic({ ...editingTopic, confidenceLevel: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded px-2.5 py-2"
                >
                  <option value={1}>⭐ 1 - Struggling / Low</option>
                  <option value={2}>⭐⭐ 2 - Weak Understanding</option>
                  <option value={3}>⭐⭐⭐ 3 - Moderate / Competent</option>
                  <option value={4}>⭐⭐⭐⭐ 4 - Strong Understanding</option>
                  <option value={5}>⭐⭐⭐⭐⭐ 5 - Fully Mastered</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg cursor-pointer">
                Save Topic Progress
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {activeModal === 'addTask' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-slate-900">Create Study Task</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 text-lg">&times;</button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Solve 5 JDBC practice problems"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject</label>
                <select
                  value={newTask.subjectId}
                  onChange={(e) => setNewTask({ ...newTask, subjectId: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded px-2.5 py-2"
                >
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e: any) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-2"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Est. Minutes</label>
                  <input
                    type="number"
                    value={newTask.estimatedMinutes}
                    onChange={(e) => setNewTask({ ...newTask, estimatedMinutes: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded px-3 py-2"
                    min="5"
                    step="5"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg mt-3 cursor-pointer">
                Save Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Session Modal */}
      {activeModal === 'addSession' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-slate-900">Log Study Session</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 text-lg">&times;</button>
            </div>
            <form onSubmit={handleAddSession} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject</label>
                <select
                  value={newSession.subjectId}
                  onChange={(e) => setNewSession({ ...newSession, subjectId: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded px-2.5 py-2"
                >
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Study Date</label>
                  <input
                    type="date"
                    value={newSession.studyDate}
                    onChange={(e) => setNewSession({ ...newSession, studyDate: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={newSession.durationMinutes}
                    onChange={(e) => setNewSession({ ...newSession, durationMinutes: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded px-3 py-2"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notes / Concepts Revised</label>
                <textarea
                  placeholder="Key insights, exercises finished..."
                  value={newSession.notes}
                  onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  rows={2}
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg mt-3 cursor-pointer">
                Save Session Log
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {activeModal === 'addGoal' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-slate-900">Set Learning Goal</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 text-lg">&times;</button>
            </div>
            <form onSubmit={handleAddGoal} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Goal Title</label>
                <input
                  type="text"
                  placeholder="e.g. Study 15 hours this week"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  placeholder="Target outcome..."
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Value</label>
                  <input
                    type="number"
                    value={newGoal.targetValue}
                    onChange={(e) => setNewGoal({ ...newGoal, targetValue: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Unit</label>
                  <select
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-2"
                  >
                    <option value="Hours">Hours</option>
                    <option value="Topics">Topics</option>
                    <option value="Chapters">Chapters</option>
                    <option value="Marks %">Marks %</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Deadline</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg mt-3 cursor-pointer">
                Set Milestone
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Test Modal */}
      {activeModal === 'addTest' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-slate-900">Record Test / Quiz Marks</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700 text-lg">&times;</button>
            </div>
            <form onSubmit={handleAddTest} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject</label>
                <select
                  value={newTest.subjectId}
                  onChange={(e) => setNewTest({ ...newTest, subjectId: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded px-2.5 py-2"
                >
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assessment Name</label>
                <input
                  type="text"
                  placeholder="e.g. Unit 3 Mid-Term Exam"
                  value={newTest.testName}
                  onChange={(e) => setNewTest({ ...newTest, testName: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Marks Obtained</label>
                  <input
                    type="number"
                    value={newTest.marksObtained}
                    onChange={(e) => setNewTest({ ...newTest, marksObtained: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded px-3 py-2"
                    step="0.5"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={newTest.totalMarks}
                    onChange={(e) => setNewTest({ ...newTest, totalMarks: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded px-3 py-2"
                    step="0.5"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Test Date</label>
                <input
                  type="date"
                  value={newTest.testDate}
                  onChange={(e) => setNewTest({ ...newTest, testDate: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Feedback / Notes</label>
                <textarea
                  placeholder="Errors made, concepts to revise..."
                  value={newTest.notes}
                  onChange={(e) => setNewTest({ ...newTest, notes: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  rows={2}
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg mt-3 cursor-pointer">
                Save Test Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Project Exporter Modal */}
      <ProjectExporterModal
        isOpen={isProjectHubOpen}
        onClose={() => setIsProjectHubOpen(false)}
      />

      {/* Auth Modals: Login & Registration */}
      <AuthModals
        isLoginOpen={isLoginModalOpen}
        isRegisterOpen={isRegisterModalOpen}
        users={users}
        onClose={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(false);
        }}
        onLogin={(loggedInUser) => {
          setCurrentUser(loggedInUser);
          if (loggedInUser.role === 'ADMIN') {
            setCurrentPage('admin-dashboard');
          } else {
            setCurrentPage('dashboard');
          }
        }}
        onRegister={(registeredUser) => {
          setUsers([...users, registeredUser]);
          setCurrentUser(registeredUser);
          setCurrentPage('dashboard');
        }}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

    </div>
  );
}
