// App.tsx - Unified App with Router + Context + API Integration

import React, { useEffect } from 'react';
import { Router, Route, useNavigation } from './components/Router/SimpleRouter';
import { AppProvider, useAppContext, useAppActions } from './context/AppContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ProjectList from './components/ProjectList/ProjectList';
import CreateProjectModal from './components/CreateProjectModal/CreateProjectModal';
import QueryPage from './pages/QueryPage/QueryPage';
import PICOCriteriaPage from './components/PICOCriteriaPage/PICOCriteriaPage';
import { api } from './services/api';
import './App.css';

// Loading Component
const LoadingUI: React.FC = () => (
  <div className="app">
    <Header onCreateProject={() => {}} />
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

// Error Component
const ErrorUI: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="app">
    <Header onCreateProject={() => {}} />
    <main className="main-content">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-sm p-8 max-w-md w-full mx-4">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={onRetry}
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

// Home Page Component with Context Integration
const HomePage: React.FC = () => {
  const { navigate } = useNavigation();
  const { state } = useAppContext();
  const actions = useAppActions();

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
      navigate(`/project/${id}/pico`);
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

// Project Query Page Wrapper
const ProjectQueryPage: React.FC = () => {
  const { navigate } = useNavigation();

  const handleCreateProject = () => {
    navigate('/');
  };

  return <QueryPage onCreateProject={handleCreateProject} />;
};

// PICO Criteria Page Wrapper
const PICOPage: React.FC = () => {
  const { navigate } = useNavigation();

  const handleCreateProject = () => {
    navigate('/');
  };

  return <PICOCriteriaPage onCreateProject={handleCreateProject} />;
};

// Main App Content with Routing
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

  // Handle retry for error state
  const handleRetry = () => {
    actions.setError(null);
    window.location.reload();
  };

  // Show loading state
  if (state.isLoading && state.projects.length === 0) {
    return <LoadingUI />;
  }

  // Show error state
  if (state.error) {
    return <ErrorUI error={state.error} onRetry={handleRetry} />;
  }

  return (
    <div className="app">
      <Route path="/" component={HomePage} exact />
      <Route path="/project/:id/query" component={ProjectQueryPage} />
      <Route path="/project/:id/pico" component={PICOPage} />
      <Route path="/project" component={ProjectQueryPage} />
      <Route path="/query" component={ProjectQueryPage} />
      <Route path="/pico" component={PICOPage} />
    </div>
  );
};

// Main App with Context + Router Providers
const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;