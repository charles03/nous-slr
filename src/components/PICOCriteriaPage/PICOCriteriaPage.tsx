// components/PICOCriteriaPage/PICOCriteriaPage.tsx

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Menu,
  Home,
  ChevronRight,
  Plus,
  Sparkles,
  Edit3,
  Check,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';
import Header from '../Header/Header';
import WorkflowSidebar from '../WorkflowSidebar/WorkflowSidebar';
import PICOFlowSelector from '../PICOFlowSelector/PICOFlowSelector';
import PICOCriteriaBuilder from '../PICOCriteriaBuilder/PICOCriteriaBuilder';
import StudyObjectiveModal from '../StudyObjectiveModal/StudyObjectiveModal';
import { PICOData, PICOFlowType, StudyObjective } from '../../types/pico';
import { DEFAULT_PICO_DATA } from '../../constants/pico';
import { WORKFLOW_STEPS } from '../../constants';
import { useNavigation } from '../Router/SimpleRouter';
import './PICOCriteriaPage.css';

interface PICOCriteriaPageProps {
  onCreateProject?: () => void;
}

const PICOCriteriaPage: React.FC<PICOCriteriaPageProps> = ({ onCreateProject }) => {
  const { currentPath } = useNavigation();
  
  // Extract project ID from URL if present
  const projectIdMatch = currentPath.match(/\/project\/(\d+)\//);
  const projectId = projectIdMatch ? parseInt(projectIdMatch[1], 10) : undefined;
  
  // Workflow state
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);
  const [activeStep, setActiveStep] = useState(1); // PICO Criteria Builder step
  const [completedSteps, setCompletedSteps] = useState([true, false, false, false, false, false, false]);

  // PICO flow state
  const [selectedFlow, setSelectedFlow] = useState<PICOFlowType>(null);
  const [picoData, setPicoData] = useState<PICOData>(DEFAULT_PICO_DATA);
  
  // Modal states
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [studyObjective, setStudyObjective] = useState<StudyObjective>({
    text: '',
    isGenerated: false
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // UI state
  const [allSectionsExpanded, setAllSectionsExpanded] = useState(true);

  const handleStartAIFlow = () => {
    setSelectedFlow('ai');
    setShowObjectiveModal(true);
  };

  const handleStartManualFlow = () => {
    setSelectedFlow('manual');
  };

  const handleObjectiveSubmit = async (objective: string) => {
    setIsGenerating(true);
    setShowObjectiveModal(false);
    
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check for demo objective and use specific data
      const isDemoObjective = objective.toLowerCase().includes('pembrolizumab') && 
                            objective.toLowerCase().includes('non-small cell lung cancer');
      
      if (isDemoObjective) {
        // Use demo-specific PICO data
        setPicoData(generateDemoPICOData());
      } else {
        // Use generated generic data
        setPicoData(generateGenericPICOData());
      }
      
      setStudyObjective({
        text: objective,
        isGenerated: true,
        generatedAt: new Date().toISOString()
      });
      
      // Mark step as completed
      const newCompletedSteps = [...completedSteps];
      newCompletedSteps[1] = true;
      setCompletedSteps(newCompletedSteps);
      
    } catch (error) {
      console.error('Error generating PICO criteria:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCriteriaUpdate = (newPicoData: PICOData) => {
    setPicoData(newPicoData);
  };

  const handleComplete = () => {
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[1] = true;
    setCompletedSteps(newCompletedSteps);
  };

  const resetFlow = () => {
    setSelectedFlow(null);
    setPicoData(DEFAULT_PICO_DATA);
    setStudyObjective({ text: '', isGenerated: false });
  };

  const toggleAllSections = () => {
    setAllSectionsExpanded(!allSectionsExpanded);
  };

  return (
    <div className="pico-criteria-page">
      <Header onCreateProject={onCreateProject || (() => {})} />
      
      {/* Project Path */}
      <div className="project-path">
        <div className="project-path__container">
          <div className="project-path__breadcrumb">
            <Home size={16} />
            <span>Home</span>
            <ChevronRight size={16} />
            <span>Projects</span>
            <ChevronRight size={16} />
            <span className="project-path__current">Non-Small Cell Lung Cancer SLR</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pico-criteria-page__content">
        <WorkflowSidebar
          isPanelExpanded={isPanelExpanded}
          onTogglePanel={() => setIsPanelExpanded(!isPanelExpanded)}
          activeStep={activeStep}
          completedSteps={completedSteps}
          onStepChange={setActiveStep}
          projectId={projectId}
        />

        <div className="pico-criteria-page__main">
          {/* Step Header */}
          <div className="step-header">
            <div className="step-header__content">
              <h2 className="step-header__title">PICO Criteria Builder</h2>
              <div className="step-header__badge">Step 2 of {WORKFLOW_STEPS.length}</div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="pico-content-area">
            {!selectedFlow ? (
              <PICOFlowSelector
                onStartAI={handleStartAIFlow}
                onStartManual={handleStartManualFlow}
              />
            ) : (
              <div className="pico-builder-container">
                <div className="pico-builder-header">
                  <div className="pico-builder-header__left">
                    <h3 className="pico-builder-header__title">PICO Criteria Builder</h3>
                    {studyObjective.text && (
                      <p className="pico-builder-header__objective">
                        <strong>Objective:</strong> {studyObjective.text}
                      </p>
                    )}
                  </div>
                  <div className="pico-builder-header__actions">
                    <button
                      onClick={toggleAllSections}
                      className="btn btn--secondary btn--sm"
                    >
                      {allSectionsExpanded ? (
                        <>
                          <Minimize2 size={16} />
                          Collapse All
                        </>
                      ) : (
                        <>
                          <Maximize2 size={16} />
                          Expand All
                        </>
                      )}
                    </button>
                    <button
                      onClick={resetFlow}
                      className="btn btn--ghost btn--sm"
                    >
                      <X size={16} />
                      Start Over
                    </button>
                  </div>
                </div>

                <PICOCriteriaBuilder
                  picoData={picoData}
                  onUpdate={handleCriteriaUpdate}
                  allSectionsExpanded={allSectionsExpanded}
                />

                <div className="pico-builder-footer">
                  <div className="pico-builder-footer__info">
                    <p>Tip: Drag criteria between categories or within the same category to reorganize them.</p>
                  </div>
                  <div className="pico-builder-footer__actions">
                    <button className="btn btn--secondary">Save Draft</button>
                    <button 
                      onClick={handleComplete}
                      className="btn btn--primary"
                    >
                      <Check size={16} />
                      Complete PICO Criteria Builder
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showObjectiveModal && (
        <StudyObjectiveModal
          onSubmit={handleObjectiveSubmit}
          onClose={() => setShowObjectiveModal(false)}
        />
      )}

      {/* Loading Modal */}
      {isGenerating && (
        <div className="modal-overlay">
          <div className="loading-modal">
            <div className="loading-modal__icon">
              <Sparkles size={32} />
            </div>
            <h3 className="loading-modal__title">Generating PICO Criteria</h3>
            <p className="loading-modal__description">
              AI is analyzing your objective and creating comprehensive inclusion/exclusion criteria...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions for generating PICO data
const generateDemoPICOData = (): PICOData => ({
  population: {
    inclusions: [
      { id: 'demo_pop_inc_1', text: 'Adult patients (≥18 years old)', order: 0 },
      { id: 'demo_pop_inc_2', text: 'Confirmed diagnosis of non-small cell lung cancer (NSCLC)', order: 1 },
      { id: 'demo_pop_inc_3', text: 'Advanced or metastatic stage of NSCLC', order: 2 },
      { id: 'demo_pop_inc_4', text: 'Treatment naive (no prior systemic therapy for advanced/metastatic disease)', order: 3 }
    ],
    exclusions: [
      { id: 'demo_pop_exc_1', text: 'Studies exclusively focused on previously treated patients', order: 0 },
      { id: 'demo_pop_exc_2', text: 'Mixed populations without extractable data specific to treatment naive advanced/metastatic NSCLC', order: 1 },
      { id: 'demo_pop_exc_3', text: 'Pediatric populations or patients with other types of lung cancer', order: 2 }
    ]
  },
  intervention: {
    inclusions: [
      { id: 'demo_int_inc_1', text: 'Evaluation of pembrolizumab as a primary intervention', order: 0 },
      { id: 'demo_int_inc_2', text: 'Administered in a first-line setting for advanced/metastatic NSCLC', order: 1 },
      { id: 'demo_int_inc_3', text: 'Detailed regimen and administration protocol provided (e.g., dosage, frequency)', order: 2 }
    ],
    exclusions: [
      { id: 'demo_int_exc_1', text: 'Studies exclusively focused on pembrolizumab in later-line therapy settings', order: 0 },
      { id: 'demo_int_exc_2', text: 'Combined interventions without isolation of pembrolizumab effects', order: 1 },
      { id: 'demo_int_exc_3', text: 'Lack of detailed intervention protocol', order: 2 }
    ]
  },
  comparator: {
    inclusions: [
      { id: 'demo_comp_inc_1', text: 'Acceptable comparators include standard care, placebo, or other first-line interventions for advanced/metastatic NSCLC', order: 0 }
    ],
    exclusions: [
      { id: 'demo_comp_exc_1', text: 'Studies lacking a comparator group', order: 0 },
      { id: 'demo_comp_exc_2', text: 'Comparators not relevant to first-line treatment settings', order: 1 }
    ]
  },
  outcome: {
    inclusions: [
      { id: 'demo_out_inc_1', text: 'Reporting on efficacy outcomes such as Overall Survival (OS), Progression-Free Survival (PFS), and Response Rate (RR)', order: 0 },
      { id: 'demo_out_inc_2', text: 'Safety endpoints including adverse events and toxicity profiles', order: 1 },
      { id: 'demo_out_inc_3', text: 'Use of validated measurement instruments and clear timing of assessments', order: 2 }
    ],
    exclusions: [
      { id: 'demo_out_exc_1', text: 'Studies exclusively focused on outcomes not relevant to efficacy or safety (e.g., quality of life without efficacy data)', order: 0 }
    ]
  },
  others: {
    inclusions: [
      { id: 'demo_oth_inc_1', text: 'Randomized clinical trials', order: 0 },
      { id: 'demo_oth_inc_2', text: 'Publications in English', order: 1 },
      { id: 'demo_oth_inc_3', text: 'Studies conducted in specified locations (e.g., North America, Europe)', order: 2 },
      { id: 'demo_oth_inc_4', text: 'Data collection periods within the last 10 years', order: 3 }
    ],
    exclusions: [
      { id: 'demo_oth_exc_1', text: 'Pre-clinical studies or animal studies', order: 0 },
      { id: 'demo_oth_exc_2', text: 'Non-applicable study designs (e.g., case reports, reviews)', order: 1 },
      { id: 'demo_oth_exc_3', text: 'Non-English publications', order: 2 },
      { id: 'demo_oth_exc_4', text: 'Studies conducted outside specified locations or outside the defined data collection period', order: 3 }
    ]
  }
});

const generateGenericPICOData = (): PICOData => ({
  population: {
    inclusions: [
      { id: 'gen_pop_inc_1', text: 'Adult patients with confirmed disease diagnosis', order: 0 },
      { id: 'gen_pop_inc_2', text: 'Patients meeting specified disease criteria', order: 1 }
    ],
    exclusions: [
      { id: 'gen_pop_exc_1', text: 'Pediatric populations', order: 0 },
      { id: 'gen_pop_exc_2', text: 'Patients with comorbid conditions affecting study outcomes', order: 1 }
    ]
  },
  intervention: {
    inclusions: [
      { id: 'gen_int_inc_1', text: 'Primary therapeutic intervention as specified', order: 0 },
      { id: 'gen_int_inc_2', text: 'Standard dosing and administration protocols', order: 1 }
    ],
    exclusions: [
      { id: 'gen_int_exc_1', text: 'Non-standard or experimental dosing regimens', order: 0 },
      { id: 'gen_int_exc_2', text: 'Combination therapies not specified in study design', order: 1 }
    ]
  },
  comparator: {
    inclusions: [
      { id: 'gen_comp_inc_1', text: 'Standard-of-care control groups', order: 0 },
      { id: 'gen_comp_inc_2', text: 'Placebo-controlled comparisons', order: 1 }
    ],
    exclusions: [
      { id: 'gen_comp_exc_1', text: 'Historical controls only', order: 0 },
      { id: 'gen_comp_exc_2', text: 'Inadequate control group definitions', order: 1 }
    ]
  },
  outcome: {
    inclusions: [
      { id: 'gen_out_inc_1', text: 'Primary efficacy endpoints', order: 0 },
      { id: 'gen_out_inc_2', text: 'Safety and tolerability measures', order: 1 },
      { id: 'gen_out_inc_3', text: 'Quality of life assessments', order: 2 }
    ],
    exclusions: [
      { id: 'gen_out_exc_1', text: 'Studies without clearly defined primary endpoints', order: 0 },
      { id: 'gen_out_exc_2', text: 'Biomarker-only studies without clinical outcomes', order: 1 }
    ]
  },
  others: {
    inclusions: [
      { id: 'gen_oth_inc_1', text: 'Appropriate study design for research question', order: 0 },
      { id: 'gen_oth_inc_2', text: 'Published within specified timeframe', order: 1 },
      { id: 'gen_oth_inc_3', text: 'Adequate sample size for analysis', order: 2 }
    ],
    exclusions: [
      { id: 'gen_oth_exc_1', text: 'Inappropriate study designs', order: 0 },
      { id: 'gen_oth_exc_2', text: 'Inadequate reporting quality', order: 1 },
      { id: 'gen_oth_exc_3', text: 'Studies outside specified parameters', order: 2 }
    ]
  }
});

export default PICOCriteriaPage;