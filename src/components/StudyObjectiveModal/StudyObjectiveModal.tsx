// components/StudyObjectiveModal/StudyObjectiveModal.tsx

import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import './StudyObjectiveModal.css';

interface StudyObjectiveModalProps {
  onSubmit: (objective: string) => void;
  onClose: () => void;
}

const StudyObjectiveModal: React.FC<StudyObjectiveModalProps> = ({
  onSubmit,
  onClose,
}) => {
  const [objective, setObjective] = useState('');

  const handleSubmit = () => {
    if (objective.trim()) {
      onSubmit(objective.trim());
    }
  };

  const handleDemoClick = () => {
    setObjective('Effect of pembrolizumab in the treatment of advanced metastatic Non-small cell lung cancer patients');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="study-objective-modal" onClick={(e) => e.stopPropagation()}>
        <div className="study-objective-modal__header">
          <h2 className="study-objective-modal__title">Define Your Study Objective</h2>
          <button 
            onClick={onClose}
            className="study-objective-modal__close"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="study-objective-modal__body">
          <div className="form-group">
            <label htmlFor="objective" className="form-group__label">
              Please describe your research objective clearly:
            </label>
            <textarea
              id="objective"
              rows={6}
              className="form-group__textarea"
              placeholder="Example: Effect of pembrolizumab in advanced metastatic Non-small cell lung cancer patients."
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="demo-tip">
            <div className="demo-tip__content">
              <div className="demo-tip__icon">
                <Sparkles size={14} />
              </div>
              <div className="demo-tip__text">
                <p className="demo-tip__description">
                  <span className="demo-tip__label">Demo Tip:</span> Try the example objective to see AI-generated PICO criteria specifically tailored for pembrolizumab NSCLC studies.
                </p>
                <button
                  onClick={handleDemoClick}
                  className="demo-tip__button"
                  type="button"
                >
                  Use Demo Objective
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="study-objective-modal__footer">
          <button
            onClick={onClose}
            className="btn btn--secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!objective.trim()}
            className="btn btn--primary"
          >
            <Sparkles size={20} />
            Generate PICO Criteria
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyObjectiveModal;