// components/Header/Header.tsx

import React from 'react';
import { Plus } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  onCreateProject: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreateProject }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          {/* Company Logo */}
          <div className="logo">
            <span className="logo-text">N</span>
          </div>
          
          {/* Company Name */}
          <div className="company-info">
            <span className="company-name">NoustarX</span>
          </div>
          
          {/* Application Name */}
          <div className="app-info">
            <h1 className="app-title">AISLR</h1>
            <p className="app-subtitle">AI-Powered Systematic Literature Review</p>
          </div>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">Dr. Sarah Johnson</span>
            <div className="user-avatar">
              SJ
            </div>
          </div>
          <button 
            className="create-button" 
            onClick={onCreateProject}
          >
            <Plus size={16} className="create-icon" />
            <span className="create-text-full">Create Project</span>
            <span className="create-text-short">Create</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;