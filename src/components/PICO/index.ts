// components/PICO/index.ts - PICO Components Export Index

// Main page component
export { default as PICOCriteriaPage } from '../PICOCriteriaPage/PICOCriteriaPage';

// Core PICO components
export { default as PICOFlowSelector } from '../PICOFlowSelector/PICOFlowSelector';
export { default as PICOCriteriaBuilder } from '../PICOCriteriaBuilder/PICOCriteriaBuilder';
export { default as PICOCategoryCard } from '../PICOCategoryCard/PICOCategoryCard';
export { default as PICOCriterionItem } from '../PICOCriterionItem/PICOCriterionItem';

// Modal components
export { default as StudyObjectiveModal } from '../StudyObjectiveModal/StudyObjectiveModal';

// Shared components
export { default as WorkflowSidebar } from '../WorkflowSidebar/WorkflowSidebar';

// Re-export types
export type {
  PICOData,
  PICOCategory,
  PICOCriterion,
  PICOCategoryConfig,
  DraggedItem,
  StudyObjective,
  PICOFlowType
} from '../../types/pico';

// Re-export constants
export {
  PICO_CATEGORIES,
  DEFAULT_PICO_DATA,
  PICO_COLOR_CLASSES
} from '../../constants/pico';