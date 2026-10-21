import { Subject, Topic, Task, StudySession, Goal, TestRecord, User, WeeklyPlanItem, AppNotification } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: 'Administrator',
    username: 'admin',
    email: 'admin@smarttracker.edu',
    role: 'ADMIN',
    phone: '+91 9000000001',
    department: 'Academic Administration',
    course: 'Staff',
    semester: 'Staff',
    status: 'ACTIVE',
    bio: 'System Administrator & Head of Academic Monitoring.',
    createdAt: '2026-08-01'
  },
  {
    id: 2,
    name: 'Rahul Kumar',
    username: 'rahul',
    email: 'rahul@smarttracker.edu',
    role: 'STUDENT',
    phone: '+91 9876543210',
    department: 'Computer Science & Engineering',
    course: 'B.Tech',
    semester: '6th Semester',
    status: 'ACTIVE',
    targetCgpa: 8.8,
    bio: 'Aspiring Full-Stack Software Engineer focusing on Jakarta EE, Distributed Systems & Database Optimization.',
    createdAt: '2026-09-01'
  },
  {
    id: 3,
    name: 'Priya Sharma',
    username: 'priya',
    email: 'priya@smarttracker.edu',
    role: 'STUDENT',
    phone: '+91 9876543211',
    department: 'Information Technology',
    course: 'B.Tech',
    semester: '5th Semester',
    status: 'ACTIVE',
    targetCgpa: 9.2,
    bio: 'Passionate about Cloud Architecture, API Design, and Web Technologies.',
    createdAt: '2026-09-05'
  },
  {
    id: 4,
    name: 'Alex Mercer',
    username: 'alex',
    email: 'alex@college.edu',
    role: 'STUDENT',
    phone: '+1 555-0199',
    department: 'Software Engineering',
    course: 'B.Tech',
    semester: '6th Semester',
    status: 'ACTIVE',
    targetCgpa: 8.5,
    bio: 'Focusing on Systems Programming, Operating Systems, and Network Protocols.',
    createdAt: '2026-09-10'
  }
];

export const INITIAL_USER: User = INITIAL_USERS[1]; // Rahul Kumar by default for "Welcome back, Rahul 👋"

