// components/ProjectList/ProjectList.tsx - Unified Project List Component

import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Copy, Trash2, Play } from 'lucide-react';
import ProjectCard from '../ProjectCard/ProjectCard';
import SearchAndFilters from '../SearchAndFilters/SearchAndFilters';
import Pagination from '../Pagination/Pagination';
import ProgressBar from '../ProgressBar/ProgressBar';
import { Link, useNavigation } from '../Router/SimpleRouter';
import { Project, ViewMode, SortBy, SortOrder } from '../../types/project';
import './ProjectList.css';

interface ProjectListProps {
  projects: Project[];
  onEdit: (id: number) => void;
  onClone: (id: number) => void;
  onDelete: (id: number) => void;
  onCreateProject: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onEdit,
  onClone,
  onDelete,
  onCreateProject,
}) => {
  const { navigate } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortBy>('modifiedDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.diseaseCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.creator.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
  }, [projects, searchTerm, sortBy, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  // Reset to first page when search or sort changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSortByChange = (value: SortBy) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Navigate to project query page
  const handleOpenProject = (id: number) => {
    navigate(`/project/${id}/query`);
  };

  return (
    <div className="project-list">
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortByChange={handleSortByChange}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />
      
      {/* Main Content */}
      <div className="project-content">
        {viewMode === 'grid' ? (
          <div className="projects-grid">
            <div className="grid-container">
              {paginatedProjects.map(project => (
                <div key={project.id} className="project-card-wrapper">
                  <ProjectCard 
                    project={project} 
                    onEdit={onEdit}
                    onClone={onClone}
                    onDelete={onDelete}
                  />
                  <div className="project-card-actions-extended">
                    <button
                      onClick={() => handleOpenProject(project.id)}
                      className="project-card-open-btn"
                      title="Open Project"
                    >
                      <Play size={16} />
                      Open Project
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="projects-table-container">
            <div className="projects-table-wrapper">
              <table className="projects-table">
                <thead className="table-header">
                  <tr>
                    <th className="table-cell table-cell--header table-cell--name">
                      <div className="header-text">Project Name</div>
                    </th>
                    <th className="table-cell table-cell--header table-cell--category">
                      Disease Category
                    </th>
                    <th className="table-cell table-cell--header table-cell--domain">
                      Domain
                    </th>
                    <th className="table-cell table-cell--header table-cell--creator">
                      Creator
                    </th>
                    <th className="table-cell table-cell--header table-cell--date">
                      Created
                    </th>
                    <th className="table-cell table-cell--header table-cell--date">
                      Modified
                    </th>
                    <th className="table-cell table-cell--header table-cell--progress">
                      Progress
                    </th>
                    <th className="table-cell table-cell--header table-cell--actions">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {paginatedProjects.map(project => (
                    <tr key={project.id} className="table-row">
                      <td className="table-cell table-cell--name">
                        <Link
                          to={`/project/${project.id}/query`}
                          className="project-name project-name--link"
                          title={project.name}
                        >
                          {project.name}
                        </Link>
                      </td>
                      <td className="table-cell table-cell--category">
                        <span className="badge badge--disease">
                          {project.diseaseCategory}
                        </span>
                      </td>
                      <td className="table-cell table-cell--domain">
                        <span className="badge badge--domain" title={project.domain}>
                          {project.domain}
                        </span>
                      </td>
                      <td className="table-cell table-cell--creator">
                        {project.creator}
                      </td>
                      <td className="table-cell table-cell--date">
                        {formatDate(project.creationDate)}
                      </td>
                      <td className="table-cell table-cell--date">
                        {formatDate(project.modifiedDate)}
                      </td>
                      <td className="table-cell table-cell--progress">
                        <div className="table-progress">
                          <div className="progress-info">
                            <span className="progress-step-name">
                              {project.progress.steps[project.progress.currentStep-1]}
                            </span>
                            <span className="progress-ratio">
                              {project.progress.currentStep}/{project.progress.totalSteps}
                            </span>
                          </div>
                          <ProgressBar 
                            currentStep={project.progress.currentStep} 
                            totalSteps={project.progress.totalSteps}
                            steps={project.progress.steps}
                          />
                        </div>
                      </td>
                      <td className="table-cell table-cell--actions">
                        <div className="table-actions">
                          <button
                            onClick={() => handleOpenProject(project.id)}
                            className="action-btn action-btn--open"
                            title="Open Project"
                          >
                            <Play size={16} />
                          </button>
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredProjects.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-content">
            <div className="empty-state-icon">
              <Search size={24} />
            </div>
            <h3 className="empty-state-title">No projects found</h3>
            <p className="empty-state-description">
              Try adjusting your search terms or create a new project.
            </p>
            <div className="empty-state-action">
              <button 
                className="btn btn--primary" 
                onClick={onCreateProject}
              >
                <Plus size={18} className="btn-icon" />
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;