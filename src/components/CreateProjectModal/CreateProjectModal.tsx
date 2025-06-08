// components/CreateProjectModal/CreateProjectModal.tsx

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { NewProject } from '../../types/project';
import { DOMAIN_OPTIONS } from '../../data/projects';
import './CreateProjectModal.css';

interface CreateProjectModalProps {
  onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose }) => {
  const [newProject, setNewProject] = useState<NewProject>({
    name: '',
    diseaseCategory: '',
    domain: '',
    creator: 'Dr. Sarah Johnson'
  });

  const handleSubmit = () => {
    if (newProject.name && newProject.diseaseCategory && newProject.domain) {
      console.log('Creating project:', newProject);
      // Reset form and close modal
      setNewProject({
        name: '',
        diseaseCategory: '',
        domain: '',
        creator: 'Dr. Sarah Johnson'
      });
      onClose();
    }
  };

  const handleCancel = () => {
    setNewProject({
      name: '',
      diseaseCategory: '',
      domain: '',
      creator: 'Dr. Sarah Johnson'
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Create New Project</h2>
          <button 
            onClick={handleCancel}
            className="modal-close-btn"
          >
            <Plus size={24} className="close-icon" />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="projectName" className="form-label">
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              value={newProject.name}
              onChange={(e) => setNewProject({...newProject, name: e.target.value})}
              className="form-input"
              placeholder="Enter project name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="diseaseCategory" className="form-label">
              Disease Category
            </label>
            <input
              type="text"
              id="diseaseCategory"
              value={newProject.diseaseCategory}
              onChange={(e) => setNewProject({...newProject, diseaseCategory: e.target.value})}
              className="form-input"
              placeholder="e.g., Oncology, Cardiology"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="domain" className="form-label">
              Domain/Topic
            </label>
            <select
              id="domain"
              value={newProject.domain}
              onChange={(e) => setNewProject({...newProject, domain: e.target.value})}
              className="form-select"
            >
              <option value="">Select a domain</option>
              {DOMAIN_OPTIONS.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="modal-footer">
          <button
            onClick={handleCancel}
            className="btn btn--secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!newProject.name || !newProject.diseaseCategory || !newProject.domain}
            className="btn btn--primary"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;