export const INITIAL_WEEKLY_PLAN: WeeklyPlanItem[] = [
  {
    id: 1,
    userId: 2,
    subjectId: 1,
    subjectName: 'Advanced Java',
    dayOfWeek: 'Monday',
    planDate: '2026-10-05',
    plannedMinutes: 90,
    focusNotes: 'Master JDBC Connection Pooling & Transaction Management',
    status: 'Completed'
  },
  {
    id: 2,
    userId: 2,
    subjectId: 1,
    subjectName: 'Advanced Java',
    dayOfWeek: 'Tuesday',
    planDate: '2026-10-06',
    plannedMinutes: 120,
    focusNotes: 'MVC Architecture: Servlets to JSP Request Dispatcher',
    status: 'Pending'
  },
  {
    id: 3,
    userId: 2,
    subjectId: 2,
    subjectName: 'Database Management Systems',
    dayOfWeek: 'Wednesday',
    planDate: '2026-10-07',
    plannedMinutes: 90,
    focusNotes: 'Practice 2-Phase Locking (2PL) Concurrency Questions',
    status: 'Pending'
  },
  {
    id: 4,
    userId: 2,
    subjectId: 3,
    subjectName: 'Computer Networks',
    dayOfWeek: 'Thursday',
    planDate: '2026-10-08',
    plannedMinutes: 60,
    focusNotes: 'CIDR /27 and /28 Subnetting Calculations',
    status: 'Pending'
  },
  {
    id: 5,
    userId: 2,
    subjectId: 1,
    subjectName: 'Advanced Java',
    dayOfWeek: 'Friday',
    planDate: '2026-10-09',
    plannedMinutes: 120,
    focusNotes: 'Revision for Unit Test 2 on MVC & Sessions',
    status: 'Pending'
  },
  {
    id: 6,
    userId: 2,
    subjectId: 4,
    subjectName: 'Operating Systems',
    dayOfWeek: 'Saturday',
    planDate: '2026-10-10',
    plannedMinutes: 90,
    focusNotes: 'Virtual Memory Paging & LRU Simulation Review',
    status: 'Pending'
  },
  {
    id: 7,
    userId: 2,
    subjectId: 2,
    subjectName: 'Database Management Systems',
    dayOfWeek: 'Sunday',
    planDate: '2026-10-11',
    plannedMinutes: 60,
    focusNotes: 'Weekly Mock Quiz & Self-Assessment Revision',
    status: 'Pending'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 1,
    userId: 2,
    title: 'Upcoming Exam in 4 Days',
    message: 'Unit Test 2 on Advanced Java MVC & Sessions is scheduled for this Friday.',
    type: 'DEADLINE',
    isRead: false,
    createdAt: '2026-10-05 08:00'
  },
  {
    id: 2,
    userId: 2,
    title: 'Priority Recommendation',
    message: 'Your Advanced Java score is 68%, below your 85% target. Focus on JDBC revision today.',
    type: 'RECOMMENDATION',
    isRead: false,
    createdAt: '2026-10-04 19:30'
  },
  {
    id: 3,
    userId: 2,
    title: '4-Day Study Streak Active 🔥',
    message: 'Great discipline! You have completed study sessions for 4 consecutive days.',
    type: 'ALERT',
    isRead: true,
    createdAt: '2026-10-04 10:15'
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 1,
    name: 'Advanced Java',
    description: 'Servlets, JSP, JDBC, MVC architecture, Jakarta EE specifications, and Web Application development.',
    priority: 'High',
    targetPercentage: 85,
    totalTopics: 5,
    completedTopics: 2,
    overallProgress: 68
  },
  {
    id: 2,
    name: 'Database Management Systems',
    description: 'Relational algebra, SQL, normalization, concurrency control, transaction ACID properties, and indexing.',
    priority: 'High',
    targetPercentage: 80,
    totalTopics: 3,
    completedTopics: 2,
    overallProgress: 80
  },
  {
    id: 3,
    name: 'Computer Networks',
    description: 'OSI reference model, TCP/IP protocol suite, subnetting, routing algorithms, socket programming, and HTTP.',
    priority: 'Medium',
    targetPercentage: 75,
    totalTopics: 2,
    completedTopics: 1,
    overallProgress: 80
  },
  {
    id: 4,
    name: 'Operating Systems',
    description: 'Process scheduling, deadlocks, virtual memory management, file systems, synchronization, and POSIX threads.',
    priority: 'Medium',
    targetPercentage: 80,
    totalTopics: 2,
    completedTopics: 1,
    overallProgress: 72
  },
  {
    id: 5,
    name: 'Software Engineering',
    description: 'Agile methodologies, SDLC models, UML diagramming, software metrics, testing strategies, and design patterns.',
    priority: 'Low',
    targetPercentage: 70,
    totalTopics: 1,
    completedTopics: 1,
    overallProgress: 100
  }
];

