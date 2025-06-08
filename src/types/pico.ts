// types/pico.ts - PICO Type Definitions

export interface PICOCriterion {
  id: string;
  text: string;
  order: number;
}

export interface PICOCategory {
  inclusions: PICOCriterion[];
  exclusions: PICOCriterion[];
}

export interface PICOData {
  population: PICOCategory;
  intervention: PICOCategory;
  comparator: PICOCategory;
  outcome: PICOCategory;
  others: PICOCategory;
}

export interface PICOCategoryConfig {
  key: keyof PICOData;
  title: string;
  icon: any;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'gray';
  description: string;
}

export interface DraggedItem {
  category: keyof PICOData;
  type: 'inclusions' | 'exclusions';
  index: number;
  text: string;
}

export interface StudyObjective {
  text: string;
  isGenerated: boolean;
  generatedAt?: string;
}

export type PICOFlowType = 'ai' | 'manual' | null;