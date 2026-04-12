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