export const INITIAL_TOPICS: Topic[] = [
  {
    id: 1,
    subjectId: 1,
    subjectName: 'Advanced Java',
    name: 'Servlet Lifecycle & Architecture',
    description: 'HttpServlet request/response cycle, init, service, destroy methods, and web.xml deployment descriptor.',
    difficulty: 'Medium',
    status: 'Completed',
    progressPercentage: 100,
    confidenceLevel: 5,
    lastStudied: '2026-10-04',
    revisionCount: 2
  },
  {
    id: 2,
    subjectId: 1,
    subjectName: 'Advanced Java',
    name: 'JDBC Database Connectivity',
    description: 'DriverManager, Connection pooling, PreparedStatement, ResultSet, and SQL injection prevention.',
    difficulty: 'Hard',
    status: 'Completed',
    progressPercentage: 100,
    confidenceLevel: 4,
    lastStudied: '2026-10-03',
    revisionCount: 2
  },
  {
    id: 3,
    subjectId: 1,
    subjectName: 'Advanced Java',
    name: 'JSP Directives & Expression Language',
    description: 'Standard directives, custom tags, JSTL core library, and expression language syntax.',
    difficulty: 'Medium',
    status: 'In Progress',
    progressPercentage: 70,
    confidenceLevel: 4,
    lastStudied: '2026-10-02',
    revisionCount: 1
  },
  {
    id: 4,
    subjectId: 1,
    subjectName: 'Advanced Java',
    name: 'Session Tracking & Authentication',
    description: 'HttpSession API, cookies, URL rewriting, hidden form fields, and security filters.',
    difficulty: 'Hard',
    status: 'In Progress',
    progressPercentage: 50,
    confidenceLevel: 3,
    lastStudied: '2026-10-01',
    revisionCount: 1
  },
  {
    id: 5,
    subjectId: 1,
    subjectName: 'Advanced Java',
    name: 'MVC Design Pattern Implementation',
    description: 'Model POJOs, Controller Servlets, View JSPs, and request dispatching.',
    difficulty: 'Hard',
    status: 'Not Started',
    progressPercentage: 20,
    confidenceLevel: 2,
    lastStudied: undefined,
    revisionCount: 0
  },
  {
    id: 6,
    subjectId: 2,
    subjectName: 'Database Management Systems',
    name: 'Relational Schema & Normalization',
    description: '1NF, 2NF, 3NF, BCNF, functional dependencies, and lossless decomposition.',
    difficulty: 'Hard',
    status: 'Completed',
    progressPercentage: 100,
    confidenceLevel: 4,
    lastStudied: '2026-10-03',
    revisionCount: 2
  },
  {
    id: 7,
    subjectId: 2,
    subjectName: 'Database Management Systems',
    name: 'SQL Joins & Nested Queries',
    description: 'Inner, outer, left, right joins, correlated subqueries, and grouping aggregations.',
    difficulty: 'Medium',
    status: 'Completed',
    progressPercentage: 100,
    confidenceLevel: 5,
    lastStudied: '2026-10-01',
    revisionCount: 3
  },
  {
    id: 8,
    subjectId: 2,
    subjectName: 'Database Management Systems',
    name: 'Transaction ACID & Concurrency',
    description: 'Serializability, 2PL, deadlock prevention, isolation levels, and write-ahead logging.',
    difficulty: 'Hard',
    status: 'In Progress',
    progressPercentage: 40,
    confidenceLevel: 2,
    lastStudied: '2026-09-29',
    revisionCount: 1
  },
  {
    id: 9,
    subjectId: 3,
    subjectName: 'Computer Networks',
    name: 'TCP vs UDP Protocols',
    description: '3-way handshake, congestion control, windowing, and datagram packet delivery.',
    difficulty: 'Medium',
    status: 'Completed',
    progressPercentage: 100,
    confidenceLevel: 4,
    lastStudied: '2026-09-30',
    revisionCount: 2
  },
  {
    id: 10,
    subjectId: 3,
    subjectName: 'Computer Networks',
    name: 'IPv4 Subnetting & CIDR',
    description: 'Classless addressing, subnet masks, network prefix calculation, and broadcast domains.',
    difficulty: 'Hard',
    status: 'In Progress',
    progressPercentage: 60,
    confidenceLevel: 3,
    lastStudied: '2026-09-28',
    revisionCount: 1
  },
  {
    id: 11,
    subjectId: 4,
    subjectName: 'Operating Systems',
    name: 'CPU Scheduling Algorithms',
    description: 'FCFS, SJF, Round Robin, priority scheduling, and multi-level feedback queues.',
    difficulty: 'Easy',
    status: 'Completed',
    progressPercentage: 100,
    confidenceLevel: 5,
    lastStudied: '2026-09-27',
    revisionCount: 2
  },
  {
    id: 12,
    subjectId: 4,
    subjectName: 'Operating Systems',
    name: 'Virtual Memory & Paging',
    description: 'Demand paging, page fault handling, FIFO, LRU, and Optimal replacement algorithms.',
    difficulty: 'Hard',
    status: 'In Progress',
    progressPercentage: 45,
    confidenceLevel: 2,
    lastStudied: '2026-09-26',
    revisionCount: 1
  },
  {
    id: 13,
    subjectId: 5,
    subjectName: 'Software Engineering',
    name: 'Agile Scrum Framework',
    description: 'Sprints, daily standups, backlog refinement, user stories, and retrospectives.',
    difficulty: 'Easy',
    status: 'Completed',
    progressPercentage: 100,
    confidenceLevel: 5,
    lastStudied: '2026-09-23',
    revisionCount: 1
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    subjectId: 1,
    subjectName: 'Advanced Java',
    topicId: 4,
    title: 'Implement Session AuthFilter for protected JSPs',
    description: 'Write an implementation of jakarta.servlet.Filter to guard dashboard.jsp and settings.',
    priority: 'High',
    dueDate: '2026-10-06',
    estimatedMinutes: 90,
    status: 'In Progress'
  },
  {
    id: 2,
    subjectId: 1,
    subjectName: 'Advanced Java',
    topicId: 5,
    title: 'Code MVC Dispatcher for SubjectServlet',
    description: 'Forward request objects to WEB-INF/jsp/subjects.jsp with JSTL table iterations.',
    priority: 'High',
    dueDate: '2026-10-08',
    estimatedMinutes: 120,
    status: 'Pending'
  },
  {
    id: 3,
    subjectId: 2,
    subjectName: 'Database Management Systems',
    topicId: 8,
    title: 'Practice 2PL concurrency locking questions',
    description: 'Solve previous year exam problems on Strict Two-Phase Locking and conflict serializability.',
    priority: 'Medium',
    dueDate: '2026-10-09',
    estimatedMinutes: 75,
    status: 'Pending'
  },
  {
    id: 4,
    subjectId: 3,
    subjectName: 'Computer Networks',
    topicId: 10,
    title: 'Complete CIDR subnetting worksheet',
    description: 'Calculate network addresses and usable host counts for /26 and /28 subnets.',
    priority: 'Medium',
    dueDate: '2026-10-07',
    estimatedMinutes: 60,
    status: 'In Progress'
  },
  {
    id: 5,
    subjectId: 4,
    subjectName: 'Operating Systems',
    topicId: 12,
    title: 'Simulate LRU Page Replacement in Java',
    description: 'Write a mini console program simulating page hits and page faults for 10 references.',
    priority: 'Low',
    dueDate: '2026-10-04',
    estimatedMinutes: 90,
    status: 'Overdue'
  },
  {
    id: 6,
    subjectId: 1,
    subjectName: 'Advanced Java',
    topicId: 2,
    title: 'Test DBConnection try-with-resources',
    description: 'Ensure all connections, statements and result sets close properly without memory leaks.',
    priority: 'High',
    dueDate: '2026-10-03',
    estimatedMinutes: 45,
    status: 'Completed'
  }
];

