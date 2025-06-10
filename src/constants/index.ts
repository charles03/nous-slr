// constants/index.ts - Application Constants

export const APP_CONFIG = {
  name: 'NoustarX AISLR',
  fullName: 'AI-Powered Systematic Literature Review',
  version: '1.0.0',
  company: 'NoustarX',
} as const;

export const PAGINATION = {
  defaultItemsPerPage: 10,
  maxItemsPerPage: 50,
  pageSizeOptions: [5, 10, 20, 50],
} as const;

export const WORKFLOW_STEPS = [
  'Search',
  'PICO Criteria Builder', 
  'Abstract Screening',
  'Full Text Screening',
  'Quality Assessment',
  'Data Extraction',
  'Meta Analysis'
] as const;

export const PROJECT_STATUS = {
  draft: 'Draft',
  active: 'Active',
  completed: 'Completed',
  archived: 'Archived',
} as const;

export const DISEASE_CATEGORIES = [
  'Oncology',
  'Cardiology',
  'Neurology',
  'Endocrinology',
  'Psychiatry',
  'Immunology',
  'Infectious Diseases',
  'Gastroenterology',
  'Pulmonology',
  'Nephrology',
  'Dermatology',
  'Orthopedics',
  'Ophthalmology',
  'Other'
] as const;

export const STUDY_DOMAINS = [
  'Treatment Effectiveness (Safety/Efficacy)',
  'Cost Effectiveness/Economic Evaluation',
  'Epidemiology: Prevalence and Incidence',
  'Natural History of Disease',
  'Diagnostic Test Accuracy',
  'Etiology and Risk Factors',
  'Prognostic Review',
  'Health Inequalities',
  'Methodology',
  'Adherence and Compliance',
  'Others'
] as const;

export const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'creationDate', label: 'Created Date' },
  { value: 'modifiedDate', label: 'Modified Date' },
  { value: 'creator', label: 'Creator' },
  { value: 'diseaseCategory', label: 'Disease Category' },
  { value: 'progress', label: 'Progress' }
] as const;

export const VIEW_MODES = {
  grid: 'grid',
  list: 'list'
} as const;

export const LOCAL_STORAGE_KEYS = {
  viewMode: 'noustar_view_mode',
  sortPreferences: 'noustar_sort_preferences',
  userPreferences: 'noustar_user_preferences',
  recentProjects: 'noustar_recent_projects'
} as const;

export const API_ENDPOINTS = {
  projects: '/api/projects',
  users: '/api/users',
  auth: '/api/auth',
  search: '/api/search'
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8'
  },
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    500: '#10b981',
    600: '#059669',
    700: '#047857'
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309'
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c'
  }
} as const;