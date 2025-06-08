// services/api.ts - API Service Layer

import { Project, NewProject } from '../types/project';
import { API_ENDPOINTS } from '../constants';
import { PROJECTS } from '../data/projects';

// Mock API delay to simulate network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Base API configuration
 */
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

/**
 * Generic API request function
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

/**
 * Project API service
 */
export const projectApi = {
  /**
   * Get all projects
   */
  async getProjects(): Promise<Project[]> {
    await delay(500); // Simulate network delay
    // In a real app, this would be:
    // return apiRequest<Project[]>(API_ENDPOINTS.projects);
    
    // For now, return mock data
    return PROJECTS;
  },

  /**
   * Get a single project by ID
   */
  async getProject(id: number): Promise<Project> {
    await delay(300);
    // return apiRequest<Project>(`${API_ENDPOINTS.projects}/${id}`);
    
    const project = PROJECTS.find(p => p.id === id);
    if (!project) {
      throw new Error(`Project with ID ${id} not found`);
    }
    return project;
  },

  /**
   * Create a new project
   */
  async createProject(projectData: NewProject): Promise<Project> {
    await delay(1000);
    // return apiRequest<Project>(API_ENDPOINTS.projects, {
    //   method: 'POST',
    //   body: JSON.stringify(projectData),
    // });
    
    // Mock creation
    const newProject: Project = {
      id: Math.floor(Math.random() * 10000),
      ...projectData,
      creationDate: new Date().toISOString().split('T')[0],
      modifiedDate: new Date().toISOString().split('T')[0],
      progress: {
        currentStep: 1,
        totalSteps: 7,
        steps: ["Query", "I/E Criteria", "Abstract Screening", "Full Text Screening", "Quality Assessment", "Data Extraction", "Meta Analysis"]
      }
    };
    
    return newProject;
  },

  /**
   * Update an existing project
   */
  async updateProject(id: number, projectData: Partial<Project>): Promise<Project> {
    await delay(800);
    // return apiRequest<Project>(`${API_ENDPOINTS.projects}/${id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(projectData),
    // });
    
    // Mock update
    const existingProject = PROJECTS.find(p => p.id === id);
    if (!existingProject) {
      throw new Error(`Project with ID ${id} not found`);
    }
    
    return {
      ...existingProject,
      ...projectData,
      modifiedDate: new Date().toISOString().split('T')[0]
    };
  },

  /**
   * Delete a project
   */
  async deleteProject(id: number): Promise<void> {
    await delay(500);
    // return apiRequest<void>(`${API_ENDPOINTS.projects}/${id}`, {
    //   method: 'DELETE',
    // });
    
    // Mock deletion
    console.log(`Project ${id} deleted`);
  },

  /**
   * Clone a project
   */
  async cloneProject(id: number): Promise<Project> {
    await delay(1200);
    
    const originalProject = await this.getProject(id);
    const clonedProject: Project = {
      ...originalProject,
      id: Math.floor(Math.random() * 10000),
      name: `${originalProject.name} (Copy)`,
      creationDate: new Date().toISOString().split('T')[0],
      modifiedDate: new Date().toISOString().split('T')[0],
      progress: {
        currentStep: 1,
        totalSteps: 7,
        steps: ["Query", "I/E Criteria", "Abstract Screening", "Full Text Screening", "Quality Assessment", "Data Extraction", "Meta Analysis"]
      }
    };
    
    return clonedProject;
  },

  /**
   * Search projects
   */
  async searchProjects(query: string): Promise<Project[]> {
    await delay(300);
    // return apiRequest<Project[]>(`${API_ENDPOINTS.search}?q=${encodeURIComponent(query)}`);
    
    return PROJECTS.filter(project =>
      project.name.toLowerCase().includes(query.toLowerCase()) ||
      project.diseaseCategory.toLowerCase().includes(query.toLowerCase()) ||
      project.creator.toLowerCase().includes(query.toLowerCase()) ||
      project.domain.toLowerCase().includes(query.toLowerCase())
    );
  }
};

/**
 * User API service
 */
export const userApi = {
  /**
   * Get current user profile
   */
  async getCurrentUser() {
    await delay(200);
    // return apiRequest(`${API_ENDPOINTS.users}/me`);
    
    return {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@noustarx.com',
      initials: 'SJ',
      role: 'Senior Researcher',
      avatar: undefined
    };
  }
};

/**
 * Export all API services
 */
export const api = {
  projects: projectApi,
  users: userApi,
};