export const INITIAL_SESSIONS: StudySession[] = [
  {
    id: 1,
    subjectId: 1,
    subjectName: 'Advanced Java',
    topicId: 1,
    topicName: 'Servlet Lifecycle & Architecture',
    studyDate: '2026-10-01',
    startTime: '09:00',
    endTime: '10:30',
    durationMinutes: 90,
    notes: 'Studied Servlet request handling and response streaming with HttpServlet.'
  },
  {
    id: 2,
    subjectId: 1,
    subjectName: 'Advanced Java',
    topicId: 2,
    topicName: 'JDBC Database Connectivity',
    studyDate: '2026-10-02',
    startTime: '14:00',
    endTime: '16:00',
    durationMinutes: 120,
    notes: 'Implemented PreparedStatement queries and tested parameter binding.'
  },
  {
    id: 3,
    subjectId: 2,
    subjectName: 'Database Management Systems',
    topicId: 6,
    topicName: 'Relational Schema & Normalization',
    studyDate: '2026-10-03',
    startTime: '10:00',
    endTime: '11:45',
    durationMinutes: 105,
    notes: 'Worked on BCNF decomposition examples and dependency preservation.'
  },
  {
    id: 4,
    subjectId: 1,
    subjectName: 'Advanced Java',
    topicId: 3,
    topicName: 'JSP Directives & Expression Language',
    studyDate: '2026-10-04',
    startTime: '15:30',
    endTime: '17:30',
    durationMinutes: 120,
    notes: 'Configured JSTL tags <c:forEach> and <c:if> inside JSP templates.'
  },
  {
    id: 5,
    subjectId: 3,
    subjectName: 'Computer Networks',
    topicId: 9,
    topicName: 'TCP vs UDP Protocols',
    studyDate: '2026-10-05',
    startTime: '08:30',
    endTime: '10:00',
    durationMinutes: 90,
    notes: 'Reviewed TCP flow control, sliding window protocol, and SYN-ACK sequencing.'
  }
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 1,
    title: 'Master Advanced Java Core Modules',
    description: 'Complete Servlets, JSP and JDBC topics with full hands-on code examples.',
    targetValue: 5,
    currentValue: 3,
    unit: 'Topics',
    deadline: '2026-10-15',
    status: 'Active'
  },
  {
    id: 2,
    title: 'Weekly Study Target',
    description: 'Log at least 15 hours of focused revision across all technical subjects.',
    targetValue: 15,
    currentValue: 8.75,
    unit: 'Hours',
    deadline: '2026-10-08',
    status: 'Active'
  },
  {
    id: 3,
    title: 'Score Distinction in DBMS Mid-Term',
    description: 'Target score of 85% or higher on upcoming DBMS internal evaluation.',
    targetValue: 85,
    currentValue: 82,
    unit: 'Marks %',
    deadline: '2026-10-19',
    status: 'Active'
  },
  {
    id: 4,
    title: 'Complete Operating Systems Unit 2',
    description: 'Finish CPU scheduling and deadlock detection algorithms.',
    targetValue: 2,
    currentValue: 2,
    unit: 'Units',
    deadline: '2026-10-02',
    status: 'Completed'
  }
];

