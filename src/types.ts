/**
 * Data Models for Smart Career Platform
 * AI-Powered Career Guidance & Personalized Learning Platform
 */

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  phone?: string;
  college?: string;
  degree?: string;
  branch?: string;
  graduationYear?: number;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export interface CareerPath {
  id: number;
  title: string;
  category: 'AI & Data' | 'Cybersecurity' | 'Software Engineering' | 'Cloud & DevOps' | 'Quality Engineering';
  description: string;
  icon: string;
  estimatedMonths: number;
  demandLevel: 'High' | 'Very High' | 'Ultra High';
  averageSalaryRange: string;
  keySkills: string[];
}

export interface Skill {
  id: number;
  category: 'Programming' | 'AI & Data' | 'Cybersecurity' | 'Cloud & DevOps' | 'Core CS';
  name: string;
}

export interface StudentProfile {
  id: number;
  userId: number;
  careerPathId: number;
  careerTitle: string;
  targetJobRole: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  existingSkillIds: number[];
  learningGoal: 'Placement' | 'Internship' | 'Job' | 'Career Switch' | 'Freelancing' | 'Higher Studies' | 'Certification' | 'Personal Learning';
  weeklyHours: number;
  targetCompletionDate: string;
  preferredFormat: 'Hands-on coding' | 'Projects' | 'Courses' | 'Videos' | 'Reading' | 'Mixed';
  isCompleted: boolean;
  createdAt?: string;
}

export interface RoadmapTopic {
  id: number;
  careerPathId: number;
  phaseNumber: number;
  phaseTitle: string;
  topicName: string;
  description: string;
  keyConcepts: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  orderIndex: number;
  isCompleted?: boolean;
}

export interface LearningResource {
  id: number;
  title: string;
  provider: string;
  instructor?: string;
  description: string;
  careerCategory: string;
  topic: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  resourceType: 'Course' | 'Video' | 'Documentation' | 'Book' | 'Project' | 'Tutorial';
  isFree: boolean;
  officialUrl: string;
  duration?: string;
  verified: boolean;
}

export interface LiveEvent {
  id: number;
  title: string;
  instructor: string;
  organization: string;
  topic: string;
  date: string;
  time: string;
  platform: 'Zoom' | 'Google Meet' | 'YouTube Live' | 'Official Platform';
  registrationUrl: string;
  careerCategory: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  isVerified: boolean;
}

export interface CareerProject {
  id: number;
  title: string;
  careerCategory: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  architectureOverview: string;
  techStack: string[];
  deliverableChecklist: string[];
  githubTemplateUrl?: string;
}

export interface PlacementItem {
  id: number;
  careerCategory: string;
  category: 'Technical' | 'Coding' | 'System Design' | 'HR' | 'Aptitude';
  question: string;
  answer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  companyTags: string[];
  keyPoints: string[];
}

export interface InstructorProfile {
  id: number;
  name: string;
  organization: string;
  role: string;
  bio: string;
  expertise: string[];
  verified: boolean;
}

export interface StudyLog {
  id: number;
  userId: number;
  topicName: string;
  durationMinutes: number;
  date: string;
  notes: string;
}
