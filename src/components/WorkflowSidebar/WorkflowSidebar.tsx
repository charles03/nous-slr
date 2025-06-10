// components/WorkflowSidebar/WorkflowSidebar.tsx

import React from 'react';
import { ChevronLeft, Menu, CheckCircle } from 'lucide-react';
import { WORKFLOW_STEPS } from '../../constants';
import { workflowStepIcons } from '../../constants/workflow';
import { useNavigation } from '../Router/SimpleRouter';
import './WorkflowSidebar.css';

interface WorkflowSidebarProps {
  isPanelExpanded: boolean;
  onTogglePanel: () => void;
  activeStep: number;
  completedSteps: boolean[];
  onStepChange: (step: number) => void;
  stepNameOverrides?: Record<string, string>;
  projectId?: number;
}

const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({
  isPanelExpanded,
  onTogglePanel,
  activeStep,
  completedSteps,
  onStepChange,
  stepNameOverrides = {},
  projectId,
}) => {
  const { navigate } = useNavigation();

  const handleStepClick = (stepIndex: number) => {
    const stepName = WORKFLOW_STEPS[stepIndex];
    
    if (projectId) {
      // Navigate to project-specific pages
      if (stepName === 'Search') {
        navigate(`/project/${projectId}/query`);
      } else if (stepName === 'PICO Criteria Builder') {
        navigate(`/project/${projectId}/pico`);
      } else {
        // For other steps, just update the active step for now
        onStepChange(stepIndex);
      }
    } else {
      // Fallback to the existing step change behavior
      onStepChange(stepIndex);
    }
  };
  return (
    <div className={`workflow-sidebar ${isPanelExpanded ? 'workflow-sidebar--expanded' : 'workflow-sidebar--collapsed'}`}>
      <div className="workflow-sidebar__header">
        {isPanelExpanded && (
          <h2 className="workflow-sidebar__title">Review Steps</h2>
        )}
        
        <button 
          onClick={onTogglePanel}
          className="workflow-sidebar__toggle"
          aria-label={isPanelExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isPanelExpanded ? (
            <>
              <ChevronLeft size={20} />
              <span>Hide</span>
            </>
          ) : (
            <Menu size={20} />
          )}
        </button>
      </div>
      
      {isPanelExpanded && (
        <div className="workflow-sidebar__instructions">
          <p>Select a step below to work on that part of your review:</p>
        </div>
      )}
      
      <div className="workflow-sidebar__steps">
        {WORKFLOW_STEPS.map((step, index) => {
          const isActive = activeStep === index;
          const isCompleted = completedSteps[index];
          const StepIcon = workflowStepIcons[step];
          const stepConfig = workflowStepConfigs[step];
          
          return (
            <div key={index} className="workflow-step">
              <button
                onClick={() => handleStepClick(index)}
                className={`workflow-step__button ${isActive ? 'workflow-step__button--active' : ''}`}
                style={{ 
                  borderColor: isActive ? stepConfig.color : undefined
                }}
                title={`${step}: ${stepConfig.description}`}
              >
                {!isPanelExpanded ? (
                  <>
                    <div 
                      className="workflow-step__icon-container"
                      style={{ 
                        backgroundColor: isActive ? stepConfig.color : undefined,
                        color: isActive ? 'white' : stepConfig.color,
                      }}
                    >
                      <StepIcon size={20} />
                    </div>
                    {isCompleted && (
                      <div className="workflow-step__completion-indicator">
                        <CheckCircle size={14} />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div 
                      className="workflow-step__icon-container"
                      style={{ 
                        backgroundColor: isActive ? stepConfig.color : undefined,
                        color: isActive ? 'white' : stepConfig.color,
                      }}
                    >
                      <StepIcon size={20} />
                    </div>
                    
                    <div className="workflow-step__content">
                      <span 
                        className={`workflow-step__title ${isActive ? 'workflow-step__title--active' : ''}`}
                        style={{ color: isActive ? stepConfig.color : undefined }}
                      >
                        {step}
                      </span>
                    </div>
                    
                    <div className="workflow-step__completion">
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

      {isPanelExpanded && (
        <div className="workflow-sidebar__progress">
          <div className="workflow-progress">
            <div className="workflow-progress__label">
              Overall Progress: {Math.round((completedSteps.filter(Boolean).length / WORKFLOW_STEPS.length) * 100)}%
            </div>
            <div className="workflow-progress__bar">
              <div 
                className="workflow-progress__fill"
                style={{ 
                  width: `${(completedSteps.filter(Boolean).length / WORKFLOW_STEPS.length) * 100}%`,
                  backgroundColor: workflowStepConfigs[WORKFLOW_STEPS[activeStep]].color
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Workflow step configurations
const workflowStepConfigs = {
  'Search': {
    color: '#0066CC',
    description: 'Define search strategy and terms'
  },
  'PICO Criteria Builder': {
    color: '#008855',
    description: 'Set inclusion/exclusion criteria'
  },
  'Abstract Screening': {
    color: '#3333AA',
    description: 'Review study abstracts'
  },
  'Full Text Screening': {
    color: '#CC0033',
    description: 'Evaluate complete manuscripts'
  },
  'Quality Assessment': {
    color: '#6633CC',
    description: 'Assess study quality and bias'
  },
  'Data Extraction': {
    color: '#CC6600',
    description: 'Extract and synthesize findings'
  },
  'Meta Analysis': {
    color: '#9B4192',
    description: 'Perform statistical meta-analysis'
  }
} as const;

export default WorkflowSidebar;