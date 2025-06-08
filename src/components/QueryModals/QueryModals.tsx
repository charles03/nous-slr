// components/QueryModals/QueryModals.tsx

import React from 'react';
import { X, Bot, Edit3, Sparkles, Check, ChevronLeft } from 'lucide-react';
import { highlightQuery } from '../../utils/queryFormatter';
import './QueryModals.css';

interface StudyObjectiveModalProps {
  isOpen: boolean;
  studyObjective: string;
  onStudyObjectiveChange: (value: string) => void;
  onProceed: () => void;
  onClose: () => void;
}

export const StudyObjectiveModal: React.FC<StudyObjectiveModalProps> = ({
  isOpen,
  studyObjective,
  onStudyObjectiveChange,
  onProceed,
  onClose
}) => {
  if (!isOpen) return null;

  const handleUseDemoObjective = () => {
    onStudyObjectiveChange('Effect of pembrolizumab in the treatment of advanced metastatic Non-small cell lung cancer patients');
  };

  return (
    <div className="query-modal-overlay">
      <div className="query-modal">
        <div className="query-modal__header">
          <h2 className="query-modal__title">Define Your Study Objective</h2>
          <button onClick={onClose} className="query-modal__close">
            <X size={24} />
          </button>
        </div>
        
        <div className="query-modal__body">
          <div className="query-modal__form-group">
            <label htmlFor="objective" className="query-modal__label">
              Please describe your research objective clearly:
            </label>
            <textarea
              id="objective"
              rows={6}
              className="query-modal__textarea"
              placeholder="Example: Effect of pembrolizumab in advanced metastatic Non-small cell lung cancer patients."
              value={studyObjective}
              onChange={(e) => onStudyObjectiveChange(e.target.value)}
            />
          </div>
          
          <div className="query-modal__demo-tip">
            <div className="query-modal__demo-content">
              <div className="query-modal__demo-icon">
                <Sparkles size={14} />
              </div>
              <div className="query-modal__demo-text">
                <p className="query-modal__demo-title">
                  <span className="query-modal__demo-label">Demo Tip:</span> Try the example objective to see AI-generated queries specifically tailored for pembrolizumab NSCLC studies.
                </p>
                <button
                  onClick={handleUseDemoObjective}
                  className="query-modal__demo-btn"
                >
                  Use Demo Objective
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="query-modal__footer">
          <button onClick={onClose} className="query-modal__btn query-modal__btn--secondary">
            Cancel
          </button>
          <button
            onClick={onProceed}
            disabled={!studyObjective.trim()}
            className="query-modal__btn query-modal__btn--primary"
          >
            <Sparkles size={20} className="query-modal__btn-icon" />
            Generate Query
          </button>
        </div>
      </div>
    </div>
  );
};

interface ManualQueryModalProps {
  isOpen: boolean;
  manualQuery: string;
  onManualQueryChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export const ManualQueryModal: React.FC<ManualQueryModalProps> = ({
  isOpen,
  manualQuery,
  onManualQueryChange,
  onSubmit,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="query-modal-overlay">
      <div className="query-modal">
        <div className="query-modal__header">
          <h2 className="query-modal__title">Input Your Search Query</h2>
          <button onClick={onClose} className="query-modal__close">
            <X size={24} />
          </button>
        </div>
        
        <div className="query-modal__body">
          <div className="query-modal__form-group">
            <label htmlFor="manual-query" className="query-modal__label">
              Paste or type your existing search query:
            </label>
            <textarea
              id="manual-query"
              rows={6}
              className="query-modal__textarea query-modal__textarea--monospace"
              placeholder="Example: (pembrolizumab OR Keytruda) AND (advanced OR metastatic) AND (Non-small cell lung cancer OR NSCLC)"
              value={manualQuery}
              onChange={(e) => onManualQueryChange(e.target.value)}
            />
            <p className="query-modal__help-text">
              Enter your query using standard syntax with operators (AND, OR, NOT)
            </p>
          </div>
        </div>
        
        <div className="query-modal__footer">
          <button onClick={onClose} className="query-modal__btn query-modal__btn--secondary">
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!manualQuery.trim()}
            className="query-modal__btn query-modal__btn--success"
          >
            <Edit3 size={20} className="query-modal__btn-icon" />
            Proceed to Builder
          </button>
        </div>
      </div>
    </div>
  );
};

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  message = "AI is analyzing your objective and creating an optimized search query..."
}) => {
  if (!isOpen) return null;

  return (
    <div className="query-modal-overlay">
      <div className="query-modal query-modal--loading">
        <div className="query-modal__loading-content">
          <div className="query-modal__loading-icon">
            <Bot size={32} />
          </div>
          <h3 className="query-modal__loading-title">Generating Optimized Query</h3>
          <p className="query-modal__loading-message">{message}</p>
        </div>
      </div>
    </div>
  );
};

interface AISuggestedQueryModalProps {
  isOpen: boolean;
  studyObjective: string;
  generatedQuery: string;
  formattedQuery: string;
  onSelect: () => void;
  onGoBack: () => void;
}

export const AISuggestedQueryModal: React.FC<AISuggestedQueryModalProps> = ({
  isOpen,
  studyObjective,
  generatedQuery,
  formattedQuery,
  onSelect,
  onGoBack
}) => {
  if (!isOpen) return null;

  return (
    <div className="query-modal-overlay">
      <div className="query-modal query-modal--large">
        <div className="query-modal__header">
          <div className="query-modal__header-content">
            <div className="query-modal__ai-icon">
              <Bot size={24} />
            </div>
            <div className="query-modal__header-text">
              <h2 className="query-modal__title">AI Generated Query</h2>
              <p className="query-modal__subtitle">Review the optimized search query generated for your study objective</p>
            </div>
          </div>
        </div>
        
        <div className="query-modal__body">
          <div className="query-modal__section">
            <h3 className="query-modal__section-title">Study Objective:</h3>
            <div className="query-modal__objective-display">
              <p className="query-modal__objective-text">"{studyObjective}"</p>
            </div>
          </div>

          <div className="query-modal__section">
            <h3 className="query-modal__section-title">Generated Search Query:</h3>
            <div className="query-modal__query-display">
              <div 
                className="query-modal__query-text"
                dangerouslySetInnerHTML={{ __html: highlightQuery(formattedQuery) }}
              />
            </div>
          </div>

          <div className="query-modal__ai-notes">
            <div className="query-modal__ai-notes-content">
              <div className="query-modal__ai-notes-icon">
                <Bot size={16} />
              </div>
              <div className="query-modal__ai-notes-text">
                <h4 className="query-modal__ai-notes-title">AI Optimization Notes</h4>
                <ul className="query-modal__ai-notes-list">
                  <li>Expanded with relevant synonyms and alternative terms</li>
                  <li>Structured with Boolean operators for comprehensive coverage</li>
                  <li>Optimized for maximum recall while maintaining relevance</li>
                  <li>Ready for further customization in the advanced query builder</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="query-modal__footer">
          <button onClick={onGoBack} className="query-modal__btn query-modal__btn--secondary">
            <ChevronLeft size={16} className="query-modal__btn-icon" />
            Go Back
          </button>
          <button onClick={onSelect} className="query-modal__btn query-modal__btn--primary">
            <Check size={16} className="query-modal__btn-icon" />
            Select & Continue
          </button>
        </div>
      </div>
    </div>
  );
};