/**
 * AI Career Advisor Service for ⚡ Smart Career Platform
 * Integrates Google Gemini 3.8 Flash for personalized career mentoring,
 * interview preparation, concept explanations, and roadmap guidance.
 */

export interface StudentCareerContext {
  studentName: string;
  college?: string;
  degree?: string;
  branch?: string;
  careerPathTitle: string;
  targetJobRole: string;
  skillLevel: string;
  learningGoal: string;
  weeklyHours: number;
  completedTopics: string[];
  currentTopics: string[];
  existingSkills: string[];
}

export interface StudentAcademicContext {
  studentName: string;
  department: string;
  course: string;
  semester: string;
  cgpa: number;
  subjects: { name: string; code: string; progress: number }[];
  weakTopics: string[];
  upcomingExams: string[];
  studyStreak: number;
}

const DEFAULT_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

export async function askAcademicAssistant(
  userQuery: string,
  context: StudentAcademicContext,
  customApiKey?: string
): Promise<string> {
  const careerCtx: StudentCareerContext = {
    studentName: context.studentName,
    college: 'Campus College',
    degree: context.course,
    branch: context.department,
    careerPathTitle: context.course || 'Computer Science & Engineering',
    targetJobRole: 'Software Developer / Engineer',
    skillLevel: 'Intermediate',
    learningGoal: 'Placement & High Marks',
    weeklyHours: 15,
    completedTopics: context.subjects.filter(s => s.progress > 75).map(s => s.name),
    currentTopics: context.subjects.map(s => s.name),
    existingSkills: context.subjects.map(s => s.name),
  };
  return askCareerAdvisor(userQuery, careerCtx, customApiKey);
}

