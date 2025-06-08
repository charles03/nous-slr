// hooks/usePICO.ts - Custom Hooks for PICO Functionality

import { useState, useCallback, useEffect } from 'react';
import { PICOData, PICOCriterion, DraggedItem, StudyObjective } from '../types/pico';
import { DEFAULT_PICO_DATA } from '../constants/pico';
import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook for managing PICO criteria state and operations
 */
export function usePICOCriteria(projectId?: string | number) {
  const storageKey = projectId ? `pico_data_${projectId}` : 'pico_data_temp';
  const [picoData, setPicoData] = useLocalStorage<PICOData>(storageKey, DEFAULT_PICO_DATA);
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);

  const addCriterion = useCallback((
    category: keyof PICOData,
    type: 'inclusions' | 'exclusions',
    text: string = 'New criterion'
  ) => {
    const newCriterion: PICOCriterion = {
      id: `${category}_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text,
      order: picoData[category][type].length
    };

    setPicoData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: [...prev[category][type], newCriterion]
      }
    }));

    return newCriterion.id;
  }, [picoData, setPicoData]);

  const updateCriterion = useCallback((
    category: keyof PICOData,
    type: 'inclusions' | 'exclusions',
    index: number,
    newText: string
  ) => {
    setPicoData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: prev[category][type].map((item, i) => 
          i === index ? { ...item, text: newText } : item
        )
      }
    }));
  }, [setPicoData]);

  const removeCriterion = useCallback((
    category: keyof PICOData,
    type: 'inclusions' | 'exclusions',
    index: number
  ) => {
    setPicoData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: prev[category][type].filter((_, i) => i !== index)
      }
    }));
  }, [setPicoData]);

  const moveCriterion = useCallback((
    fromCategory: keyof PICOData,
    fromType: 'inclusions' | 'exclusions',
    fromIndex: number,
    toCategory: keyof PICOData,
    toType: 'inclusions' | 'exclusions',
    toIndex?: number
  ) => {
    if (fromCategory === toCategory && fromType === toType && fromIndex === toIndex) {
      return; // No change needed
    }

    setPicoData(prev => {
      const newData = { ...prev };
      
      // Remove from original position
      const [movedItem] = newData[fromCategory][fromType].splice(fromIndex, 1);
      
      // Add to new position with updated ID and order
      const insertIndex = toIndex !== undefined ? toIndex : newData[toCategory][toType].length;
      const updatedItem = {
        ...movedItem,
        id: `${toCategory}_${toType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order: insertIndex
      };
      
      newData[toCategory][toType].splice(insertIndex, 0, updatedItem);
      
      // Update order for all items in the target category
      newData[toCategory][toType].forEach((item, index) => {
        item.order = index;
      });

      return newData;
    });
  }, [setPicoData]);

  const resetPICOData = useCallback(() => {
    setPicoData(DEFAULT_PICO_DATA);
  }, [setPicoData]);

  const bulkUpdatePICOData = useCallback((newPicoData: PICOData) => {
    setPicoData(newPicoData);
  }, [setPicoData]);

  return {
    picoData,
    draggedItem,
    setDraggedItem,
    addCriterion,
    updateCriterion,
    removeCriterion,
    moveCriterion,
    resetPICOData,
    bulkUpdatePICOData
  };
}

/**
 * Custom hook for managing study objective state
 */
export function useStudyObjective(projectId?: string | number) {
  const storageKey = projectId ? `study_objective_${projectId}` : 'study_objective_temp';
  const [studyObjective, setStudyObjective] = useLocalStorage<StudyObjective>(
    storageKey,
    { text: '', isGenerated: false }
  );

  const updateObjective = useCallback((text: string, isGenerated: boolean = false) => {
    setStudyObjective({
      text,
      isGenerated,
      generatedAt: isGenerated ? new Date().toISOString() : undefined
    });
  }, [setStudyObjective]);

  const clearObjective = useCallback(() => {
    setStudyObjective({ text: '', isGenerated: false });
  }, [setStudyObjective]);

  return {
    studyObjective,
    updateObjective,
    clearObjective
  };
}

/**
 * Custom hook for managing PICO section expansion state
 */
export function usePICOSectionExpansion(initialState: boolean = true) {
  const [allSectionsExpanded, setAllSectionsExpanded] = useState(initialState);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Initialize section states based on categories
  useEffect(() => {
    setExpandedSections({
      population: allSectionsExpanded,
      intervention: allSectionsExpanded,
      comparator: allSectionsExpanded,
      outcome: allSectionsExpanded,
      others: allSectionsExpanded
    });
  }, [allSectionsExpanded]);

  const toggleSection = useCallback((sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  }, []);

  const toggleAllSections = useCallback(() => {
    const newState = !allSectionsExpanded;
    setAllSectionsExpanded(newState);
  }, [allSectionsExpanded]);

  const expandAllSections = useCallback(() => {
    setAllSectionsExpanded(true);
  }, []);

  const collapseAllSections = useCallback(() => {
    setAllSectionsExpanded(false);
  }, []);

  return {
    allSectionsExpanded,
    expandedSections,
    toggleSection,
    toggleAllSections,
    expandAllSections,
    collapseAllSections
  };
}

/**
 * Custom hook for PICO validation and completion checking
 */
export function usePICOValidation(picoData: PICOData) {
  const validatePICOCompleteness = useCallback((data: PICOData) => {
    const categories = Object.keys(data) as (keyof PICOData)[];
    const validation = {
      isComplete: true,
      issues: [] as string[],
      warnings: [] as string[],
      categoryStatus: {} as Record<keyof PICOData, { hasInclusions: boolean; hasExclusions: boolean; isComplete: boolean }>
    };

    categories.forEach(category => {
      const hasInclusions = data[category].inclusions.length > 0;
      const hasExclusions = data[category].exclusions.length > 0;
      const isComplete = hasInclusions || hasExclusions;

      validation.categoryStatus[category] = {
        hasInclusions,
        hasExclusions,
        isComplete
      };

      if (!isComplete) {
        validation.isComplete = false;
        validation.issues.push(`${category} has no criteria defined`);
      } else if (!hasInclusions) {
        validation.warnings.push(`${category} has no inclusion criteria`);
      } else if (!hasExclusions) {
        validation.warnings.push(`${category} has no exclusion criteria`);
      }
    });

    return validation;
  }, []);

  const validation = validatePICOCompleteness(picoData);

  const getCompletionPercentage = useCallback((data: PICOData) => {
    const categories = Object.keys(data) as (keyof PICOData)[];
    const completedCategories = categories.filter(category => 
      data[category].inclusions.length > 0 || data[category].exclusions.length > 0
    );
    return Math.round((completedCategories.length / categories.length) * 100);
  }, []);

  const completionPercentage = getCompletionPercentage(picoData);

  return {
    validation,
    completionPercentage,
    isComplete: validation.isComplete,
    hasWarnings: validation.warnings.length > 0,
    hasIssues: validation.issues.length > 0
  };
}