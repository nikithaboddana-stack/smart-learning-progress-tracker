import React, { useState } from 'react';
import { User, StudentProfile, RoadmapTopic, Skill } from '../types';
import { askCareerAdvisor, StudentCareerContext } from '../services/aiService';

interface AICareerAssistantViewProps {
  user: User;
  profile: StudentProfile;
  topics: RoadmapTopic[];
  skills: Skill[];
  initialQuery?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AICareerAssistantView: React.FC<AICareerAssistantViewProps> = ({
  user,
  profile,
  topics,
  skills,
  initialQuery
}) => {
  const [apiKey, setApiKey] = useState((import.meta as any).env?.VITE_GEMINI_API_KEY || '');
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [inputQuery, setInputQuery] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);

  const careerTopics = topics.filter(t => t.careerPathId === profile.careerPathId);
  const completedTopics = careerTopics.filter(t => t.isCompleted).map(t => t.topicName);
  const currentTopics = careerTopics.filter(t => !t.isCompleted).slice(0, 2).map(t => t.topicName);
  const existingSkills = skills.filter(s => profile.existingSkillIds.includes(s.id)).map(s => s.name);

  const careerContext: StudentCareerContext = {
    studentName: user.name,
    college: user.college,
    degree: user.degree,
    branch: user.branch,
    careerPathTitle: profile.careerTitle,
    targetJobRole: profile.targetJobRole,
    skillLevel: profile.skillLevel,
    learningGoal: profile.learningGoal,
    weeklyHours: profile.weeklyHours,
    completedTopics,
    currentTopics,
    existingSkills
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello **${user.name.split(' ')[0]}**! 👋 I am your **Gemini AI Career Mentor** on ⚡ Smart Career.\n\nI am grounded in your chosen track: **${profile.careerTitle}** (targeted for **${profile.targetJobRole}**) at the **${profile.skillLevel}** level.\n\nAsk me about concept explanations, code debugging, system architecture, interview question drills, or study scheduling!`,
      timestamp: 'Just now'
    }
  ]);

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
      const response = await askCareerAdvisor(queryText, careerContext, apiKey);
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
        text: 'I encountered a brief connection error. Please try asking again in a moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Career specific preset questions
  const presetQueries = profile.careerPathId === 1
    ? [
        'Explain RAG architecture and why vector search is needed',
        'Compare Fine-Tuning vs RAG for an enterprise chatbot',
        'Give me 5 technical interview questions for a GenAI Engineer',
        'Suggest a 3-month roadmap to prepare for AI Placement'
      ]
    : profile.careerPathId === 2
    ? [
        'Explain OWASP Top 10 web security vulnerabilities with code fixes',
        'What does a SOC Analyst L1 do daily and how to write SIEM rules?',
        'Give me top cybersecurity interview questions on TCP/IP and SQLi',
        'How to build an ethical hacking home lab on Linux?'
      ]
    : [
        'Explain Jakarta Servlet RequestDispatcher.forward() vs sendRedirect()',
        'How to prevent SQL injection in JDBC with PreparedStatement?',
        'Top Full-Stack interview questions on microservices & Docker',
        'How to architect high-performance database connection pooling?'
      ];

  const formatMarkdown = (content: string) => {
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-sm font-bold text-white mt-2 mb-1">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('#### ')) {
        return <h4 key={idx} className="text-xs font-semibold text-blue-300 mt-1.5 mb-0.5">{line.replace('#### ', '')}</h4>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-300 leading-relaxed">
            {renderBoldText(line.substring(2))}
          </li>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-xs text-slate-300 leading-relaxed">
            {renderBoldText(line.replace(/^\d+\.\s/, ''))}
          </li>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return <p key={idx} className="text-xs text-slate-300 leading-relaxed">{renderBoldText(line)}</p>;
    });
  };

  const renderBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-4">
      {/* Context Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-500/20 text-blue-300 rounded-lg text-lg">🤖</span>
            <h2 className="text-base font-bold text-white">AI Career Consultant &amp; Mock Interviewer</h2>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-semibold px-2.5 py-0.5 rounded-full font-mono">
              ⚡ Gemini 3.8 Flash
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
          <p className="text-xs text-slate-400 mt-1">
            Grounded in: <span className="text-white font-medium">{profile.careerTitle}</span> &bull; Role: <span className="text-white font-medium">{profile.targetJobRole}</span> &bull; {profile.skillLevel} Stage
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
            <span>Goal: </span>
            <span className="font-bold text-cyan-300">{profile.learningGoal}</span>
          </div>
          <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
            <span>Milestones: </span>
            <span className="font-bold text-emerald-300">{completedTopics.length} Done</span>
          </div>
        </div>
      </div>

      {/* Collapsible Key Config */}
      {showKeyConfig && (
        <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 text-xs flex flex-col sm:flex-row items-center gap-3 shadow-md">
          <span className="text-slate-300 font-semibold shrink-0">Gemini 3.8 Flash Key:</span>
          <input
            type="text"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            className="flex-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            placeholder="Enter API Key"
          />
          <span className="text-[11px] text-emerald-400 font-semibold shrink-0 flex items-center gap-1">
            <span>✓</span> Active &amp; Grounded
          </span>
        </div>
      )}

      {/* Prompt Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-semibold">Quick Prompts:</span>
        {presetQueries.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(pq)}
            disabled={isLoading}
            className="text-xs bg-slate-900 hover:bg-blue-950/60 text-slate-300 hover:text-blue-300 border border-slate-800 hover:border-blue-500/50 rounded-xl px-3 py-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            💡 {pq}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 h-[460px] flex flex-col justify-between shadow-sm">
        <div className="overflow-y-auto space-y-4 pr-2 flex-1">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                }`}
              >
                {msg.sender === 'user' ? user.name.charAt(0) : '🤖'}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {msg.sender === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <div>{formatMarkdown(msg.text)}</div>
                )}
                <span
                  className={`block text-[10px] mt-1.5 ${
                    msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center justify-center text-xs font-bold">
                🤖
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-400 flex items-center gap-2">
                <span className="animate-spin text-sm">⏳</span>
                <span>Gemini is generating tailored technical advice for {profile.careerTitle}...</span>
              </div>
            </div>
          )}
        </div>

        {/* Query Input Form */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage(inputQuery);
          }}
          className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={`Ask about ${profile.careerTitle}, technical concepts, interview scenarios, code fixes...`}
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <span>Ask AI</span>
            <span>➤</span>
          </button>
        </form>
      </div>
    </div>
  );
};
