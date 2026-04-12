import { SavedStudyGuide } from '../types';

const STORAGE_KEY = 'studyMateSavedGuides';

export const getSavedGuides = (): SavedStudyGuide[] => {
  try {
    const savedGuidesJSON = localStorage.getItem(STORAGE_KEY);
    if (savedGuidesJSON) {
      return JSON.parse(savedGuidesJSON);
    }
  } catch (error) {
    console.error("Failed to parse saved guides from localStorage:", error);
  }
  return [];
};

export const saveGuide = (guide: SavedStudyGuide): void => {
  const guides = getSavedGuides();
  guides.unshift(guide); // Add new guide to the beginning
  localStorage.setItem(STORAGE_KEY, JSON.stringify(guides));
};

export const deleteGuide = (guideId: string): void => {
  let guides = getSavedGuides();
  guides = guides.filter(g => g.id !== guideId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(guides));
};
