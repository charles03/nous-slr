// services/queryService.ts - Query API Service Layer

import { SearchQuery, AIQueryRequest, GeneratedQuery } from '../types/query';

// Mock API delay to simulate network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock generated queries for different study objectives
 */
const MOCK_QUERY_TEMPLATES: Record<string, GeneratedQuery> = {
  'pembrolizumab_nsclc': {
    relaxed: "(pembrolizumab OR Keytruda OR anti-PD-1) AND (advanced OR metastatic OR late-stage) AND (Non-small cell lung cancer OR NSCLC OR lung carcinoma)",
    moderate: "(pembrolizumab OR Keytruda) AND (advanced OR metastatic) AND (Non-small cell lung cancer OR NSCLC)",
    strict: "(pembrolizumab[Title/Abstract] OR Keytruda[Title/Abstract] OR anti-PD-1[Title/Abstract]) AND (advanced[Title/Abstract] AND metastatic[Title/Abstract]) AND (Non-small cell lung cancer[Title/Abstract] OR NSCLC[Title/Abstract])"
  },
  'diabetes_treatment': {
    relaxed: "(diabetes OR diabetic) AND (treatment OR therapy OR medication) AND (effectiveness OR efficacy OR outcome)",
    moderate: "(diabetes mellitus OR type 2 diabetes) AND (pharmacological treatment OR antidiabetic) AND (clinical effectiveness)",
    strict: "(diabetes mellitus[Title/Abstract] OR type 2 diabetes[Title/Abstract]) AND (pharmacological treatment[Title/Abstract] OR antidiabetic agents[Title/Abstract]) AND (clinical effectiveness[Title/Abstract] OR treatment outcomes[Title/Abstract])"
  },
  'cancer_immunotherapy': {
    relaxed: "(cancer OR tumor OR malignancy) AND (immunotherapy OR immune therapy OR checkpoint inhibitor) AND (clinical trial OR effectiveness)",
    moderate: "(cancer OR carcinoma OR neoplasm) AND (immunotherapy OR PD-1 OR PD-L1 OR CTLA-4) AND (clinical effectiveness OR survival)",
    strict: "(cancer[Title/Abstract] OR carcinoma[Title/Abstract]) AND (immunotherapy[Title/Abstract] OR checkpoint inhibitor[Title/Abstract]) AND (overall survival[Title/Abstract] OR progression free survival[Title/Abstract])"
  },
  'default': {
    relaxed: "(intervention OR treatment) AND (condition OR disease) AND (outcome OR effectiveness)",
    moderate: "(therapeutic intervention OR treatment protocol) AND (medical condition OR disease state) AND (clinical outcome OR treatment effectiveness)",
    strict: "(therapeutic intervention[Title/Abstract] OR treatment protocol[Title/Abstract]) AND (medical condition[Title/Abstract] OR disease state[Title/Abstract]) AND (clinical outcome[Title/Abstract] OR treatment effectiveness[Title/Abstract])"
  }
};

/**
 * Determine which template to use based on study objective
 */
function getQueryTemplate(objective: string): GeneratedQuery {
  const lowerObjective = objective.toLowerCase();
  
  if (lowerObjective.includes('pembrolizumab') && 
      lowerObjective.includes('non-small cell lung cancer') && 
      (lowerObjective.includes('advanced') || lowerObjective.includes('metastatic'))) {
    return MOCK_QUERY_TEMPLATES.pembrolizumab_nsclc;
  }
  
  if (lowerObjective.includes('diabetes') && 
      (lowerObjective.includes('treatment') || lowerObjective.includes('therapy'))) {
    return MOCK_QUERY_TEMPLATES.diabetes_treatment;
  }
  
  if (lowerObjective.includes('cancer') && 
      (lowerObjective.includes('immunotherapy') || lowerObjective.includes('immune'))) {
    return MOCK_QUERY_TEMPLATES.cancer_immunotherapy;
  }
  
  return MOCK_QUERY_TEMPLATES.default;
}

/**
 * Query API service
 */
