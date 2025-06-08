// constants/workflow.ts - Workflow Constants

import { 
  Search, 
  Filter, 
  Book, 
  FileText, 
  CheckSquare, 
  Database, 
  BarChart3 
} from 'lucide-react';

export const workflowStepIcons = {
  'Query': Search,
  'I/E Criteria': Filter,
  'Abstract Screening': Book,
  'Full Text Screening': FileText,
  'Quality Assessment': CheckSquare,
  'Data Extraction': Database,
  'Meta Analysis': BarChart3
} as const;