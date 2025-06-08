// components/ProgressBar/ProgressBar.tsx

import React, { useState } from 'react';
import { Check, Database, CheckSquare, FileText, File, Award, Download, BarChart3 } from 'lucide-react';
import './ProgressBar.css';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

// Step Icons mapping
const STEP_ICONS: Record<string, any> = {
  "Query": Database,
  "I/E Criteria": CheckSquare,
  "Abstract Screening": FileText,
  "Full Text Screening": File,
  "Quality Assessment": Award,
  "Data Extraction": Download,
  "Meta Analysis": BarChart3
};

interface ProgressStepProps {
  completed: boolean;
  current: boolean;
  label: string;
  index: number;
}

const ProgressStep: React.FC<ProgressStepProps> = ({ completed, current, label, index }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const StepIcon = STEP_ICONS[label] || Database;
  
  return (
    <div 
      className="progress-step" 
      onMouseEnter={() => setShowTooltip(true)} 
      onMouseLeave={() => setShowTooltip(false)}
    >
      <StepIcon 
        size={16} 
        className={`step-icon ${
          current ? 'step-icon--current' : 
          completed ? 'step-icon--completed' : 'step-icon--pending'
        }`} 
      />
      
      <div className="check-indicator">
        {completed && (
          <Check 
            size={10} 
            className="check-icon" 
          />
        )}
      </div>
      
      {showTooltip && (
        <div className="tooltip">
          {label}
          <div className="tooltip-arrow"></div>
        </div>
      )}
    </div>
  );
};

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="progress-bar">
      {/* Segmented progress indicator line */}
      <div className="progress-segments">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`progress-segment ${
              index < currentStep ? 'progress-segment--completed' : 'progress-segment--pending'
            }`}
          />
        ))}
      </div>
      
      {/* Step icons in a row */}
      <div className="progress-steps">
        {steps.map((step, index) => (
          <ProgressStep 
            key={index}
            completed={index < currentStep - 1}
            current={index === currentStep - 1}
            label={step}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;