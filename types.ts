export interface Year {
  id: number;
  name: string;
}

export interface KeyStage {
  id: number;
  name: string;
  description: string;
  years: Year[];
}

export enum ResourceType {
  SUMMARY = 'SUMMARY',
  KEY_POINTS = 'KEY_POINTS',
  RESOURCE_LINK = 'RESOURCE_LINK',
  VIDEO_GUIDE = 'VIDEO_GUIDE',
  PDF_NOTES = 'PDF_NOTES',
  GOOGLE_DOC = 'GOOGLE_DOC',
  FLASHCARDS = 'FLASHCARDS',
  CONCEPT_MAP = 'CONCEPT_MAP',
  CHEAT_SHEET = 'CHEAT_SHEET',
  WORKSHEET = 'WORKSHEET',
  QUIZ = 'QUIZ',
}

export type UserRole = 'parent' | 'student' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  name: string;
  username?: string;
  parentUid?: string;
  yearGroup?: string;
  birthMonth?: number;
  birthYear?: number;
  school?: string;
  recommenderEnabled?: boolean;
  selfAssignEnabled?: boolean;
  setupToken?: string;
  points?: number;
  subscriptionStatus?: 'free' | 'active' | 'canceled';
  createdAt: string;
}

export interface Activity {
  id: string;
  title: string;
  subject: 'Maths' | 'English' | 'Science';
  yearGroup: string;
  type: string;
  content: any;
  pointsValue: number;
  createdAt: string;
}

export interface Score {
  id: string;
  userUid: string;
  activityId: string;
  score: number;
  completedAt: string;
  feedback?: string;
}

export interface Reward {
  id: string;
  parentUid: string;
  studentUid: string;
  category: string;
  description: string;
  websiteLink?: string;
  pointsRequired: number;
  status: 'in-progress' | 'achieved' | 'claimed';
  createdAt: string;
}

export interface Assignment {
  id: string;
  parentUid: string;
  studentUid: string;
  activityId: string;
  activityTitle: string;
  subject: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedAt: string;
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface StudyMaterial {
  title: string;
  type: ResourceType;
  content: string;
  source?: string;
}

export interface StudyGuide {
  studyMaterials: StudyMaterial[];
}

export interface SavedStudyGuide {
  id: string;
  topic: string;
  keyStageName: string;
  yearName: string;
  savedAt: string;
  materials: StudyMaterial[];
}
