// components/WorkflowSteps/WorkflowSteps.tsx

import React from 'react';
import { 
  Search, 
  Filter, 
  Book, 
  FileText, 
  CheckSquare, 
  Database, 
  BarChart3,
  CheckCircle,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { useNavigation } from '../Router/SimpleRouter';
import './WorkflowSteps.css';

export interface WorkflowStep {
  icon: React.ReactNode;
  text: string;
  description: string;
  color: string;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  { 
    icon: <Search size={20} />, 
    text: 'Search',
    description: 'Define search strategy and terms',
    color: '#0066CC',
  },
  { 
    icon: <Filter size={20} />, 
    text: 'PICO Criteria Builder',
    description: 'Set inclusion/exclusion criteria',
    color: '#008855',
  },
  { 
    icon: <Book size={20} />, 
    text: 'Abstract Screening',
    description: 'Review study abstracts',
    color: '#3333AA',
  },
  { 
    icon: <FileText size={20} />, 
    text: 'Full Text Screening',
    description: 'Evaluate complete manuscripts',
    color: '#CC0033',
  },
  { 
    icon: <CheckSquare size={20} />, 
    text: 'Quality Assessment',
    description: 'Assess study quality and bias',
    color: '#6633CC',
  },
  { 
    icon: <Database size={20} />, 
    text: 'Data Extraction',
    description: 'Extract and synthesize findings',
    color: '#CC6600',
  },
  { 
    icon: <BarChart3 size={20} />, 
    text: 'Meta Analysis',
    description: 'Perform statistical meta-analysis',
    color: '#9B4192',
  }
];

interface WorkflowStepsProps {
  activeStep: number;
  completedSteps: boolean[];
  onStepClick: (stepIndex: number) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  className?: string;
  projectId?: number;
}

const WorkflowSteps: React.FC<WorkflowStepsProps> = ({
  activeStep,
  completedSteps,
  onStepClick,
  isExpanded,
  onToggleExpanded,
  className = '',
  projectId
}) => {
  const { navigate } = useNavigation();

  const handleStepClick = (stepIndex: number) => {
    const stepName = WORKFLOW_STEPS[stepIndex].text;
    
    if (projectId) {
      // Navigate to project-specific pages
      if (stepName === 'Search') {
        navigate(`/project/${projectId}/query`);
      } else if (stepName === 'PICO Criteria Builder') {
        navigate(`/project/${projectId}/pico`);
      } else {
        // For other steps, just update the active step for now
        onStepClick(stepIndex);
      }
    } else {
      // Fallback to the existing step click behavior
      onStepClick(stepIndex);
    }
  };
  return (
    <div className={`workflow-steps ${isExpanded ? 'workflow-steps--expanded' : 'workflow-steps--collapsed'} ${className}`}>
      <div className="workflow-steps__header">
        <h2 className={`workflow-steps__title ${isExpanded ? 'workflow-steps__title--visible' : 'workflow-steps__title--hidden'}`}>
          Review Steps
        </h2>
        
        <button 
          onClick={onToggleExpanded}
          className="workflow-steps__toggle"
          aria-label={isExpanded ? "Collapse side panel" : "Expand side panel"}
        >
          {isExpanded ? (
            <>
              <ChevronLeft size={20} />
              <span className="workflow-steps__toggle-text">Hide</span>
            </>
          ) : (
            <Menu size={20} />
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="workflow-steps__instructions">
          <p className="workflow-steps__instructions-text">
            Select a step below to work on that part of your review:
          </p>
        </div>
      )}
      
      <div className="workflow-steps__list">
        {WORKFLOW_STEPS.map((step, index) => {
          const isActive = activeStep === index;
          const isCompleted = completedSteps[index];
          
          return (
            <div key={index} className="workflow-steps__item">
              <button
                onClick={() => handleStepClick(index)}
                className={`workflow-steps__button ${isActive ? 'workflow-steps__button--active' : ''}`}
                style={{ 
                  borderColor: isActive ? step.color : '#E5E7EB',
                }}
                aria-current={isActive ? "step" : undefined}
                aria-label={`${step.text} ${isCompleted ? "(Completed)" : ""}`}
                title={`${step.text}: ${step.description}`}
              >
                {!isExpanded ? (
                  // Collapsed state - icon only, centered
                  <>
                    <div 
                      className="workflow-steps__icon workflow-steps__icon--collapsed"
                      style={{ 
                        backgroundColor: isActive ? step.color : '#F3F4F6',
                        color: isActive ? 'white' : step.color,
                      }}
                    >
                      {step.icon}
                    </div>
                    
                    {/* Compact completion indicator */}
                    {isCompleted && (
                      <div className="workflow-steps__completion workflow-steps__completion--compact">
                        <CheckCircle size={14} />
                      </div>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    <div className="workflow-steps__tooltip">
                      {step.description}
                      <div className="workflow-steps__tooltip-arrow"></div>
                    </div>
                  </>
                ) : (
                  // Expanded state - icon and text, centered
                  <>
                    <div 
                      className="workflow-steps__icon workflow-steps__icon--expanded"
                      style={{ 
                        backgroundColor: isActive ? step.color : '#F3F4F6',
                        color: isActive ? 'white' : step.color,
                      }}
                    >
                      {step.icon}
                    </div>
                    
                    <div className="workflow-steps__content">
                      <span 
                        className={`workflow-steps__text ${isActive ? 'workflow-steps__text--active' : ''}`}
                        style={{ color: isActive ? step.color : '#374151' }}
                      >
                        {step.text}
                      </span>
                    </div>
                    
                    {/* Completion indicator for expanded state */}
                    <div className="workflow-steps__completion workflow-steps__completion--expanded">
                      {isCompleted && (
                        <CheckCircle size={20} />
                      )}
                    </div>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Progress summary at bottom (only when expanded) */}
      {isExpanded && (
        <div className="workflow-steps__progress">
          <div className="workflow-steps__progress-text">
            Overall Progress: {Math.round((completedSteps.filter(Boolean).length / WORKFLOW_STEPS.length) * 100)}%
          </div>
          <div className="workflow-steps__progress-bar">
            <div 
              className="workflow-steps__progress-fill"
              style={{ 
                width: `${(completedSteps.filter(Boolean).length / WORKFLOW_STEPS.length) * 100}%`,
                backgroundColor: WORKFLOW_STEPS[activeStep].color
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowSteps;