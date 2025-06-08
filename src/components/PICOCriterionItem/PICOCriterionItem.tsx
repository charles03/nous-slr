// components/PICOCriterionItem/PICOCriterionItem.tsx

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { PICOCriterion } from '../../types/pico';
import './PICOCriterionItem.css';

interface PICOCriterionItemProps {
  criterion: PICOCriterion;
  index: number;
  type: 'inclusions' | 'exclusions';
  onUpdate: (text: string) => void;
  onRemove: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrop: (targetIndex?: number) => void;
  isDragging: boolean;
}

// Custom drag handle SVG component
const DragIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 20 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Up arrow on the left */}
    <path 
      d="M5 10L5 2M5 2L2 5M5 2L8 5" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    {/* Down arrow on the right */}
    <path 
      d="M15 6L15 14M15 14L12 11M15 14L18 11" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const PICOCriterionItem: React.FC<PICOCriterionItemProps> = ({
  criterion,
  index,
  type,
  onUpdate,
  onRemove,
  onDragStart,
  onDragEnd,
  onDrop,
  isDragging,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    onDragStart();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(index);
  };

  const borderColor = type === 'inclusions' ? 'border-green-200' : 'border-red-200';
  const hoverColor = type === 'inclusions' ? 'hover:border-green-300' : 'hover:border-red-300';

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`pico-criterion-item ${borderColor} ${hoverColor} ${isDragging ? 'pico-criterion-item--dragging' : ''}`}
    >
      <div className="pico-criterion-item__drag-handle">
        <DragIcon size={14} className="text-gray-400" />
      </div>
      
      <input
        type="text"
        value={criterion.text}
        onChange={(e) => onUpdate(e.target.value)}
        className="pico-criterion-item__input"
        placeholder="Enter criterion text..."
      />
      
      <button
        onClick={onRemove}
        className={`pico-criterion-item__remove ${isHovered ? 'pico-criterion-item__remove--visible' : ''}`}
        title="Remove criterion"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default PICOCriterionItem;