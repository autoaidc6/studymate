
export interface KeyStage {
  id: number;
  name: string;
  description: string;
}

export enum ResourceType {
  SUMMARY = 'SUMMARY',
  KEY_POINTS = 'KEY_POINTS',
  RESOURCE_LINK = 'RESOURCE_LINK',
  VIDEO_GUIDE = 'VIDEO_GUIDE',
  PDF_NOTES = 'PDF_NOTES',
  GOOGLE_DOC = 'GOOGLE_DOC',
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