export const INITIAL_TESTS: TestRecord[] = [
  {
    id: 1,
    subjectId: 1,
    subjectName: 'Advanced Java',
    topicId: 2,
    topicName: 'JDBC Database Connectivity',
    testName: 'Java Servlets & JDBC Quiz 1',
    testDate: '2026-09-20',
    marksObtained: 44,
    totalMarks: 50,
    percentage: 88,
    notes: 'Good understanding of SQL injection prevention. Minor error in servlet lifecycle init parameters.'
  },
  {
    id: 2,
    subjectId: 2,
    subjectName: 'Database Management Systems',
    topicId: 6,
    topicName: 'Relational Schema & Normalization',
    testName: 'DBMS Normalization Internal Assessment',
    testDate: '2026-09-25',
    marksObtained: 26,
    totalMarks: 30,
    percentage: 86.7,
    notes: 'Solved BCNF decomposition cleanly. Well written functional dependency proofs.'
  },
  {
    id: 3,
    subjectId: 3,
    subjectName: 'Computer Networks',
    topicId: 9,
    topicName: 'TCP vs UDP Protocols',
    testName: 'Computer Networks Unit Test',
    testDate: '2026-09-29',
    marksObtained: 18,
    totalMarks: 25,
    percentage: 72,
    notes: 'Need further revision on TCP windowing and congestion window calculations.'
  },
  {
    id: 4,
    subjectId: 4,
    subjectName: 'Operating Systems',
    topicId: 11,
    topicName: 'CPU Scheduling Algorithms',
    testName: 'Operating Systems Mid-Term Quiz',
    testDate: '2026-10-02',
    marksObtained: 38,
    totalMarks: 40,
    percentage: 95,
    notes: 'Excellent Gantt chart representation for Round Robin and SJF algorithms.'
  }
];
