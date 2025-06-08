// utils/queryFormatter.ts - Query formatting utilities

import { QueryFormatterOptions } from '../types/query';

/**
 * Clean and format a PubMed search query
 */
export function cleanQuery(input: string, options: QueryFormatterOptions = {}): string {
  if (!input) return '';
  
  let query = input.replace(/\s+/g, " ").trim();

  // Force all operators to uppercase
  query = query.replace(/\b(and|or|not)\b/gi, (match) => match.toUpperCase());

  // Collapse deeply nested same-operator groups
  const collapseNested = (query: string, operator: string): string => {
    let pattern = new RegExp(`\\(([^()]+(?:\\s+${operator}\\s+[^()]+)+)\\)`, 'g');
    let prev: string;
    do {
      prev = query;
      query = query.replace(pattern, (_, group) => {
        const flattened = group.replace(/\s*\)\s*${operator}\s*\(\s*/g, ` ${operator} `).replace(/[()]/g, '').trim();
        return `(${flattened})`;
      });
    } while (query !== prev);
    return query;
  };

  const collapseSameOperatorGroups = (str: string): string => {
    if (options.collapseNestedGroups !== false) {
      str = collapseNested(str, 'AND');
      str = collapseNested(str, 'OR');
    }
    return str;
  };

  const removeExtraParens = (str: string): string => {
    let prev: string;
    do {
      prev = str;
      str = str.replace(/\(\s*([^()]+?)\s*\)/g, (match, inner) => {
        if (/^[^()\s]+$/.test(inner)) {
          return inner; // remove parens around single term
        }
        return `(${inner.trim()})`;
      });
    } while (str !== prev);
    return str;
  };

  // Add space around date colons
  query = query.replace(/"(\d{4})"\[Date - Publication\]:"(\d{4}\/\d{2}\/\d{2})"\[Date - Publication\]/g,
    '"$1"[Date - Publication] : "$2"[Date - Publication]');

  query = collapseSameOperatorGroups(query);
  query = removeExtraParens(query);

  // Add newlines before AND/NOT (not within parentheses) if preserveNewlines is true
  if (options.preserveNewlines !== false) {
    query = query.replace(/\s+(AND|NOT)\s+/g, (match, p1) => `\n${p1} `);
  }

  return query;
}

/**
 * Highlight Boolean operators in a query string for HTML display
 */
export function highlightQuery(text: string, options: QueryFormatterOptions = {}): string {
  if (!text) return '';
  
  let htmlText = text;
  
  // Replace newlines with <br> tags to preserve line breaks in HTML
  if (options.preserveNewlines !== false) {
    htmlText = htmlText.replace(/\n/g, '<br>');
  }
  
  // Apply syntax highlighting if enabled
  if (options.highlightOperators !== false) {
    htmlText = htmlText.replace(/\b(AND|OR|NOT)\b/g, (match) => {
      if (match === "AND") return '<span class="text-green-600 font-bold">AND</span>';
      if (match === "OR") return '<span class="text-blue-600 font-bold">OR</span>';
      if (match === "NOT") return '<span class="text-red-600 font-bold">NOT</span>';
      return match;
    });
  }
  
  return htmlText;
}

/**
 * Generate PubMed search URL from query
 */
export function generatePubMedUrl(query: string): string {
  const baseUrl = 'https://pubmed.ncbi.nlm.nih.gov/';
  const encodedQuery = encodeURIComponent(query.trim());
  return `${baseUrl}?term=${encodedQuery}`;
}

/**
 * Validate query syntax
 */
export function validateQuery(query: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for balanced parentheses
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
  
  // Check for empty parentheses
  if (query.includes('()')) {
    errors.push('Empty parentheses found');
  }
  
  // Check for invalid operator usage
  if (/\b(AND|OR|NOT)\s+(AND|OR|NOT)\b/.test(query)) {
    errors.push('Consecutive operators found');
  }
  
  // Check for operators at the beginning or end
  if (/^(AND|OR|NOT)\b/.test(query.trim())) {
    errors.push('Query cannot start with an operator');
  }
  if (/\b(AND|OR|NOT)$/.test(query.trim())) {
    errors.push('Query cannot end with an operator');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Insert text at cursor position in a textarea
 */
export function insertAtCursor(
  element: HTMLTextAreaElement,
  textToInsert: string,
  setCursorCallback?: (pos: number) => void
): void {
  if (!element) return;
  
  const start = element.selectionStart;
  const end = element.selectionEnd;
  const currentValue = element.value;
  
  const newText = currentValue.substring(0, start) + textToInsert + currentValue.substring(end);
  
  // Update the textarea value
  element.value = newText;
  
  // Set cursor position after inserted text
  const newCursorPosition = start + textToInsert.length;
  element.selectionStart = newCursorPosition;
  element.selectionEnd = newCursorPosition;
  element.focus();
  
  // Call the callback to update state
  if (setCursorCallback) {
    setCursorCallback(newCursorPosition);
  }
}

/**
 * Wrap selected text in parentheses
 */
export function wrapInParentheses(
  element: HTMLTextAreaElement,
  setCursorCallback?: (pos: number) => void
): void {
  if (!element) return;
  
  const start = element.selectionStart;
  const end = element.selectionEnd;
  const currentValue = element.value;
  const selectedText = currentValue.substring(start, end);
  
  let newText: string;
  let newCursorPosition: number;
  
  if (selectedText) {
    // Text is selected, wrap it in parentheses
    newText = currentValue.substring(0, start) + '(' + selectedText + ')' + currentValue.substring(end);
    newCursorPosition = end + 2;
  } else {
    // No selection, just insert parentheses
    newText = currentValue.substring(0, start) + '()' + currentValue.substring(start);
    newCursorPosition = start + 1;
  }
  
  // Update the textarea value
  element.value = newText;
  
  // Position cursor appropriately
  element.selectionStart = newCursorPosition;
  element.selectionEnd = newCursorPosition;
  element.focus();
  
  // Call the callback to update state
  if (setCursorCallback) {
    setCursorCallback(newCursorPosition);
  }
}