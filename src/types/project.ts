// types/project.ts - Project Type Definitions

export interface ProjectProgress {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export interface Project {
  id: number;
  name: string;
  creationDate: string;
  modifiedDate: string;
  creator: string;
  diseaseCategory: string;
  domain: string;
  progress: ProjectProgress;
}

export interface NewProject {
  name: string;
  diseaseCategory: string;
  domain: string;
  creator: string;
}

export type ViewMode = 'grid' | 'list';
export type SortBy = 'name' | 'creationDate' | 'modifiedDate' | 'creator' | 'diseaseCategory';
export type SortOrder = 'asc' | 'desc';