import React, { useState } from 'react';
import JSZip from 'jszip';
import { JAVA_PROJECT_FILES, ProjectFile } from '../data/javaProjectFiles';

interface ProjectExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectExporterModal: React.FC<ProjectExporterModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(JAVA_PROJECT_FILES[0]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'explorer' | 'setup' | 'architecture'>('explorer');

  if (!isOpen) return null;

  const filteredFiles = filterCategory === 'all'
    ? JAVA_PROJECT_FILES
    : JAVA_PROJECT_FILES.filter(f => f.category === filterCategory);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add each file in our catalog to the zip archive
      JAVA_PROJECT_FILES.forEach(file => {
        zip.file(file.path, file.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'SmartLearningProgressTracker.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate zip', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">☕</span>
            <div>
              <h2 className="text-lg font-bold">Eclipse IDE &amp; Tomcat Project Hub</h2>
              <p className="text-xs text-slate-400">Jakarta Servlet 6.0 &bull; Java 17 &bull; JSP &bull; JDBC &bull; MySQL &bull; Tomcat 10.1+</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>📦</span>
              <span>{isZipping ? 'Packaging ZIP...' : 'Download Eclipse Project (.ZIP)'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 text-xl font-bold cursor-pointer transition-colors"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('explorer')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === 'explorer' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              📁 Source File Explorer
            </button>
            <button
              onClick={() => setActiveTab('setup')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === 'setup' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              ⚡ Eclipse &amp; Tomcat Setup Guide
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === 'architecture' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              🏛️ MVC College Architecture
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-hidden flex">
          {activeTab === 'explorer' && (
            <>
              {/* File list sidebar */}
              <div className="w-80 border-r border-slate-200 bg-slate-50 flex flex-col">
                <div className="p-3 border-b border-slate-200">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded px-2 py-1.5 bg-white text-slate-800"
                  >
                    <option value="all">All Project Files ({JAVA_PROJECT_FILES.length})</option>
                    <option value="model">Models (POJOs)</option>
                    <option value="dao">DAO Classes (JDBC)</option>
                    <option value="service">Services (Algorithms)</option>
                    <option value="servlet">Servlets (Controllers)</option>
                    <option value="util">Utilities (DB / Crypto)</option>
                    <option value="sql">Database SQL</option>
                    <option value="config">Config (pom.xml, web.xml)</option>
                  </select>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {filteredFiles.map((file) => (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left px-3 py-2 rounded text-xs transition-colors flex flex-col gap-0.5 cursor-pointer ${
                        selectedFile.path === file.path
                          ? 'bg-blue-50 border border-blue-200 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono">{file.name}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded">
                          {file.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 truncate">{file.path}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Code viewer pane */}
              <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
                <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-blue-400 font-mono">{selectedFile.path}</span>
                    <p className="text-[11px] text-slate-300">{selectedFile.description}</p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1 rounded transition-colors cursor-pointer"
                  >
                    {copied ? '✓ Copied!' : 'Copy Code'}
                  </button>
                </div>
                <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-200 leading-relaxed bg-slate-950">
                  <pre className="whitespace-pre">{selectedFile.content}</pre>
                </div>
              </div>
            </>
          )}

          {activeTab === 'setup' && (
            <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-white text-slate-800">
              <h3 className="text-xl font-bold text-slate-900">Step-by-Step Eclipse IDE &amp; Tomcat 10.1 Deployment Guide</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-slate-200 rounded-lg p-5 bg-slate-50 space-y-3">
                  <h4 className="font-bold text-blue-700 text-sm flex items-center gap-2">
                    <span>1️⃣</span> Prerequisites Setup
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
                    <li><strong>JDK 17 LTS</strong> installed with <code>JAVA_HOME</code> configured.</li>
                    <li><strong>Apache Tomcat 10.1.x</strong> extracted to permanent directory.</li>
                    <li><strong>MySQL Server 8.0+</strong> running locally on port <code>3306</code>.</li>
                    <li><strong>Eclipse IDE for Enterprise Java and Web Developers</strong>.</li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-lg p-5 bg-slate-50 space-y-3">
                  <h4 className="font-bold text-blue-700 text-sm flex items-center gap-2">
                    <span>2️⃣</span> MySQL Database Creation
                  </h4>
                  <div className="bg-slate-900 text-slate-200 p-3 rounded text-xs font-mono">
                    mysql -u root -p<br/>
                    source /path/to/database.sql;
                  </div>
                  <p className="text-xs text-slate-500">
                    Creates <code>smart_learning_tracker</code> with all 8 tables and sample seed records.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-lg p-5 bg-slate-50 space-y-3">
                  <h4 className="font-bold text-blue-700 text-sm flex items-center gap-2">
                    <span>3️⃣</span> Import into Eclipse
                  </h4>
                  <ol className="text-xs text-slate-600 space-y-1.5 list-decimal pl-4">
                    <li>Click <strong>File &rarr; Import...</strong></li>
                    <li>Select <strong>Maven &rarr; Existing Maven Projects</strong>.</li>
                    <li>Browse to the extracted <code>SmartLearningProgressTracker</code> folder.</li>
                    <li>Ensure <code>pom.xml</code> is checked and click <strong>Finish</strong>.</li>
                  </ol>
                </div>

                <div className="border border-slate-200 rounded-lg p-5 bg-slate-50 space-y-3">
                  <h4 className="font-bold text-blue-700 text-sm flex items-center gap-2">
                    <span>4️⃣</span> Add to Tomcat &amp; Run
                  </h4>
                  <ol className="text-xs text-slate-600 space-y-1.5 list-decimal pl-4">
                    <li>Open <strong>Servers</strong> tab in Eclipse.</li>
                    <li>New Server &rarr; Apache &rarr; <strong>Tomcat v10.1 Server</strong>.</li>
                    <li>Add <code>SmartLearningProgressTracker</code> to Configured Projects.</li>
                    <li>Start Tomcat and navigate to: <code className="text-blue-600">http://localhost:8080/SmartLearningProgressTracker/</code></li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-white text-slate-800">
              <h3 className="text-xl font-bold text-slate-900">Advanced Java MVC Design Pattern Proof</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                This project strictly avoids modern JavaScript frameworks in its production build to ensure 100% genuine Dynamic Web / Maven deployment inside Eclipse on Apache Tomcat.
              </p>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <h4 className="font-bold text-blue-800 text-sm">Model Layer</h4>
                  <p className="text-xs text-slate-600 mt-2">Java POJOs in <code>com.smartlearning.model</code> implementing <code>Serializable</code> for session stability.</p>
                </div>
                <div className="p-4 border border-emerald-200 bg-emerald-50 rounded-lg">
                  <h4 className="font-bold text-emerald-800 text-sm">DAO &amp; JDBC</h4>
                  <p className="text-xs text-slate-600 mt-2">PreparedStatements in <code>com.smartlearning.dao</code> protecting against SQL injection, with try-with-resources closing.</p>
                </div>
                <div className="p-4 border border-purple-200 bg-purple-50 rounded-lg">
                  <h4 className="font-bold text-purple-800 text-sm">Controller Servlets</h4>
                  <p className="text-xs text-slate-600 mt-2">Jakarta Servlets in <code>com.smartlearning.servlet</code> utilizing <code>@WebServlet</code> and <code>AuthFilter</code>.</p>
                </div>
                <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                  <h4 className="font-bold text-amber-800 text-sm">View Layer (JSP)</h4>
                  <p className="text-xs text-slate-600 mt-2">JSP views with JSTL core tags (<code>&lt;c:forEach&gt;</code>, <code>&lt;c:if&gt;</code>) and zero raw scriptlets.</p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
