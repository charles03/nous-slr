// components/PICOCriteriaBuilder/PICOCriteriaBuilder.tsx

import React, { useState } from 'react';
import PICOCategoryCard from '../PICOCategoryCard/PICOCategoryCard';
import { PICOData, DraggedItem } from '../../types/pico';
import { PICO_CATEGORIES } from '../../constants/pico';
import './PICOCriteriaBuilder.css';

interface PICOCriteriaBuilderProps {
  picoData: PICOData;
  onUpdate: (newPicoData: PICOData) => void;
  allSectionsExpanded: boolean;
}

const PICOCriteriaBuilder: React.FC<PICOCriteriaBuilderProps> = ({
  picoData,
  onUpdate,
  allSectionsExpanded,
}) => {
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    Object.fromEntries(PICO_CATEGORIES.map(cat => [cat.key, allSectionsExpanded]))
  );

  // Update expanded sections when allSectionsExpanded changes
  React.useEffect(() => {
    setExpandedSections(prev => 
      Object.fromEntries(PICO_CATEGORIES.map(cat => [cat.key, allSectionsExpanded]))
    );
  }, [allSectionsExpanded]);

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const handleAddCriterion = (category: keyof PICOData, type: 'inclusions' | 'exclusions') => {
    const newCriterion = {
      id: `${category}_${type}_${Date.now()}`,
      text: `New ${type.slice(0, -1)} criterion`,
      order: picoData[category][type].length
    };

    const updatedPicoData = {
      ...picoData,
      [category]: {
        ...picoData[category],
        [type]: [...picoData[category][type], newCriterion]
      }
    };

    onUpdate(updatedPicoData);
  };

  const handleUpdateCriterion = (
    category: keyof PICOData, 
    type: 'inclusions' | 'exclusions', 
    index: number, 
    newText: string
  ) => {
    const updatedPicoData = {
      ...picoData,
      [category]: {
        ...picoData[category],
        [type]: picoData[category][type].map((item, i) => 
          i === index ? { ...item, text: newText } : item
        )
      }
    };

    onUpdate(updatedPicoData);
  };

  const handleRemoveCriterion = (
    category: keyof PICOData, 
    type: 'inclusions' | 'exclusions', 
    index: number
  ) => {
    const updatedPicoData = {
      ...picoData,
      [category]: {
        ...picoData[category],
        [type]: picoData[category][type].filter((_, i) => i !== index)
      }
    };

    onUpdate(updatedPicoData);
  };

  const handleDragStart = (
    category: keyof PICOData, 
    type: 'inclusions' | 'exclusions', 
    index: number
  ) => {
    const item = picoData[category][type][index];
    setDraggedItem({ category, type, index, text: item.text });
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (
    targetCategory: keyof PICOData, 
    targetType: 'inclusions' | 'exclusions', 
    targetIndex?: number
  ) => {
    if (!draggedItem) return;

    const { category: fromCategory, type: fromType, index: fromIndex } = draggedItem;
    
    // If dropping in the same location, do nothing
    if (fromCategory === targetCategory && fromType === targetType && fromIndex === targetIndex) {
      setDraggedItem(null);
      return;
    }

    // Create new PICO data
    const newPicoData = { ...picoData };
    
    // Remove from original position
    const removedItem = newPicoData[fromCategory][fromType].splice(fromIndex, 1)[0];
    
    // Add to new position
    const insertIndex = targetIndex !== undefined ? targetIndex : newPicoData[targetCategory][targetType].length;
    newPicoData[targetCategory][targetType].splice(insertIndex, 0, {
      ...removedItem,
      id: `${targetCategory}_${targetType}_${Date.now()}`, // Generate new ID
      order: insertIndex
    });

    // Update order for all items in the target category
    newPicoData[targetCategory][targetType].forEach((item, index) => {
      item.order = index;
    });

    onUpdate(newPicoData);
    setDraggedItem(null);
  };

  return (
    <div className="pico-criteria-builder">
      <div className="pico-categories-grid">
        {PICO_CATEGORIES.map((category) => (
          <PICOCategoryCard
            key={category.key}
            category={category}
            picoCategory={picoData[category.key]}
            isExpanded={expandedSections[category.key]}
            onToggleExpanded={() => toggleSection(category.key)}
            onAddCriterion={(type) => handleAddCriterion(category.key, type)}
            onUpdateCriterion={(type, index, text) => handleUpdateCriterion(category.key, type, index, text)}
            onRemoveCriterion={(type, index) => handleRemoveCriterion(category.key, type, index)}
            onDragStart={(type, index) => handleDragStart(category.key, type, index)}
            onDragEnd={handleDragEnd}
            onDrop={(type, index) => handleDrop(category.key, type, index)}
            draggedItem={draggedItem}
          />
        ))}
      </div>
    </div>
  );
};

export default PICOCriteriaBuilder;