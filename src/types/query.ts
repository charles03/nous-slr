// types/query.ts - Query-related type definitions

export interface SearchQuery {
  id: string;
  text: string;
  formatted?: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface QueryField {
  name: string;
  value: string;
  label: string;
}

export interface GeneratedQuery {
  relaxed: string;
  moderate: string;
  strict: string;
}

export interface AIQueryRequest {
  objective: string;
  domain?: string;
  population?: string;
  intervention?: string;
}

export interface QueryFormatterOptions {
  preserveNewlines?: boolean;
  highlightOperators?: boolean;
  collapseNestedGroups?: boolean;
}

export interface QueryBuilderState {
  queryText: string;
  selectedField: string;
  newTerm: string;
  isEditMode: boolean;
  showBuilder: boolean;
  cursorPosition: { start: number; end: number };
}

export type QueryFlow = 'ai' | 'manual' | null;

export const QUERY_FIELD_OPTIONS: QueryField[] = [
  { name: 'all', value: 'All Fields', label: 'All Fields' },
  { name: 'title_abstract', value: 'Title/Abstract', label: 'Title/Abstract' },
  { name: 'date_publication', value: 'Date - Publication', label: 'Date - Publication' },
  { name: 'journal', value: 'Journal', label: 'Journal' },
  { name: 'language', value: 'Language', label: 'Language' },
  { name: 'mesh_terms', value: 'MeSH Terms', label: 'MeSH Terms' }
];