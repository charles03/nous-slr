// components/ProjectCard/ProjectCard.tsx

import React from 'react';
import { Calendar, User, Edit2, Copy, Trash2 } from 'lucide-react';
import ProgressBar from '../ProgressBar/ProgressBar';
import { Project } from '../../types/project';
import './ProjectCard.css';

interface ProjectCardProps {
  project: Project;
  onEdit: (id: number) => void;
  onClone: (id: number) => void;
  onDelete: (id: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onClone, onDelete }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="project-card">
      <div className="project-card__header">
        <h3 className="project-card__title">{project.name}</h3>
        <div className="project-card__badges">
          <span className="badge badge--disease">
            {project.diseaseCategory}
          </span>
          <span className="badge badge--domain">
            {project.domain}
          </span>
        </div>
      </div>
      
      <div className="project-card__meta">
        <div className="meta-item">
          <Calendar size={14} className="meta-icon" />
          <span className="meta-label">Created:</span>
          <span className="meta-value">{formatDate(project.creationDate)}</span>
        </div>
        <div className="meta-item">
          <Calendar size={14} className="meta-icon" />
          <span className="meta-label">Modified:</span>
          <span className="meta-value">{formatDate(project.modifiedDate)}</span>
        </div>
        <div className="meta-item">
          <User size={14} className="meta-icon" />
          <span className="meta-label">Creator:</span>
          <span className="meta-value">{project.creator}</span>
        </div>
      </div>
      
      <div className="project-card__progress">
        <div className="progress-header">
          <span className="progress-label">Progress</span>
          <span className="progress-status">
            {project.progress.currentStep}/{project.progress.totalSteps} - {project.progress.steps[project.progress.currentStep-1]}
          </span>
        </div>
        <ProgressBar 
          currentStep={project.progress.currentStep} 
          totalSteps={project.progress.totalSteps}
          steps={project.progress.steps}
        />
      </div>
      
      <div className="project-card__actions">
        <button 
          onClick={() => onEdit(project.id)} 
          className="action-btn action-btn--edit"
          title="Edit Project"
        >
          <Edit2 size={16} />
        </button>
        <button 
          onClick={() => onClone(project.id)} 
          className="action-btn action-btn--clone"
          title="Clone Project"
        >
          <Copy size={16} />
        </button>
        <button 
          onClick={() => onDelete(project.id)} 
          className="action-btn action-btn--delete"
          title="Delete Project"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;