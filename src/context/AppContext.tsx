import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Project, ViewMode, SortBy, SortOrder } from '../types/project';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEYS } from '../constants';

// Types for the context
interface User {
  id: number;
  name: string;
  email: string;
  initials: string;
  role: string;
  avatar?: string;
}

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Projects state
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
  
  // UI state
  viewMode: ViewMode;
  sortBy: SortBy;
  sortOrder: SortOrder;
  searchTerm: string;
  currentPage: number;
  
  // Modal state
  showCreateModal: boolean;
  showEditModal: boolean;
  showDeleteModal: boolean;
}

// Action types
type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: { id: number; project: Partial<Project> } }
  | { type: 'DELETE_PROJECT'; payload: number }
  | { type: 'SELECT_PROJECT'; payload: Project | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_SORT'; payload: { sortBy: SortBy; sortOrder: SortOrder } }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'TOGGLE_CREATE_MODAL'; payload: boolean }
  | { type: 'TOGGLE_EDIT_MODAL'; payload: boolean }
  | { type: 'TOGGLE_DELETE_MODAL'; payload: boolean };

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,
  viewMode: 'list',
  sortBy: 'modifiedDate',
  sortOrder: 'desc',
  searchTerm: '',
  currentPage: 1,
  showCreateModal: false,
  showEditModal: false,
  showDeleteModal: false,
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };

    case 'SET_PROJECTS':
      return {
        ...state,
        projects: action.payload,
      };

    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [action.payload, ...state.projects],
      };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id
            ? { ...project, ...action.payload.project }
            : project
        ),
      };

    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
        selectedProject: state.selectedProject?.id === action.payload ? null : state.selectedProject,
      };

    case 'SELECT_PROJECT':
      return {
        ...state,
        selectedProject: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload,
      };

    case 'SET_SORT':
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder,
        currentPage: 1, // Reset to first page when sorting changes
      };

    case 'SET_SEARCH_TERM':
      return {
        ...state,
        searchTerm: action.payload,
        currentPage: 1, // Reset to first page when search changes
      };

    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload,
      };

    case 'TOGGLE_CREATE_MODAL':
      return {
        ...state,
        showCreateModal: action.payload,
      };

    case 'TOGGLE_EDIT_MODAL':
      return {
        ...state,
        showEditModal: action.payload,
      };

    case 'TOGGLE_DELETE_MODAL':
      return {
        ...state,
        showDeleteModal: action.payload,
      };

    default:
      return state;
  }
}

// Context creation
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Context provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Persist view mode and sort preferences
  const [storedViewMode, setStoredViewMode] = useLocalStorage<ViewMode>(
    LOCAL_STORAGE_KEYS.viewMode,
    'list'
  );
  
  const [storedSortPreferences, setStoredSortPreferences] = useLocalStorage(
    LOCAL_STORAGE_KEYS.sortPreferences,
    { sortBy: 'modifiedDate', sortOrder: 'desc' }
  );

  // Initialize state with stored preferences
  useEffect(() => {
    dispatch({ type: 'SET_VIEW_MODE', payload: storedViewMode });
    dispatch({ 
      type: 'SET_SORT', 
      payload: { 
        sortBy: storedSortPreferences.sortBy as SortBy, 
        sortOrder: storedSortPreferences.sortOrder as SortOrder 
      } 
    });
  }, [storedViewMode, storedSortPreferences]);

  // Update localStorage when preferences change
  useEffect(() => {
    setStoredViewMode(state.viewMode);
  }, [state.viewMode, setStoredViewMode]);

  useEffect(() => {
    setStoredSortPreferences({
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
    });
  }, [state.sortBy, state.sortOrder, setStoredSortPreferences]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Action creators for common operations
export const useAppActions = () => {
  const { dispatch } = useAppContext();

  return {
    setUser: (user: User) => dispatch({ type: 'SET_USER', payload: user }),
    setProjects: (projects: Project[]) => dispatch({ type: 'SET_PROJECTS', payload: projects }),
    addProject: (project: Project) => dispatch({ type: 'ADD_PROJECT', payload: project }),
    updateProject: (id: number, project: Partial<Project>) => 
      dispatch({ type: 'UPDATE_PROJECT', payload: { id, project } }),
    deleteProject: (id: number) => dispatch({ type: 'DELETE_PROJECT', payload: id }),
    selectProject: (project: Project | null) => dispatch({ type: 'SELECT_PROJECT', payload: project }),
    setLoading: (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    setViewMode: (viewMode: ViewMode) => dispatch({ type: 'SET_VIEW_MODE', payload: viewMode }),
    setSort: (sortBy: SortBy, sortOrder: SortOrder) => 
      dispatch({ type: 'SET_SORT', payload: { sortBy, sortOrder } }),
    setSearchTerm: (searchTerm: string) => dispatch({ type: 'SET_SEARCH_TERM', payload: searchTerm }),
    setCurrentPage: (page: number) => dispatch({ type: 'SET_CURRENT_PAGE', payload: page }),
    toggleCreateModal: (show: boolean) => dispatch({ type: 'TOGGLE_CREATE_MODAL', payload: show }),
    toggleEditModal: (show: boolean) => dispatch({ type: 'TOGGLE_EDIT_MODAL', payload: show }),
    toggleDeleteModal: (show: boolean) => dispatch({ type: 'TOGGLE_DELETE_MODAL', payload: show }),
  };
};