export async function askCareerAdvisor(
  userQuery: string,
  context: StudentCareerContext,
  customApiKey?: string
): Promise<string> {
  const apiKey = customApiKey?.trim() || (import.meta as any).env?.VITE_GEMINI_API_KEY || DEFAULT_API_KEY;

  // Build high-context prompt tailored to the student's selected career
  const systemContext = `You are the Intelligent Career Advisor & Technical Mentor on the "⚡ Smart Career" platform.
You are counseling student: ${context.studentName} (${context.degree || 'B.Tech'} in ${context.branch || 'Engineering'}, ${context.college || 'University'}).

STUDENT'S REAL CAREER PROFILE & GOALS:
- Chosen Career Track: ${context.careerPathTitle}
- Target Job Role: ${context.targetJobRole}
- Current Skill Level: ${context.skillLevel}
- Primary Goal: ${context.learningGoal}
- Weekly Study Commitment: ${context.weeklyHours} hours/week
- Existing Skills: ${context.existingSkills.join(', ') || 'None specified'}
- Completed Roadmap Milestones: ${context.completedTopics.join(', ') || 'Starting Phase 1'}
- Current In-Progress Topics: ${context.currentTopics.join(', ') || 'Phase 1 Foundations'}

INSTRUCTIONS & SAFETY PROTOCOLS:
1. Address ${context.studentName.split(' ')[0]} warmly, professionally, and encouragingly.
2. Tailor your explanation strictly to their chosen track: "${context.careerPathTitle}" and skill level: "${context.skillLevel}".
   - If they are a Generative AI student, do NOT give them random cybersecurity topics.
   - If they are Cybersecurity, focus on security principles, OWASP, networking, Linux, and SOC workflows.
3. Be technically accurate, structured, and pedagogical. Use Markdown headings, concise bullet points, and code snippets where appropriate.
4. Distinguish between official database roadmap topics and AI advisory explanations.
5. NEVER fabricate external university partnerships, fake Zoom meeting links, or fake course URLs.
6. Provide actionable steps for their ${context.learningGoal} objective (interview readiness, projects to build, concepts to master).`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${systemContext}\n\nSTUDENT QUESTION / REQUEST:\n"${userQuery}"`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1200,
          }
        })
      }
    );

    if (response.ok) {
      const data = await response.json();
      const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidateText && candidateText.trim().length > 0) {
        return candidateText.trim();
      }
    }
  } catch (err) {
    console.warn('Gemini API call encountered an issue, falling back to local career advisor engine', err);
  }

  // Graceful rule-based intelligent fallback if API key quota exceeded or offline
  return generateIntelligentCareerFallback(userQuery, context);
}

function generateIntelligentCareerFallback(userQuery: string, ctx: StudentCareerContext): string {
  const firstName = ctx.studentName.split(' ')[0];
  const queryLower = userQuery.toLowerCase();

  if (queryLower.includes('rag') || queryLower.includes('retrieval')) {
    return `### 🔍 Deep Dive: Retrieval-Augmented Generation (RAG) for ${firstName}\n\n` +
      `Hello ${firstName}! As someone pursuing **${ctx.careerPathTitle}**, RAG is currently the most requested enterprise skill for **${ctx.targetJobRole}** positions.\n\n` +
      `#### What is RAG?\n` +
      `RAG solves the fundamental limitation of Large Language Models (knowledge cutoffs and hallucinations) by retrieving private or domain-specific facts before generating an answer.\n\n` +
      `#### The 3-Step RAG Architecture:\n` +
      `1. **Indexing**: Ingest documents (PDFs, Markdown, DB records) -> Chunk text -> Compute vector embeddings -> Store in ChromaDB/Pinecone.\n` +
      `2. **Retrieval**: When user asks a question, embed their query -> Compute cosine similarity -> Fetch Top-K relevant text chunks.\n` +
      `3. **Generation**: Inject retrieved chunks as system context into the LLM prompt -> Model produces a cited, grounded response.\n\n` +
      `#### 🛠️ Recommended Action for Your ${ctx.skillLevel} Level:\n` +
      `- Build a minimal Python script using LangChain and ChromaDB with your local lecture notes.\n` +
      `- Review our **Autonomous RAG Document Intelligence Engine** in the Projects tab!`;
  }

  if (queryLower.includes('interview') || queryLower.includes('prepare') || queryLower.includes('question')) {
    return `### 🎯 High-Yield Interview Prep for ${ctx.targetJobRole} (${firstName})\n\n` +
      `Since your primary goal is **${ctx.learningGoal}**, here is how hiring committees evaluate **${ctx.careerPathTitle}** candidates at your **${ctx.skillLevel}** level:\n\n` +
      `#### Top 3 Questions You Will Encounter:\n` +
      `1. **System Architecture**: "How do you handle chunk size selection and token overlap in vector search?"\n` +
      `2. **Trade-offs**: "Compare fine-tuning vs RAG for a customer service chatbot. When does fine-tuning fail?"\n` +
      `3. **Practical Debugging**: "How do you detect and mitigate prompt injection attacks in user-provided inputs?"\n\n` +
      `#### 💡 Advisor Tip:\n` +
      `Check out our dedicated **Placement Preparation** tab where you can practice mock technical questions with revealable evaluation rubrics!`;
  }

  if (queryLower.includes('project') || queryLower.includes('portfolio')) {
    return `### 🚀 Standout Portfolio Projects for ${firstName}\n\n` +
      `For **${ctx.careerPathTitle}**, employers look for projects that prove you can move beyond simple tutorial APIs into production engineering:\n\n` +
      `1. **Enterprise Document QA Engine (Advanced RAG)**:\n` +
      `   - Features: Multi-file ingestion, vector indexing, re-ranking with Cross-Encoders, source page citations.\n` +
      `   - Tech Stack: Python, FastAPI, ChromaDB, Gemini API, Docker.\n` +
      `2. **Autonomous Multi-Agent Workflow**:\n` +
      `   - Features: Researcher agent + Code generator agent + Reviewer agent using LangGraph.\n` +
      `   - Outcome: Demonstrates agentic planning and state management.\n\n` +
      `You can find step-by-step deliverable checklists for these inside your **Projects & Practice** section.`;
  }

  // General personalized response
  return `### ⚡ Career Advisor Guidance for ${firstName}\n\n` +
    `Hello ${firstName}! I have loaded your **${ctx.careerPathTitle}** roadmap targeted towards **${ctx.targetJobRole}**.\n\n` +
    `You are currently studying at the **${ctx.skillLevel}** stage with a goal of **${ctx.learningGoal}** (${ctx.weeklyHours} hrs/week planned).\n\n` +
    `#### Recommended Focus for This Week:\n` +
    `1. Complete your in-progress roadmap topics: **${ctx.currentTopics.join(', ') || 'Core Phase Milestones'}**.\n` +
    `2. Practice 3 questions in the **Placement Preparation** module to build interview muscle memory.\n` +
    `3. Star one of our hands-on projects to demonstrate production skills on your resume.\n\n` +
    `Ask me anything about specific code concepts, interview questions, or study schedules!`;
}
