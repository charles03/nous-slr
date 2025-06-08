// App-with-Context.tsx - Main App Component Using Context
// This shows how to integrate the context provider with the main application

import React, { useEffect } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ProjectList from './components/ProjectList/ProjectList';
import CreateProjectModal from './components/CreateProjectModal/CreateProjectModal';
import { AppProvider, useAppContext, useAppActions } from './context/AppContext';
import { api } from './services/api';
import './App.css';

// Main App component that uses context
const AppContent: React.FC = () => {
  const { state } = useAppContext();
  const actions = useAppActions();

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        actions.setLoading(true);
        
        // Load user and projects in parallel
        const [user, projects] = await Promise.all([
          api.users.getCurrentUser(),
          api.projects.getProjects()
        ]);
        
        actions.setUser(user);
        actions.setProjects(projects);
      } catch (error) {
        actions.setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        actions.setLoading(false);
      }
    };

    loadInitialData();
  }, [actions]);

  const handleCreateProject = () => {
    actions.toggleCreateModal(true);
  };

  const handleCloseModal = () => {
    actions.toggleCreateModal(false);
  };

  const handleEditProject = async (id: number) => {
    try {
      const project = await api.projects.getProject(id);
      actions.selectProject(project);
      actions.toggleEditModal(true);
    } catch (error) {
      actions.setError(error instanceof Error ? error.message : 'Failed to load project');
    }
  };

  const handleCloneProject = async (id: number) => {
    try {
      actions.setLoading(true);
      const clonedProject = await api.projects.cloneProject(id);
      actions.addProject(clonedProject);
    } catch (error) {
      actions.setError(error instanceof Error ? error.message : 'Failed to clone project');
    } finally {
      actions.setLoading(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      actions.setLoading(true);
      await api.projects.deleteProject(id);
      actions.deleteProject(id);
    } catch (error) {
      actions.setError(error instanceof Error ? error.message : 'Failed to delete project');
    } finally {
      actions.setLoading(false);
    }
  };

  // Show loading state
  if (state.isLoading && state.projects.length === 0) {
    return (
      <div className="app">
        <Header onCreateProject={handleCreateProject} />
        <main className="main-content">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading projects...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (state.error) {
    return (
      <div className="app">
        <Header onCreateProject={handleCreateProject} />
        <main className="main-content">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center bg-white rounded-lg shadow-sm p-8 max-w-md w-full mx-4">
              <div className="text-red-500 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
              <p className="text-gray-600 mb-4">{state.error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header onCreateProject={handleCreateProject} />
      
      <main className="main-content">
        <ProjectList 
          projects={state.projects}
          onEdit={handleEditProject}
          onClone={handleCloneProject}
          onDelete={handleDeleteProject}
          onCreateProject={handleCreateProject}
        />
      </main>
      
      <Footer />
      
      {state.showCreateModal && (
        <CreateProjectModal onClose={handleCloseModal} />
      )}
    </div>
  );
};

// Main App component with Provider wrapper
const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;