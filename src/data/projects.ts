// data/projects.ts - Sample Project Data

import { Project } from '../types/project';

export const PROJECTS: Project[] = [
  {
    id: 1,
    name: "Diabetes Treatment Effectiveness Review",
    creationDate: "2025-03-12",
    modifiedDate: "2025-04-10",
    creator: "Maria Chen",
    diseaseCategory: "Endocrinology",
    domain: "Treatment Effectiveness (Safety/Efficacy)",
    progress: {
      currentStep: 4,
      totalSteps: 7,
      steps: ["Search", "PICO Criteria Builder", "Abstract Screening", "Full Text Screening", "Quality Assessment", "Data Extraction", "Meta Analysis"]
    }
  },
  {
    id: 2,
    name: "Non-small Cell Lung Cancer SLR",
    creationDate: "2025-02-28",
    modifiedDate: "2025-04-14",
    creator: "James Wilson",
    diseaseCategory: "Oncology",
    domain: "Cost Effectiveness/Economic Evaluation",
    progress: {
      currentStep: 7,
      totalSteps: 7,
      steps: ["Query", "I/E Criteria", "Abstract Screening", "Full Text Screening", "Quality Assessment", "Data Extraction", "Meta Analysis"]
    }
  },
  {
    id: 3,
    name: "Alzheimer's Early Detection Methods",
    creationDate: "2025-04-01",
    modifiedDate: "2025-04-08",
    creator: "Sophia Lee",
    diseaseCategory: "Neurology",
    domain: "Diagnostic Test Accuracy",
    progress: {
      currentStep: 2,
      totalSteps: 7,
      steps: ["Query", "I/E Criteria", "Abstract Screening", "Full Text Screening", "Quality Assessment", "Data Extraction", "Meta Analysis"]
    }
  },
  {
    id: 4,
    name: "Hypertension Management in Elderly",
    creationDate: "2025-03-05",
    modifiedDate: "2025-04-12",
    creator: "Robert Johnson",
    diseaseCategory: "Cardiology",
    domain: "Epidemiology: Prevalence and Incidence",
    progress: {
      currentStep: 3,
      totalSteps: 7,
      steps: ["Query", "I/E Criteria", "Abstract Screening", "Full Text Screening", "Quality Assessment", "Data Extraction", "Meta Analysis"]
    }
  },
  {
    id: 5,
    name: "Breast Cancer Screening Effectiveness",
    creationDate: "2025-01-15",
    modifiedDate: "2025-04-05",
    creator: "Emily Parker",
    diseaseCategory: "Oncology",
    domain: "Treatment Effectiveness (Safety/Efficacy)",
    progress: {
      currentStep: 5,
      totalSteps: 7,
      steps: ["Query", "I/E Criteria", "Abstract Screening", "Full Text Screening", "Quality Assessment", "Data Extraction", "Meta Analysis"]
    }
  }
];

export const DOMAIN_OPTIONS = [
  "Treatment Effectiveness (Safety/Efficacy)",
  "Cost Effectiveness/Economic Evaluation",
  "Epidemiology: Prevalence and Incidence", 
  "Natural History of Disease",
  "Diagnostic Test Accuracy",
  "Etiology and Risk Factors",
  "Prognostic Review",
  "Health Inequalities",
  "Methodology",
  "Adherence and Compliance",
  "Others"
];