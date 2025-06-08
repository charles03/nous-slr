import React, { useState } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ProjectList from './components/ProjectList/ProjectList';
import CreateProjectModal from './components/CreateProjectModal/CreateProjectModal';
import { Project } from './types/project';
import { PROJECTS } from './data/projects';
import './App.css';

const App: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projects] = useState<Project[]>(PROJECTS);

  const handleCreateProject = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const handleEditProject = (id: number) => {
    console.log('Edit project:', id);
  };

  const handleCloneProject = (id: number) => {
    console.log('Clone project:', id);
  };

  const handleDeleteProject = (id: number) => {
    console.log('Delete project:', id);
  };

  return (
    <div className="app">
      <Header onCreateProject={handleCreateProject} />
      
      <main className="main-content">
        <ProjectList 
          projects={projects}
          onEdit={handleEditProject}
          onClone={handleCloneProject}
          onDelete={handleDeleteProject}
          onCreateProject={handleCreateProject}
        />
      </main>
      
      <Footer />
      
      {showCreateModal && (
        <CreateProjectModal onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;