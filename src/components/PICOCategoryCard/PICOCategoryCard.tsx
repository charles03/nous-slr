// components/PICOCategoryCard/PICOCategoryCard.tsx

import React from 'react';
import { ChevronUp, ChevronDown, Plus, X } from 'lucide-react';
import PICOCriterionItem from '../PICOCriterionItem/PICOCriterionItem';
import { PICOCategoryConfig, PICOCategory, DraggedItem } from '../../types/pico';
import { PICO_COLOR_CLASSES } from '../../constants/pico';
import './PICOCategoryCard.css';

interface PICOCategoryCardProps {
  category: PICOCategoryConfig;
  picoCategory: PICOCategory;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onAddCriterion: (type: 'inclusions' | 'exclusions') => void;
  onUpdateCriterion: (type: 'inclusions' | 'exclusions', index: number, text: string) => void;
  onRemoveCriterion: (type: 'inclusions' | 'exclusions', index: number) => void;
  onDragStart: (type: 'inclusions' | 'exclusions', index: number) => void;
  onDragEnd: () => void;
  onDrop: (type: 'inclusions' | 'exclusions', index?: number) => void;
  draggedItem: DraggedItem | null;
}

const PICOCategoryCard: React.FC<PICOCategoryCardProps> = ({
  category,
  picoCategory,
  isExpanded,
  onToggleExpanded,
  onAddCriterion,
  onUpdateCriterion,
  onRemoveCriterion,
  onDragStart,
  onDragEnd,
  onDrop,
  draggedItem,
}) => {
  const colorClasses = PICO_COLOR_CLASSES[category.color];
  const IconComponent = category.icon;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, type: 'inclusions' | 'exclusions', index?: number) => {
    e.preventDefault();
    onDrop(type, index);
  };

  return (
    <div className={`pico-category-card ${colorClasses.bg}`}>
      <div className="pico-category-card__header">
        <button
          onClick={onToggleExpanded}
          className="pico-category-card__toggle"
        >
          <div className="pico-category-card__icon-title">
            <div className={`pico-category-card__icon ${colorClasses.text}`}>
              <IconComponent size={20} />
            </div>
            <div className="pico-category-card__title-group">
              <h4 className={`pico-category-card__title ${colorClasses.text}`}>
                {category.title}
              </h4>
              <p className="pico-category-card__description">{category.description}</p>
            </div>
          </div>
          <div className={`pico-category-card__chevron ${colorClasses.text}`}>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>
      </div>
      
      {isExpanded && (
        <div className="pico-category-card__content">
          {/* Inclusions */}
          <div className="criterion-section">
            <div className="criterion-section__header">
              <h5 className="criterion-section__title">
                <Plus size={14} className="criterion-section__icon criterion-section__icon--inclusion" />
                Inclusions ({picoCategory.inclusions.length})
              </h5>
              <button
                onClick={() => onAddCriterion('inclusions')}
                className="criterion-section__add-btn criterion-section__add-btn--inclusion"
                title="Add inclusion criterion"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <div 
              className="criterion-drop-zone criterion-drop-zone--inclusion"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'inclusions')}
            >
              {picoCategory.inclusions.map((criterion, index) => (
                <PICOCriterionItem
                  key={criterion.id}
                  criterion={criterion}
                  index={index}
                  type="inclusions"
                  onUpdate={(text) => onUpdateCriterion('inclusions', index, text)}
                  onRemove={() => onRemoveCriterion('inclusions', index)}
                  onDragStart={() => onDragStart('inclusions', index)}
                  onDragEnd={onDragEnd}
                  onDrop={(targetIndex) => onDrop('inclusions', targetIndex)}
                  isDragging={draggedItem?.category === category.key && 
                             draggedItem?.type === 'inclusions' && 
                             draggedItem?.index === index}
                />
              ))}
              {picoCategory.inclusions.length === 0 && (
                <div className="criterion-drop-zone__empty">
                  Drop inclusion criteria here or click + to add
                </div>
              )}
            </div>
          </div>

          {/* Exclusions */}
          <div className="criterion-section">
            <div className="criterion-section__header">
              <h5 className="criterion-section__title">
                <X size={14} className="criterion-section__icon criterion-section__icon--exclusion" />
                Exclusions ({picoCategory.exclusions.length})
              </h5>
              <button
                onClick={() => onAddCriterion('exclusions')}
                className="criterion-section__add-btn criterion-section__add-btn--exclusion"
                title="Add exclusion criterion"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <div 
              className="criterion-drop-zone criterion-drop-zone--exclusion"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'exclusions')}
            >
              {picoCategory.exclusions.map((criterion, index) => (
                <PICOCriterionItem
                  key={criterion.id}
                  criterion={criterion}
                  index={index}
                  type="exclusions"
                  onUpdate={(text) => onUpdateCriterion('exclusions', index, text)}
                  onRemove={() => onRemoveCriterion('exclusions', index)}
                  onDragStart={() => onDragStart('exclusions', index)}
                  onDragEnd={onDragEnd}
                  onDrop={(targetIndex) => onDrop('exclusions', targetIndex)}
                  isDragging={draggedItem?.category === category.key && 
                             draggedItem?.type === 'exclusions' && 
                             draggedItem?.index === index}
                />
              ))}
              {picoCategory.exclusions.length === 0 && (
                <div className="criterion-drop-zone__empty">
                  Drop exclusion criteria here or click + to add
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PICOCategoryCard;