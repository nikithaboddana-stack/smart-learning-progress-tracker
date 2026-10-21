import React, { useState } from 'react';
import { User, Subject, Topic, Task, TestRecord } from '../types';
import { askAcademicAssistant, StudentAcademicContext } from '../services/aiService';

interface AIAssistantViewProps {
  user: User;
  subjects: Subject[];
  topics: Topic[];
  tasks: Task[];
  tests: TestRecord[];
  studyStreak: number;
  totalStudyHours: number;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  user,
  subjects,
  topics,
  tasks,
  tests,
  studyStreak,
  totalStudyHours
}) => {
  const [apiKey, setApiKey] = useState((import.meta as any).env?.VITE_GEMINI_API_KEY || '');
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello **${user.name.split(' ')[0]}**! 👋 I am your **Intelligent Academic Advisor** powered by Gemini AI.\n\nI have complete real-time visibility into your courses, test scores, and study streak.\n\nHow can I help you excel this semester?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Compute live context
  const averageScore = tests.length > 0
    ? Math.round((tests.reduce((acc, t) => acc + t.percentage, 0) / tests.length) * 10) / 10
    : 0;

  const weakTopics = topics.filter(t => t.confidenceLevel <= 2 || t.progressPercentage < 50).map(t => ({
    name: t.name,
    subject: t.subjectName || 'General',
    confidence: t.confidenceLevel
  }));

  const recentTests = tests.slice(-3).map(t => ({
    subject: t.subjectName,
    testName: t.testName,
    score: t.marksObtained,
    percentage: t.percentage
  }));

  const urgentTasks = tasks
    .filter(t => t.priority === 'High' && t.status !== 'Completed')
    .map(t => ({ title: t.title, dueDate: t.dueDate, priority: t.priority }));

  const academicContext: StudentAcademicContext = {
    studentName: user.name,
    department: user.department || 'Computer Science & Engineering',
    semester: user.semester || '6th Semester',
    averageScore,
    studyStreak,
    totalStudyHours,
    subjects: subjects.map(s => ({
      name: s.name,
      targetPercentage: s.targetPercentage,
      progress: s.overallProgress || 0
    })),
    weakTopics,
    recentTests,
    urgentTasks
  };

  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await askAcademicAssistant(queryText, academicContext, apiKey);
      const assistantMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: 'I encountered a brief connection issue. Please review your focus areas or try again in a moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const presetQueries = [
    'Analyze my weak areas and test scores',
    'Generate a 7-day personalized study schedule',
    'How can I raise my Advanced Java score to 85%?',
    'What should I prioritize studying today?'
  ];

  const formatMarkdown = (content: string) => {
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-base font-bold text-slate-900 mt-2 mb-1">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('#### ')) {
        return <h4 key={idx} className="text-sm font-semibold text-slate-800 mt-1 mb-0.5">{line.replace('#### ', '')}</h4>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const item = line.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-700 leading-relaxed">
            {renderBoldText(item)}
          </li>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-xs text-slate-700 leading-relaxed">
            {renderBoldText(line.replace(/^\d+\.\s/, ''))}
          </li>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return <p key={idx} className="text-xs text-slate-700 leading-relaxed">{renderBoldText(line)}</p>;
    });
  };

  const renderBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-4">
      {/* Context Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-500/30 text-blue-200 rounded-lg text-lg">🤖</span>
            <h2 className="text-lg font-bold">Intelligent Academic Study Consultant</h2>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
              ⚡ Powered by Gemini 3.8
            </span>
            <button
              type="button"
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              className="bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 text-[10px] font-semibold px-2.5 py-0.5 rounded-full cursor-pointer flex items-center gap-1 transition-colors"
            >
              <span>🔑</span>
              <span>Key: {apiKey.slice(0, 8)}...{apiKey.slice(-4)}</span>
              <span>⚙️</span>
            </button>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Grounded in your active records: {user.name} &bull; {academicContext.department} &bull; Streak: {studyStreak} Days &bull; Test Avg: {averageScore}%
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <span className="text-slate-300">Weak Topics: </span>
            <span className="font-bold text-amber-300">{weakTopics.length}</span>
          </div>
          <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            <span className="text-slate-300">Urgent Tasks: </span>
            <span className="font-bold text-rose-300">{urgentTasks.length}</span>
          </div>
        </div>
      </div>

      {/* Collapsible API Key Configuration */}
      {showKeyConfig && (
        <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-3.5 text-xs flex flex-col sm:flex-row items-center gap-3 shadow-md">
          <span className="text-slate-300 font-semibold shrink-0">Gemini 3.8 Flash Key:</span>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            placeholder="Enter API Key"
          />
          <span className="text-[11px] text-emerald-400 font-semibold shrink-0 flex items-center gap-1">
            <span>✓</span> Active &amp; Grounded
          </span>
        </div>
      )}

      {/* Preset Prompt Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">Quick Prompts:</span>
        {presetQueries.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(pq)}
            disabled={isLoading}
            className="text-xs bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-lg px-3 py-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
          >
            💡 {pq}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-[440px] flex flex-col justify-between">
        <div className="overflow-y-auto space-y-4 pr-2 flex-1">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                }`}
              >
                {msg.sender === 'user' ? user.name.charAt(0) : '🤖'}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
                }`}
              >
                {msg.sender === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <div>{formatMarkdown(msg.text)}</div>
                )}
                <span
                  className={`block text-[10px] mt-1.5 ${
                    msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                🤖
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-3 text-xs text-slate-500 flex items-center gap-2">
                <span className="animate-spin text-sm">⏳</span>
                <span>Gemini is analyzing your syllabus and generating tailored guidance...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage(inputQuery);
          }}
          className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={`Ask the AI consultant about your courses, weak areas, or revision strategy...`}
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
          >
            <span>Ask AI</span>
            <span>➤</span>
          </button>
        </form>
      </div>
    </div>
  );
};