export const queryApi = {
  /**
   * Generate AI-powered search query from study objective
   */
  async generateQuery(request: AIQueryRequest): Promise<string> {
    await delay(2000); // Simulate AI processing time
    
    // In a real app, this would call an AI service
    // return apiRequest<string>('/api/query/generate', {
    //   method: 'POST',
    //   body: JSON.stringify(request),
    // });
    
    const template = getQueryTemplate(request.objective);
    return template.relaxed; // Return the relaxed version by default
  },

  /**
   * Get multiple query variations (relaxed, moderate, strict)
   */
  async generateQueryVariations(request: AIQueryRequest): Promise<GeneratedQuery> {
    await delay(2500);
    
    return getQueryTemplate(request.objective);
  },

  /**
   * Validate query syntax
   */
  async validateQuery(query: string): Promise<{ isValid: boolean; errors: string[]; suggestions?: string[] }> {
    await delay(500);
    
    const errors: string[] = [];
    const suggestions: string[] = [];
    
    // Basic validation
    let parenCount = 0;
    for (const char of query) {
      if (char === '(') parenCount++;
      if (char === ')') parenCount--;
      if (parenCount < 0) {
        errors.push('Unmatched closing parenthesis');
        break;
      }
    }
    if (parenCount > 0) {
      errors.push('Unmatched opening parenthesis');
    }
    
    if (query.includes('()')) {
      errors.push('Empty parentheses found');
      suggestions.push('Remove empty parentheses or add search terms');
    }
    
    if (/\b(AND|OR|NOT)\s+(AND|OR|NOT)\b/.test(query)) {
      errors.push('Consecutive operators found');
      suggestions.push('Add search terms between operators');
    }
    
    if (/^(AND|OR|NOT)\b/.test(query.trim())) {
      errors.push('Query cannot start with an operator');
    }
    if (/\b(AND|OR|NOT)$/.test(query.trim())) {
      errors.push('Query cannot end with an operator');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };
  },

  /**
   * Get query execution statistics from PubMed
   */
  async getQueryStats(query: string): Promise<{ resultCount: number; executionTime: number }> {
    await delay(1000);
    
    // Mock statistics based on query complexity
    const wordCount = query.split(/\s+/).length;
    const hasOperators = /\b(AND|OR|NOT)\b/.test(query);
    
    let baseCount = Math.floor(Math.random() * 50000) + 1000;
    
    // Adjust based on query complexity
    if (hasOperators) {
      baseCount = Math.floor(baseCount * 0.3); // Operators typically reduce results
    }
    if (wordCount > 10) {
      baseCount = Math.floor(baseCount * 0.5); // More complex queries = fewer results
    }
    
    return {
      resultCount: baseCount,
      executionTime: Math.floor(Math.random() * 2000) + 500 // 500-2500ms
    };
  },

  /**
   * Save query to user's query history
   */
  async saveQuery(query: SearchQuery): Promise<SearchQuery> {
    await delay(300);
    
    // Mock saving
    const savedQuery: SearchQuery = {
      ...query,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      modifiedAt: new Date()
    };
    
    return savedQuery;
  },

  /**
   * Get user's query history
   */
  async getQueryHistory(limit: number = 10): Promise<SearchQuery[]> {
    await delay(500);
    
    // Mock query history
    const mockHistory: SearchQuery[] = [
      {
        id: 'q1',
        text: '(pembrolizumab OR Keytruda) AND (advanced OR metastatic) AND (Non-small cell lung cancer OR NSCLC)',
        formatted: '(pembrolizumab OR Keytruda)\nAND (advanced OR metastatic)\nAND (Non-small cell lung cancer OR NSCLC)',
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        modifiedAt: new Date(Date.now() - 86400000)
      },
      {
        id: 'q2',
        text: '(diabetes mellitus) AND (treatment effectiveness) AND (systematic review)',
        formatted: '(diabetes mellitus)\nAND (treatment effectiveness)\nAND (systematic review)',
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        modifiedAt: new Date(Date.now() - 172800000)
      }
    ];
    
    return mockHistory.slice(0, limit);
  },

  /**
   * Export query in various formats
   */
  async exportQuery(query: string, format: 'pubmed' | 'ovid' | 'embase'): Promise<string> {
    await delay(800);
    
    // Mock format conversion
    switch (format) {
      case 'ovid':
        return query.replace(/\[Title\/Abstract\]/g, '.ti,ab.');
      case 'embase':
        return query.replace(/\[Title\/Abstract\]/g, ':ti,ab');
      case 'pubmed':
      default:
        return query;
    }
  }
};

/**
 * Export all query-related API services
 */
export const queryService = {
  query: queryApi
};