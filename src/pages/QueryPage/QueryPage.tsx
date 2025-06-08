// pages/QueryPage/QueryPage.tsx

import React, { useState, useCallback } from 'react';
import { Home, ChevronRight, Plus, Bot, Edit3, X, Check } from 'lucide-react';
import Header from '../../components/Header/Header';
import WorkflowSteps from '../../components/WorkflowSteps/WorkflowSteps';
import QueryEditor from '../../components/QueryEditor/QueryEditor';
import { 
  StudyObjectiveModal, 
  ManualQueryModal, 
  LoadingModal, 
  AISuggestedQueryModal 
} from '../../components/QueryModals/QueryModals';
import { QueryFlow } from '../../types/query';
import { cleanQuery } from '../../utils/queryFormatter';
import './QueryPage.css';

// Mock generated queries for demo
const DEMO_GENERATED_QUERIES = {
  relaxed: "(pembrolizumab OR Keytruda OR anti-PD-1) AND (advanced OR metastatic OR late-stage) AND (Non-small cell lung cancer OR NSCLC OR lung carcinoma)",
  moderate: "(pembrolizumab OR Keytruda) AND (advanced OR metastatic) AND (Non-small cell lung cancer OR NSCLC)",
  strict: "(pembrolizumab[Title/Abstract] OR Keytruda[Title/Abstract] OR anti-PD-1[Title/Abstract]) AND (advanced[Title/Abstract] AND metastatic[Title/Abstract]) AND (Non-small cell lung cancer[Title/Abstract] OR NSCLC[Title/Abstract])"
};

interface QueryPageProps {
  onCreateProject?: () => void;
}

