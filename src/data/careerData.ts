import {
  CareerPath,
  Skill,
  RoadmapTopic,
  LearningResource,
  LiveEvent,
  CareerProject,
  PlacementItem,
  InstructorProfile,
  User,
  StudentProfile
} from '../types';

export const MASTER_CAREER_PATHS: CareerPath[] = [
  {
    id: 1,
    title: 'Generative AI Engineer',
    category: 'AI & Data',
    description: 'Build enterprise LLM applications, RAG pipelines, autonomous AI agents, and production vector search architectures.',
    icon: '🤖',
    estimatedMonths: 7,
    demandLevel: 'Ultra High',
    averageSalaryRange: '$120,000 – $185,000 / ₹18 – 35 LPA',
    keySkills: ['Python', 'LLMs', 'RAG', 'Vector Databases', 'LangChain', 'AI Agents', 'Embeddings', 'Prompt Engineering']
  },
  {
    id: 2,
    title: 'Cybersecurity Analyst & Ethical Hacker',
    category: 'Cybersecurity',
    description: 'Defend systems against cyber threats, conduct penetration tests, analyze SOC telemetry, and implement zero-trust security.',
    icon: '🛡️',
    estimatedMonths: 6,
    demandLevel: 'High',
    averageSalaryRange: '$95,000 – $150,000 / ₹12 – 26 LPA',
    keySkills: ['Networking', 'Linux', 'OWASP Top 10', 'SIEM & SOC', 'Penetration Testing', 'Cryptography', 'Incident Response']
  },
  {
    id: 3,
    title: 'Full Stack Java & Cloud Developer',
    category: 'Software Engineering',
    description: 'Design robust enterprise web platforms using Java, Spring/Jakarta EE, REST APIs, microservices, and modern frontend frameworks.',
    icon: '☕',
    estimatedMonths: 6,
    demandLevel: 'High',
    averageSalaryRange: '$100,000 – $160,000 / ₹14 – 30 LPA',
    keySkills: ['Java', 'Jakarta EE / Spring', 'SQL & JDBC', 'REST APIs', 'Docker', 'Microservices', 'HTML5/Tailwind']
  },
  {
    id: 4,
    title: 'Data Scientist & ML Engineer',
    category: 'AI & Data',
    description: 'Extract statistical insights, train predictive machine learning models, and engineer high-throughput data processing workflows.',
    icon: '📊',
    estimatedMonths: 8,
    demandLevel: 'Very High',
    averageSalaryRange: '$110,000 – $170,000 / ₹15 – 32 LPA',
    keySkills: ['Python', 'SQL', 'Scikit-Learn', 'PyTorch', 'Data Visualization', 'Feature Engineering', 'MLOps']
  },
  {
    id: 5,
    title: 'Cloud Architect & DevOps Engineer',
    category: 'Cloud & DevOps',
    description: 'Automate CI/CD pipelines, orchestrate Kubernetes clusters, and architect resilient cloud infrastructures on AWS and GCP.',
    icon: '☁️',
    estimatedMonths: 6,
    demandLevel: 'Very High',
    averageSalaryRange: '$115,000 – $175,000 / ₹16 – 32 LPA',
    keySkills: ['Linux', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Terraform', 'AWS / GCP', 'Monitoring']
  }
];

export const MASTER_SKILLS: Skill[] = [
  // Programming
  { id: 1, category: 'Programming', name: 'Python' },
  { id: 2, category: 'Programming', name: 'Java' },
  { id: 3, category: 'Programming', name: 'JavaScript / TypeScript' },
  { id: 4, category: 'Programming', name: 'C / C++' },
  { id: 5, category: 'Programming', name: 'SQL & Relational Databases' },
  // AI & Data
  { id: 6, category: 'AI & Data', name: 'Machine Learning Basics' },
  { id: 7, category: 'AI & Data', name: 'Deep Learning & Neural Networks' },
  { id: 8, category: 'AI & Data', name: 'Transformers & LLM Fundamentals' },
  { id: 9, category: 'AI & Data', name: 'Retrieval-Augmented Generation (RAG)' },
  { id: 10, category: 'AI & Data', name: 'Vector Databases (Pinecone, Chroma)' },
  { id: 11, category: 'AI & Data', name: 'Prompt Engineering & Few-Shot Tuning' },
  { id: 12, category: 'AI & Data', name: 'Autonomous AI Agents (LangGraph / CrewAI)' },
  // Cybersecurity
  { id: 13, category: 'Cybersecurity', name: 'Computer Networking (TCP/IP, OSI)' },
  { id: 14, category: 'Cybersecurity', name: 'Linux System Administration & Bash' },
  { id: 15, category: 'Cybersecurity', name: 'Web Application Security & OWASP Top 10' },
  { id: 16, category: 'Cybersecurity', name: 'Cryptography & Public Key Infrastructure' },
  { id: 17, category: 'Cybersecurity', name: 'Ethical Hacking & Vulnerability Assessment' },
  { id: 18, category: 'Cybersecurity', name: 'SOC & SIEM Operations (Splunk, Elastic)' },
  // Cloud & DevOps
  { id: 19, category: 'Cloud & DevOps', name: 'Docker & Containerization' },
  { id: 20, category: 'Cloud & DevOps', name: 'Kubernetes Cluster Orchestration' },
  { id: 21, category: 'Cloud & DevOps', name: 'CI/CD Pipelines (GitHub Actions)' },
  { id: 22, category: 'Cloud & DevOps', name: 'Cloud Infrastructure (AWS / GCP)' }
];

export const MASTER_ROADMAPS: RoadmapTopic[] = [
  // 1. Generative AI Engineer Roadmap
  {
    id: 101,
    careerPathId: 1,
    phaseNumber: 1,
    phaseTitle: 'Phase 1: Foundations of Python & Machine Learning',
    topicName: 'Modern Python for AI & Data Structures',
    description: 'Master list comprehensions, generators, asynchronous I/O, type hinting, and NumPy vectorization.',
    keyConcepts: ['NumPy array operations', 'Async programming', 'Virtual environments', 'Pandas dataframes'],
    difficulty: 'Beginner',
    estimatedHours: 25,
    orderIndex: 1
  },
  {
    id: 102,
    careerPathId: 1,
    phaseNumber: 1,
    phaseTitle: 'Phase 1: Foundations of Python & Machine Learning',
    topicName: 'Classical Machine Learning & Feature Engineering',
    description: 'Understand loss functions, gradient descent, linear/logistic regression, cross-validation, and metrics (Precision, Recall, F1).',
    keyConcepts: ['Cost functions', 'Gradient Descent', 'Scikit-Learn estimators', 'Data normalization'],
    difficulty: 'Beginner',
    estimatedHours: 30,
    orderIndex: 2
  },
  {
    id: 103,
    careerPathId: 1,
    phaseNumber: 2,
    phaseTitle: 'Phase 2: Deep Learning & Transformer Architecture',
    topicName: 'Neural Networks & PyTorch Fundamentals',
    description: 'Tensors, autograd, forward/backward passes, activation functions (ReLU, GELU), and training multi-layer perceptrons.',
    keyConcepts: ['PyTorch nn.Module', 'Backpropagation', 'Optimizers (AdamW)', 'GPU acceleration'],
    difficulty: 'Intermediate',
    estimatedHours: 35,
    orderIndex: 3
  },
  {
    id: 104,
    careerPathId: 1,
    phaseNumber: 2,
    phaseTitle: 'Phase 2: Deep Learning & Transformer Architecture',
    topicName: 'Attention Mechanism & Transformers',
    description: 'Deconstruct the seminal "Attention Is All You Need" paper: Scaled Dot-Product Attention, Multi-Head Attention, and Positional Encodings.',
    keyConcepts: ['Self-Attention calculation', 'Query-Key-Value matrices', 'Encoder vs Decoder', 'Hugging Face Transformers'],
    difficulty: 'Intermediate',
    estimatedHours: 40,
    orderIndex: 4
  },
  {
    id: 105,
    careerPathId: 1,
    phaseNumber: 3,
    phaseTitle: 'Phase 3: LLM Engineering & Vector Search',
    topicName: 'Text Embeddings & Vector Databases',
    description: 'Convert unstructured documents into dense semantic vector representations; index and query with HNSW and cosine similarity.',
    keyConcepts: ['Sentence Transformers', 'Cosine Similarity vs Euclidean', 'ChromaDB & Pinecone', 'Chunking strategies'],
    difficulty: 'Intermediate',
    estimatedHours: 30,
    orderIndex: 5
  },
  {
    id: 106,
    careerPathId: 1,
    phaseNumber: 3,
    phaseTitle: 'Phase 3: LLM Engineering & Vector Search',
    topicName: 'Retrieval-Augmented Generation (RAG) Architecture',
    description: 'Build end-to-end RAG systems: multi-query retrieval, re-ranking, contextual compression, and citation grounding.',
    keyConcepts: ['Naive vs Advanced RAG', 'Re-ranking with Cross-Encoders', 'Prompt Templating', 'Hallucination mitigation'],
    difficulty: 'Advanced',
    estimatedHours: 45,
    orderIndex: 6
  },
  {
    id: 107,
    careerPathId: 1,
    phaseNumber: 4,
    phaseTitle: 'Phase 4: Autonomous Agents & Production Deployment',
    topicName: 'AI Agents & Tool Calling (LangGraph / CrewAI)',
    description: 'Create multi-agent workflows with memory, reflection, planning loops (ReAct pattern), and deterministic tool execution.',
    keyConcepts: ['ReAct prompting', 'Stateful graph workflows', 'Function Calling with Gemini', 'Multi-agent orchestration'],
    difficulty: 'Advanced',
    estimatedHours: 40,
    orderIndex: 7
  },
  {
    id: 108,
    careerPathId: 1,
    phaseNumber: 4,
    phaseTitle: 'Phase 4: Autonomous Agents & Production Deployment',
    topicName: 'Production RAG Evaluation, Guardrails & Cloud Deploy',
    description: 'Evaluate faithfulness using Ragas, implement input/output guardrails (NeMo Guardrails), and deploy low-latency inference APIs.',
    keyConcepts: ['Ragas metrics (Faithfulness, Answer Relevance)', 'Prompt injection defense', 'FastAPI microservices', 'Dockerizing AI pipelines'],
    difficulty: 'Advanced',
    estimatedHours: 35,
    orderIndex: 8
  },

  // 2. Cybersecurity Analyst Roadmap
  {
    id: 201,
    careerPathId: 2,
    phaseNumber: 1,
    phaseTitle: 'Phase 1: Networking & Operating System Fundamentals',
    topicName: 'TCP/IP Architecture & Network Packet Analysis',
    description: 'Deep dive into OSI layers, IPv4/IPv6 subnetting, DNS, DHCP, ARP, Wireshark packet captures, and routing protocols.',
    keyConcepts: ['TCP 3-way handshake', 'Wireshark pcap inspection', 'Subnetting CIDR', 'Port scanning basics'],
    difficulty: 'Beginner',
    estimatedHours: 30,
    orderIndex: 1
  },
  {
    id: 202,
    careerPathId: 2,
    phaseNumber: 1,
    phaseTitle: 'Phase 1: Networking & Operating System Fundamentals',
    topicName: 'Linux Administration, Permissions & CLI Defense',
    description: 'File system hierarchies, chmod/chown access control, process inspection (ps, top), SSH hardening, and iptables firewall rules.',
    keyConcepts: ['Linux permissions & SUID', 'Bash scripting for security', 'Systemd services', 'Log file analysis (/var/log/auth.log)'],
    difficulty: 'Beginner',
    estimatedHours: 30,
    orderIndex: 2
  },
  {
    id: 203,
    careerPathId: 2,
    phaseNumber: 2,
    phaseTitle: 'Phase 2: Web Security & Vulnerability Analysis',
    topicName: 'OWASP Top 10 Web Application Vulnerabilities',
    description: 'Hands-on exploitation and remediation of SQL Injection, Cross-Site Scripting (XSS), CSRF, SSRF, and Broken Access Control.',
    keyConcepts: ['SQLi parameterized defense', 'Stored vs Reflected XSS', 'Burp Suite proxying', 'JWT token exploitation'],
    difficulty: 'Intermediate',
    estimatedHours: 40,
    orderIndex: 3
  },
  {
    id: 204,
    careerPathId: 2,
    phaseNumber: 2,
    phaseTitle: 'Phase 2: Web Security & Vulnerability Analysis',
    topicName: 'Applied Cryptography & Secure Communications',
    description: 'Symmetric encryption (AES-GCM), asymmetric key exchange (RSA, ECC), digital signatures, TLS/SSL handshakes, and hashing (SHA-256).',
    keyConcepts: ['Diffie-Hellman Key Exchange', 'PKI certificates & CAs', 'Rainbow tables & salting', 'Zero-knowledge proofs'],
    difficulty: 'Intermediate',
    estimatedHours: 35,
    orderIndex: 4
  },
  {
    id: 205,
    careerPathId: 2,
    phaseNumber: 3,
    phaseTitle: 'Phase 3: SOC Operations & Incident Response',
    topicName: 'SIEM Log Correlation & Threat Detection',
    description: 'Ingest security telemetry from firewalls and endpoints into Splunk / ELK; write correlation rules to detect brute-force and lateral movement.',
    keyConcepts: ['Splunk SPL queries', 'Elasticsearch SIEM rules', 'MITRE ATT&CK framework', 'False positive reduction'],
    difficulty: 'Advanced',
    estimatedHours: 45,
    orderIndex: 5
  },
  {
    id: 206,
    careerPathId: 2,
    phaseNumber: 3,
    phaseTitle: 'Phase 3: SOC Operations & Incident Response',
    topicName: 'Incident Response & Digital Forensics',
    description: 'Containment workflows, memory dump analysis (Volatility), disk imaging, reverse engineering malicious scripts, and post-mortem reporting.',
    keyConcepts: ['NIST Incident Handling phases', 'Volatility memory triage', 'Malware sandbox analysis', 'Chain of custody documentation'],
    difficulty: 'Advanced',
    estimatedHours: 40,
    orderIndex: 6
  },

  // 3. Full Stack Java & Cloud Developer Roadmap
  {
    id: 301,
    careerPathId: 3,
    phaseNumber: 1,
    phaseTitle: 'Phase 1: Advanced Java & Relational Databases',
    topicName: 'Java 17+ OOP, Concurrency & Stream API',
    description: 'Sealed classes, records, virtual threads, collections framework, and multi-threaded synchronization.',
    keyConcepts: ['Thread pools & Executors', 'Streams & Lambdas', 'Generic types', 'Memory model (JVM garbage collection)'],
    difficulty: 'Beginner',
    estimatedHours: 35,
    orderIndex: 1
  },
  {
    id: 302,
    careerPathId: 3,
    phaseNumber: 1,
    phaseTitle: 'Phase 1: Advanced Java & Relational Databases',
    topicName: 'JDBC Architecture & Transaction ACID Control',
    description: 'PreparedStatement security, connection pooling with HikariCP, database isolation levels, and batch execution.',
    keyConcepts: ['SQL Injection defense', 'Connection pooling', 'ACID transaction management', 'ResultSet mapping'],
    difficulty: 'Beginner',
    estimatedHours: 30,
    orderIndex: 2
  },
  {
    id: 303,
    careerPathId: 3,
    phaseNumber: 2,
    phaseTitle: 'Phase 2: Jakarta Servlets & Enterprise MVC',
    topicName: 'Servlet Lifecycle, Filters & Session Tracking',
    description: 'HttpServlet architecture, RequestDispatcher forward/include patterns, AuthenticationFilter security, and cookie-based sessions.',
    keyConcepts: ['Request/Response cycle', 'RequestDispatcher.forward()', 'Web.xml mapping vs annotations', 'RoleFilter security'],
    difficulty: 'Intermediate',
    estimatedHours: 40,
    orderIndex: 3
  },
  {
    id: 304,
    careerPathId: 3,
    phaseNumber: 3,
    phaseTitle: 'Phase 3: Microservices & Cloud Containers',
    topicName: 'Docker Containerization & Cloud CI/CD',
    description: 'Containerize multi-tier Java web apps with Docker, write Dockerfiles, configure Docker Compose, and deploy to cloud environments.',
    keyConcepts: ['Multi-stage Docker builds', 'Port binding & volumes', 'Environment variable injection', 'GitHub Actions workflow'],
    difficulty: 'Advanced',
    estimatedHours: 40,
    orderIndex: 4
  }
];

export const MASTER_RESOURCES: LearningResource[] = [
  {
    id: 1,
    title: 'Hugging Face Deep Learning & Transformers Course',
    provider: 'Hugging Face',
    instructor: 'Sylvain Gugger & Lewis Tunstall',
    description: 'Official free comprehensive course on modern natural language processing and tokenizers.',
    careerCategory: 'AI & Data',
    topic: 'Transformers & NLP',
    skillLevel: 'Intermediate',
    resourceType: 'Course',
    isFree: true,
    officialUrl: 'https://huggingface.co/learn/nlp-course',
    duration: '25 Hours',
    verified: true
  },
  {
    id: 2,
    title: 'Generative AI for Everyone',
    provider: 'DeepLearning.AI',
    instructor: 'Dr. Andrew Ng',
    description: 'Fundamental understanding of how Generative AI and Large Language Models work in industry.',
    careerCategory: 'AI & Data',
    topic: 'Generative AI Overview',
    skillLevel: 'Beginner',
    resourceType: 'Course',
    isFree: true,
    officialUrl: 'https://www.deeplearning.ai/courses/generative-ai-for-everyone/',
    duration: '6 Hours',
    verified: true
  },
  {
    id: 3,
    title: 'OWASP Top Ten Security Risk Documentation',
    provider: 'OWASP Foundation',
    instructor: 'OWASP Core Project Team',
    description: 'The definitive industry standard awareness document for web application developers and security auditors.',
    careerCategory: 'Cybersecurity',
    topic: 'Web Application Security',
    skillLevel: 'All Levels',
    resourceType: 'Documentation',
    isFree: true,
    officialUrl: 'https://owasp.org/www-project-top-ten/',
    duration: 'Self-paced Guide',
    verified: true
  },
  {
    id: 4,
    title: 'OverTheWire: Bandit Linux Security Wargame',
    provider: 'OverTheWire Community',
    instructor: 'Open Source Security Collective',
    description: 'Gamified hands-on security challenge teaching essential Linux command-line, file permissions, and cryptography.',
    careerCategory: 'Cybersecurity',
    topic: 'Linux & Command Line',
    skillLevel: 'Beginner',
    resourceType: 'Project',
    isFree: true,
    officialUrl: 'https://overthewire.org/wargames/bandit/',
    duration: '34 Progressive Levels',
    verified: true
  },
  {
    id: 5,
    title: 'Oracle Java Documentation & Jakarta EE Guides',
    provider: 'Oracle & Eclipse Foundation',
    instructor: 'Java Platform Engineering Team',
    description: 'Official API documentation for Java 17+, JDBC drivers, and Jakarta Servlet 6.0 specifications.',
    careerCategory: 'Software Engineering',
    topic: 'Java & Servlets',
    skillLevel: 'All Levels',
    resourceType: 'Documentation',
    isFree: true,
    officialUrl: 'https://docs.oracle.com/en/java/javase/17/',
    duration: 'Reference Material',
    verified: true
  },
  {
    id: 6,
    title: 'Full Stack Open — Modern Web Development',
    provider: 'University of Helsinki',
    instructor: 'Matti Luukkainen',
    description: 'World-renowned university course covering modern JavaScript, React, REST APIs, and automated testing.',
    careerCategory: 'Software Engineering',
    topic: 'Full Stack Architecture',
    skillLevel: 'Intermediate',
    resourceType: 'Course',
    isFree: true,
    officialUrl: 'https://fullstackopen.com/en/',
    duration: '70 Hours',
    verified: true
  }
];

export const MASTER_LIVE_EVENTS: LiveEvent[] = [
  {
    id: 1,
    title: 'Architecting Enterprise RAG Pipelines with Gemini & Vector Search',
    instructor: 'Dr. Anand Raman',
    organization: 'AI Engineering Institute',
    topic: 'Retrieval-Augmented Generation',
    date: '2026-10-28',
    time: '18:00 – 19:30 UTC',
    platform: 'Google Meet',
    registrationUrl: 'https://meet.google.com',
    careerCategory: 'AI & Data',
    skillLevel: 'Intermediate',
    isVerified: true
  },
  {
    id: 2,
    title: 'Hands-on Threat Hunting in SIEM: Catching Lateral Movement',
    instructor: 'Rachel Adams, CISSP',
    organization: 'Cyber Defense Academy',
    topic: 'SOC Operations & Log Analysis',
    date: '2026-11-02',
    time: '17:00 – 18:30 UTC',
    platform: 'Zoom',
    registrationUrl: 'https://zoom.us',
    careerCategory: 'Cybersecurity',
    skillLevel: 'Intermediate',
    isVerified: true
  }
];

export const MASTER_PROJECTS: CareerProject[] = [
  {
    id: 1,
    title: 'Autonomous RAG Document Intelligence Engine',
    careerCategory: 'AI & Data',
    difficulty: 'Advanced',
    description: 'Build an enterprise search engine that parses multi-page PDFs, chunks documents semantically, indexes into ChromaDB, and generates cited responses with Gemini.',
    architectureOverview: 'Client Web UI -> Python FastAPI Backend -> LangChain RAG Orchestrator -> Vector Database (Chroma) -> Google Gemini 3.8 Flash',
    techStack: ['Python', 'FastAPI', 'ChromaDB', 'Gemini API', 'LangChain', 'Docker'],
    deliverableChecklist: [
      'Implement recursive character chunking with 200 token overlap',
      'Create cosine similarity retriever with top-k=4 reranked documents',
      'Add streaming token responses with source page citations',
      'Integrate hallucination verification check using Ragas'
    ]
  },
  {
    id: 2,
    title: 'Enterprise SIEM Log Ingestion & Threat Detection System',
    careerCategory: 'Cybersecurity',
    difficulty: 'Advanced',
    description: 'Design a security operations pipeline that streams server authentication logs, identifies suspicious IP patterns, and alerts SOC teams on brute-force attempts.',
    architectureOverview: 'Auditd Log Collector -> Elastic Agent / Syslog -> Logstash Parser -> Elasticsearch -> Kibana SOC Dashboard',
    techStack: ['Linux', 'Elasticsearch', 'Kibana', 'Bash', 'Python', 'Suricata IDS'],
    deliverableChecklist: [
      'Parse Linux /var/log/auth.log into structured JSON telemetry',
      'Write correlation query for >5 failed SSH attempts within 60 seconds',
      'Trigger webhook notification with attacker IP and geo-location',
      'Design Kibana dashboard showing real-time threat map'
    ]
  },
  {
    id: 3,
    title: 'Production Jakarta EE Enterprise Microservices Portal',
    careerCategory: 'Software Engineering',
    difficulty: 'Intermediate',
    description: 'Build a modular Advanced Java web application adhering strictly to MVC architecture with Servlets, JSPs, connection pooling, and session filters.',
    architectureOverview: 'Browser Client -> Apache Tomcat 10.1 -> AuthenticationFilter -> Servlets -> Services -> DAOs -> HikariCP -> MySQL Database',
    techStack: ['Java 17', 'Jakarta Servlets 6.0', 'JSP / JSTL', 'MySQL', 'JDBC', 'Tomcat 10.1'],
    deliverableChecklist: [
      'Configure connection pooling with HikariCP and try-with-resources',
      'Implement AuthenticationFilter and RoleFilter guarding /student/* and /admin/*',
      'Demonstrate RequestDispatcher.forward() and RequestDispatcher.include()',
      'Ensure zero plain text passwords using BCrypt / SHA-256 salted hashes'
    ]
  }
];

export const MASTER_PLACEMENT_QUESTIONS: PlacementItem[] = [
  {
    id: 1,
    careerCategory: 'AI & Data',
    category: 'Technical',
    question: 'What is the fundamental difference between Fine-Tuning an LLM and Retrieval-Augmented Generation (RAG)? When would you choose one over the other?',
    answer: 'RAG dynamically injects external, up-to-date domain knowledge into the model prompt at query time without altering model weights. It provides source citations, prevents hallucination on private data, and is cost-effective. Fine-tuning adjusts the internal neural weights to teach the model a specific style, tone, specialized syntax, or domain terminology. Use RAG when knowledge changes frequently or requires strict verifiability; use Fine-Tuning to change behavioral patterns or formatting compliance.',
    difficulty: 'Hard',
    companyTags: ['Google', 'Microsoft', 'OpenAI', 'Amazon'],
    keyPoints: [
      'RAG updates knowledge without retraining',
      'Fine-tuning modifies weights for style/syntax',
      'RAG provides verifiable citations',
      'Hybrid approach: Fine-tune for query extraction, RAG for retrieval'
    ]
  },
  {
    id: 2,
    careerCategory: 'AI & Data',
    category: 'Technical',
    question: 'How does the Scaled Dot-Product Attention mechanism calculate token weights in the Transformer architecture?',
    answer: 'Attention calculates Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V. The Query vector (what token seeks) is multiplied by Key vectors (what other tokens offer), scaled by sqrt(d_k) to prevent vanishing gradients in the softmax during large dimensions, normalized via softmax into probability distributions, and finally multiplied by Value vectors to produce weighted context representations.',
    difficulty: 'Medium',
    companyTags: ['Meta', 'DeepMind', 'Anthropic'],
    keyPoints: [
      'Dot product Q * K^T measures semantic similarity',
      'Scaling factor sqrt(d_k) stabilizes softmax gradients',
      'Softmax produces probability weights summing to 1.0',
      'Value vectors V are aggregated based on calculated weights'
    ]
  },
  {
    id: 3,
    careerCategory: 'Cybersecurity',
    category: 'Technical',
    question: 'Explain how a Blind SQL Injection attack differs from an In-Band SQL Injection, and how developers prevent it.',
    answer: 'In-band SQL injection allows the attacker to see database results or errors directly on the screen (e.g. UNION-based). In Blind SQL injection, the application does not display data or error messages directly; the attacker must infer truth or falsehood by observing boolean differences (True/False HTTP responses) or injecting time delays (SLEEP(5)). Prevention requires parameterized PreparedStatement queries with bound placeholders (?), strictly disallowing dynamic string concatenation.',
    difficulty: 'Medium',
    companyTags: ['CrowdStrike', 'Palo Alto Networks', 'Cisco'],
    keyPoints: [
      'Blind SQLi infers data via boolean or time delay analysis',
      'In-band displays database errors or UNION tables directly',
      'Never use string concatenation for SQL statements',
      'Always use PreparedStatement with parameterized query binding'
    ]
  },
  {
    id: 4,
    careerCategory: 'Cybersecurity',
    category: 'Technical',
    question: 'What is the role of a SIEM in a modern Security Operations Center (SOC)?',
    answer: 'A Security Information and Event Management (SIEM) system centralizes log aggregation from firewalls, servers, identity providers, and endpoints. It performs real-time correlation against threat intelligence feeds, identifies anomalous behavior (e.g., impossible travel, privilege escalation), triggers automated alerts, and assists incident responders in forensic timelines.',
    difficulty: 'Easy',
    companyTags: ['Mandiant', 'Splunk', 'IBM Security'],
    keyPoints: [
      'Centralized ingestion across heterogeneous endpoints',
      'Real-time rule correlation & anomaly detection',
      'MITRE ATT&CK mapping',
      'Compliance reporting and forensic audit trails'
    ]
  },
  {
    id: 5,
    careerCategory: 'Software Engineering',
    category: 'Technical',
    question: 'In Java Servlets, what is the difference between RequestDispatcher.forward() and HttpServletResponse.sendRedirect()?',
    answer: 'RequestDispatcher.forward() operates completely on the server-side within the container. The browser makes only one HTTP request; request/session attributes are preserved, and the URL in the browser address bar does not change. HttpServletResponse.sendRedirect() issues an HTTP 302 redirect back to the client browser, causing the browser to initiate a completely new GET request; request attributes are lost unless stored in HttpSession, and the address bar changes.',
    difficulty: 'Easy',
    companyTags: ['Infosys', 'TCS', 'Wipro', 'Oracle'],
    keyPoints: [
      'forward() is server-side (1 request); sendRedirect() is client-side (2 requests)',
      'forward() preserves request attributes; sendRedirect() does not',
      'sendRedirect() can redirect to external domains; forward() is within same context',
      'forward() is faster because it saves a network round-trip'
    ]
  }
];

export const MASTER_INSTRUCTORS: InstructorProfile[] = [
  {
    id: 1,
    name: 'Dr. Anand Raman',
    organization: 'AI Research Institute & Former Lead Scientist',
    role: 'Principal AI Architect',
    bio: 'Pioneered early embedding models and enterprise RAG deployments. Author of 12 patents in neural information retrieval.',
    expertise: ['Generative AI', 'Large Language Models', 'Vector Search', 'AI Safety'],
    verified: true
  },
  {
    id: 2,
    name: 'Rachel Adams, CISSP',
    organization: 'Cyber Defense Alliance',
    role: 'Head of Threat Intelligence',
    bio: '15+ years in defensive cybersecurity, incident response lead for Fortune 500 breaches, and active contributor to OWASP.',
    expertise: ['SOC Operations', 'SIEM Correlation', 'Penetration Testing', 'Cloud Defense'],
    verified: true
  },
  {
    id: 3,
    name: 'Prof. K. Venkatesh',
    organization: 'National Institute of Technology',
    role: 'Professor of Computer Science & Jakarta EE Specialist',
    bio: 'Author of Advanced Java Web Development textbooks, mentor to over 10,000 engineering students in enterprise architecture.',
    expertise: ['Advanced Java', 'Jakarta EE', 'Distributed Systems', 'Database Optimization'],
    verified: true
  }
];

// Initial seeded accounts
export const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: 'Administrator',
    email: 'admin@smartcareer.edu',
    role: 'ADMIN',
    college: 'Administration Office',
    degree: 'Staff',
    branch: 'Academic Operations',
    graduationYear: 2020,
    phone: '+91 9000000001',
    status: 'ACTIVE',
    createdAt: '2026-08-01'
  },
  {
    id: 2,
    name: 'Rahul Kumar',
    email: 'rahul@smartcareer.edu',
    role: 'STUDENT',
    college: 'College of Engineering & Technology',
    degree: 'B.Tech',
    branch: 'Computer Science & Engineering',
    graduationYear: 2027,
    phone: '+91 9876543210',
    status: 'ACTIVE',
    createdAt: '2026-09-01'
  },
  {
    id: 3,
    name: 'Priya Sharma',
    email: 'priya@smartcareer.edu',
    role: 'STUDENT',
    college: 'Institute of Information Technology',
    degree: 'B.Tech',
    branch: 'Information Technology',
    graduationYear: 2027,
    phone: '+91 9876543211',
    status: 'ACTIVE',
    createdAt: '2026-09-05'
  }
];

export const INITIAL_STUDENT_PROFILES: Record<number, StudentProfile> = {
  // Rahul's Profile (Generative AI Engineer)
  2: {
    id: 1,
    userId: 2,
    careerPathId: 1,
    careerTitle: 'Generative AI Engineer',
    targetJobRole: 'GenAI Software Engineer',
    skillLevel: 'Beginner',
    existingSkillIds: [1, 5], // Python, SQL
    learningGoal: 'Placement',
    weeklyHours: 15,
    targetCompletionDate: '2027-04-30',
    preferredFormat: 'Hands-on coding',
    isCompleted: true,
    createdAt: '2026-09-01'
  },
  // Priya's Profile (Cybersecurity Analyst)
  3: {
    id: 2,
    userId: 3,
    careerPathId: 2,
    careerTitle: 'Cybersecurity Analyst & Ethical Hacker',
    targetJobRole: 'SOC Analyst L1',
    skillLevel: 'Intermediate',
    existingSkillIds: [13, 14], // Networking, Linux
    learningGoal: 'Job',
    weeklyHours: 18,
    targetCompletionDate: '2027-03-15',
    preferredFormat: 'Projects',
    isCompleted: true,
    createdAt: '2026-09-05'
  }
};
