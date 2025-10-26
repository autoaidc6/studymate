
import { KeyStage } from './types';

export const KEY_STAGES: KeyStage[] = [
  { id: 1, name: 'KS1', description: 'Ages 5-7', years: [{id: 1, name: 'Year 1'}, {id: 2, name: 'Year 2'}] },
  { id: 2, name: 'KS2', description: 'Ages 7-11', years: [{id: 3, name: 'Year 3'}, {id: 4, name: 'Year 4'}, {id: 5, name: 'Year 5'}, {id: 6, name: 'Year 6'}] },
  { id: 3, name: 'KS3', description: 'Ages 11-14', years: [{id: 7, name: 'Year 7'}, {id: 8, name: 'Year 8'}, {id: 9, name: 'Year 9'}] },
  { id: 4, name: 'KS4', description: 'Ages 14-16', years: [{id: 10, name: 'Year 10'}, {id: 11, name: 'Year 11'}] },
  { id: 5, name: 'KS5', description: 'Ages 16-18', years: [{id: 12, name: 'Year 12'}, {id: 13, name: 'Year 13'}] },
];