const QueryPage: React.FC<QueryPageProps> = ({ onCreateProject }) => {
  // Workflow state
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState(0); // Search tab
  const [completedSteps, setCompletedSteps] = useState([false, false, false, false, false, false, false]);

  // Flow selection states
  const [selectedFlow, setSelectedFlow] = useState<QueryFlow>(null);
  
  // Modal states
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [showAISuggestedModal, setShowAISuggestedModal] = useState(false);
  const [showManualQueryModal, setShowManualQueryModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Form states
  const [studyObjective, setStudyObjective] = useState('');
  const [manualQuery, setManualQuery] = useState('');
  
  // Query states
  const [queryText, setQueryText] = useState('');
  const [formattedQuery, setFormattedQuery] = useState('');
  const [selectedQuery, setSelectedQuery] = useState('');
  const [showQueryBuilder, setShowQueryBuilder] = useState(false);

  // Handle AI flow
  const handleStartGenAI = useCallback(() => {
    setSelectedFlow('ai');
    setShowObjectiveModal(true);
  }, []);

  const handleProceedToGenerate = useCallback(() => {
    setIsGenerating(true);
    setShowObjectiveModal(false);
    
    // Simulate AI generation and show formatted query
    setTimeout(() => {
      setIsGenerating(false);
      const rawQuery = DEMO_GENERATED_QUERIES.relaxed;
      const formatted = cleanQuery(rawQuery);
      setSelectedQuery(rawQuery);
      setFormattedQuery(formatted);
      setShowAISuggestedModal(true);
    }, 2000);
  }, []);

  const handleSelectAIQuery = useCallback(() => {
    setShowAISuggestedModal(false);
    initializeQueryBuilder(selectedQuery, 'ai');
  }, [selectedQuery]);

  const handleGoBackToObjective = useCallback(() => {
    setShowAISuggestedModal(false);
    setShowObjectiveModal(true);
  }, []);

  // Handle manual flow
  const handleStartManual = useCallback(() => {
    setSelectedFlow('manual');
    setShowManualQueryModal(true);
  }, []);

  const handleSubmitManualQuery = useCallback(() => {
    if (!manualQuery.trim()) return;
    
    setSelectedQuery(manualQuery);
    setShowManualQueryModal(false);
    initializeQueryBuilder(manualQuery, 'manual');
  }, [manualQuery]);

  // Initialize query builder
  const initializeQueryBuilder = useCallback((query: string, flowType: QueryFlow) => {
    setShowQueryBuilder(true);
    const formatted = cleanQuery(query);
    setQueryText(query);
    setFormattedQuery(formatted);
    
    // Mark the search step as completed
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[0] = true;
    setCompletedSteps(newCompletedSteps);
  }, [completedSteps]);

  const resetToInitialState = useCallback(() => {
    setSelectedFlow(null);
    setShowQueryBuilder(false);
    setQueryText('');
    setSelectedQuery('');
    setFormattedQuery('');
    setStudyObjective('');
    setManualQuery('');
  }, []);

  // Handle workflow step clicks
  const handleStepClick = useCallback((stepIndex: number) => {
    setActiveTab(stepIndex);
  }, []);

  const handleTogglePanel = useCallback(() => {
    setIsPanelExpanded(!isPanelExpanded);
  }, [isPanelExpanded]);

  return (
    <div className="query-page">
      <Header onCreateProject={onCreateProject || (() => {})} />
      
      {/* Project Path Structure */}
      <div className="query-page__breadcrumb">
        <div className="query-page__breadcrumb-container">
          <div className="query-page__breadcrumb-content">
            <Home size={16} className="query-page__breadcrumb-icon" />
            <span className="query-page__breadcrumb-text">Home</span>
            <ChevronRight size={16} className="query-page__breadcrumb-separator" />
            <span className="query-page__breadcrumb-text">Projects</span>
            <ChevronRight size={16} className="query-page__breadcrumb-separator" />
            <span className="query-page__breadcrumb-current">Pancreatic Cancer Systematic Review</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="query-page__main">
        {/* Left Panel - Workflow Steps */}
        <WorkflowSteps
          activeStep={activeTab}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
          isExpanded={isPanelExpanded}
          onToggleExpanded={handleTogglePanel}
          className="query-page__workflow"
        />

        {/* Right Panel - Query/Search Content */}
        <div className="query-page__content">
          <div className="query-page__header">
            <div className="query-page__header-content">
              <h2 className="query-page__title">Query & Search Strategy</h2>
              <div className="query-page__step-indicator">
                Step 1 of 7
              </div>
            </div>
          </div>

          {!showQueryBuilder ? (
            /* Initial State - Choose Flow */
            <div className="query-page__flow-selection">
              <div className="query-page__flow-container">
                <div className="query-page__flow-header">
                  <h3 className="query-page__flow-title">Choose Your Query Building Approach</h3>
                  <p className="query-page__flow-subtitle">
                    Select how you'd like to create your search query
                  </p>
                </div>
                
                <div className="query-page__flow-options">
                  {/* AI-Powered Flow */}
                  <div className="query-page__flow-option query-page__flow-option--ai">
                    <div className="query-page__flow-content">
                      <div className="query-page__flow-icon query-page__flow-icon--ai">
                        <Bot size={24} />
                      </div>
                      <h4 className="query-page__flow-option-title">AI-Powered Generation</h4>
                      <p className="query-page__flow-option-description">
                        AI analyzes your objective and generates optimized queries
                      </p>
                      <ul className="query-page__flow-features">
                        <li className="query-page__flow-feature">
                          <Check size={12} />
                          <span>Multiple variations</span>
                        </li>
                        <li className="query-page__flow-feature">
                          <Check size={12} />
                          <span>Term expansion</span>
                        </li>
                        <li className="query-page__flow-feature">
                          <Check size={12} />
                          <span>Optimized search</span>
                        </li>
                      </ul>
                    </div>
                    
                    <button
                      onClick={handleStartGenAI}
                      className="query-page__flow-button query-page__flow-button--ai"
                    >
                      <Bot size={16} />
                      Start AI Generation
                    </button>
                  </div>

                  {/* Manual Input Flow */}
                  <div className="query-page__flow-option query-page__flow-option--manual">
                    <div className="query-page__flow-content">
                      <div className="query-page__flow-icon query-page__flow-icon--manual">
                        <Edit3 size={24} />
                      </div>
                      <h4 className="query-page__flow-option-title">Manual Query Input</h4>
                      <p className="query-page__flow-option-description">
                        Input your existing query and refine with advanced builder
                      </p>
                      <ul className="query-page__flow-features">
                        <li className="query-page__flow-feature">
                          <Check size={12} />
                          <span>Existing strategy</span>
                        </li>
                        <li className="query-page__flow-feature">
                          <Check size={12} />
                          <span>Nested groups</span>
                        </li>
                        <li className="query-page__flow-feature">
                          <Check size={12} />
                          <span>Full control</span>
                        </li>
                      </ul>
                    </div>
                    
                    <button
                      onClick={handleStartManual}
                      className="query-page__flow-button query-page__flow-button--manual"
                    >
                      <Edit3 size={16} />
                      Input Manual Query
                    </button>
                  </div>
                </div>
                
                <div className="query-page__flow-footer">
                  <p className="query-page__flow-footer-text">
                    Both approaches lead to the same advanced query builder where you can further customize your search strategy
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Query Builder Interface */
            <div className="query-page__builder">
              <div className="query-page__builder-header">
                <h3 className="query-page__builder-title">Search Query</h3>
                <button
                  onClick={resetToInitialState}
                  className="query-page__reset-button"
                >
                  <X size={16} />
                  Start Over
                </button>
              </div>
              
              <QueryEditor
                queryText={queryText}
                onQueryTextChange={setQueryText}
                formattedQuery={formattedQuery}
                onFormattedQueryChange={setFormattedQuery}
                className="query-page__editor"
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <StudyObjectiveModal
        isOpen={showObjectiveModal}
        studyObjective={studyObjective}
        onStudyObjectiveChange={setStudyObjective}
        onProceed={handleProceedToGenerate}
        onClose={() => setShowObjectiveModal(false)}
      />

      <ManualQueryModal
        isOpen={showManualQueryModal}
        manualQuery={manualQuery}
        onManualQueryChange={setManualQuery}
        onSubmit={handleSubmitManualQuery}
        onClose={() => setShowManualQueryModal(false)}
      />

      <LoadingModal isOpen={isGenerating} />

      <AISuggestedQueryModal
        isOpen={showAISuggestedModal}
        studyObjective={studyObjective}
        generatedQuery={selectedQuery}
        formattedQuery={formattedQuery}
        onSelect={handleSelectAIQuery}
        onGoBack={handleGoBackToObjective}
      />
    </div>
  );
};

export default QueryPage;