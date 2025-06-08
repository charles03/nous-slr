// components/PICOFlowSelector/PICOFlowSelector.tsx

import React from 'react';
import { Sparkles, Edit3, Check } from 'lucide-react';
import './PICOFlowSelector.css';

interface PICOFlowSelectorProps {
  onStartAI: () => void;
  onStartManual: () => void;
}

const PICOFlowSelector: React.FC<PICOFlowSelectorProps> = ({
  onStartAI,
  onStartManual,
}) => {
  return (
    <div className="pico-flow-selector">
      <div className="pico-flow-selector__content">
        <div className="pico-flow-selector__header">
          <h3 className="pico-flow-selector__title">Define Your PICO Criteria</h3>
          <p className="pico-flow-selector__description">
            Choose how you'd like to create your inclusion and exclusion criteria
          </p>
        </div>
        
        <div className="pico-flow-selector__options">
          
          {/* AI-Powered Flow */}
          <div className="flow-option flow-option--ai">
            <div className="flow-option__content">
              <div className="flow-option__icon">
                <Sparkles size={24} />
              </div>
              <h4 className="flow-option__title">AI-Powered Generation</h4>
              <p className="flow-option__description">
                Provide your study objective and let AI generate comprehensive PICO criteria automatically
              </p>
              <ul className="flow-option__features">
                <li className="flow-option__feature">
                  <Check size={16} />
                  <span>Automatic PICO framework generation</span>
                </li>
                <li className="flow-option__feature">
                  <Check size={16} />
                  <span>Evidence-based criteria suggestions</span>
                </li>
                <li className="flow-option__feature">
                  <Check size={16} />
                  <span>Comprehensive inclusion/exclusion mapping</span>
                </li>
              </ul>
            </div>
            
            <button
              onClick={onStartAI}
              className="flow-option__button flow-option__button--ai"
            >
              <Sparkles size={18} />
              Generate with AI
            </button>
          </div>

          {/* Manual Input Flow */}
          <div className="flow-option flow-option--manual">
            <div className="flow-option__content">
              <div className="flow-option__icon">
                <Edit3 size={24} />
              </div>
              <h4 className="flow-option__title">Manual Definition</h4>
              <p className="flow-option__description">
                Define your PICO criteria manually with full control over each component
              </p>
              <ul className="flow-option__features">
                <li className="flow-option__feature">
                  <Check size={16} />
                  <span>Complete control over criteria</span>
                </li>
                <li className="flow-option__feature">
                  <Check size={16} />
                  <span>Drag-and-drop organization</span>
                </li>
                <li className="flow-option__feature">
                  <Check size={16} />
                  <span>Custom criteria categories</span>
                </li>
              </ul>
            </div>
            
            <button
              onClick={onStartManual}
              className="flow-option__button flow-option__button--manual"
            >
              <Edit3 size={18} />
              Define Manually
            </button>
          </div>
        </div>
        
        <div className="pico-flow-selector__footer">
          <p>
            Both approaches allow you to refine and customize your criteria after initial setup
          </p>
        </div>
      </div>
    </div>
  );
};

export default PICOFlowSelector;