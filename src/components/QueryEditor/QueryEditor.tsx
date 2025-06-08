// components/QueryEditor/QueryEditor.tsx

import React, { useState, useRef, useCallback } from 'react';
import { FileText, Edit3, Wand2, Play, Plus, FolderPlus } from 'lucide-react';
import { QueryBuilderState, QUERY_FIELD_OPTIONS } from '../../types/query';
import { 
  cleanQuery, 
  highlightQuery, 
  generatePubMedUrl, 
  insertAtCursor, 
  wrapInParentheses,
  validateQuery 
} from '../../utils/queryFormatter';
import './QueryEditor.css';

interface QueryEditorProps {
  queryText: string;
  onQueryTextChange: (text: string) => void;
  formattedQuery: string;
  onFormattedQueryChange: (text: string) => void;
  className?: string;
}

const QueryEditor: React.FC<QueryEditorProps> = ({
  queryText,
  onQueryTextChange,
  formattedQuery,
  onFormattedQueryChange,
  className = ''
}) => {
  const [builderState, setBuilderState] = useState<QueryBuilderState>({
    queryText: queryText,
    selectedField: 'All Fields',
    newTerm: '',
    isEditMode: false,
    showBuilder: false,
    cursorPosition: { start: 0, end: 0 }
  });
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Save cursor position
  const saveCursorPosition = useCallback(() => {
    const editor = textareaRef.current;
    if (editor) {
      setBuilderState(prev => ({
        ...prev,
        cursorPosition: {
          start: editor.selectionStart,
          end: editor.selectionEnd
        }
      }));
    }
  }, []);

  // Handle query text changes
  const handleQueryTextChange = useCallback((newText: string) => {
    setBuilderState(prev => ({ ...prev, queryText: newText }));
    onQueryTextChange(newText);
  }, [onQueryTextChange]);

  // Format the query
  const handleFormatQuery = useCallback(() => {
    const editor = textareaRef.current;
    const currentText = editor ? editor.value : builderState.queryText;
    
    const formatted = cleanQuery(currentText);
    onFormattedQueryChange(formatted);
    handleQueryTextChange(formatted);
    
    // If in edit mode, update the textarea with formatted text
    if (builderState.isEditMode && editor) {
      editor.value = formatted;
      editor.focus();
      saveCursorPosition();
    }
  }, [builderState.queryText, builderState.isEditMode, onFormattedQueryChange, handleQueryTextChange, saveCursorPosition]);

  // Toggle edit mode
  const handleToggleEditMode = useCallback(() => {
    if (builderState.isEditMode) {
      // When exiting edit mode, update formattedQuery with current textarea content
      const editor = textareaRef.current;
      const currentText = editor ? editor.value : builderState.queryText;
      handleQueryTextChange(currentText);
      // Format the query when exiting edit mode for better display
      const formatted = cleanQuery(currentText);
      onFormattedQueryChange(formatted);
    } else {
      // When entering edit mode, use the current queryText
      const queryToEdit = builderState.queryText || formattedQuery;
      handleQueryTextChange(queryToEdit);
    }
    
    setBuilderState(prev => ({ ...prev, isEditMode: !prev.isEditMode }));
  }, [builderState.isEditMode, builderState.queryText, formattedQuery, handleQueryTextChange, onFormattedQueryChange]);

  // Add operator with term
  const addOperatorWithTerm = useCallback((operator: 'AND' | 'OR' | 'NOT') => {
    if (!builderState.newTerm.trim()) return;
    
    let termWithField = builderState.newTerm.trim();
    if (builderState.selectedField !== 'All Fields') {
      termWithField = `"${termWithField}"[${builderState.selectedField}]`;
    }
    
    const textToInsert = ` ${operator} ${termWithField}`;
    const editor = textareaRef.current;
    
    if (editor) {
      insertAtCursor(editor, textToInsert);
      handleQueryTextChange(editor.value);
    }
    
    setBuilderState(prev => ({ ...prev, newTerm: '' }));
  }, [builderState.newTerm, builderState.selectedField, handleQueryTextChange]);

  // Add nested parentheses
  const addNestedParentheses = useCallback(() => {
    const editor = textareaRef.current;
    if (editor) {
      wrapInParentheses(editor);
      handleQueryTextChange(editor.value);
      saveCursorPosition();
    }
  }, [handleQueryTextChange, saveCursorPosition]);

  // Validate current query
  const validation = validateQuery(builderState.queryText);

  return (
    <div className={`query-editor ${className}`}>
      {/* Main Query Display/Editor Section */}
      <div className="query-editor__main">
        <div className="query-editor__header">
          <h4 className="query-editor__title">
            <FileText size={18} className="query-editor__title-icon" />
            {builderState.isEditMode ? 'Edit Query' : 'Current Query'}
          </h4>
          {!builderState.isEditMode && (
            <div className="query-editor__char-count">
              {(formattedQuery || builderState.queryText).length} characters
            </div>
          )}
        </div>
        
        {/* Combined Query Display/Editor Container */}
        <div className="query-editor__container">
          {builderState.isEditMode ? (
            /* Edit Mode - Standard Textarea */
            <textarea
              ref={textareaRef}
              value={builderState.queryText}
              onChange={(e) => {
                handleQueryTextChange(e.target.value);
                saveCursorPosition();
              }}
              onKeyUp={saveCursorPosition}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setTimeout(saveCursorPosition, 0);
                }
              }}
              onClick={saveCursorPosition}
              onFocus={saveCursorPosition}
              onSelect={saveCursorPosition}
              placeholder="Edit your search query here..."
              className="query-editor__textarea"
            />
          ) : (
            /* Display Mode - Formatted Query */
            <div className="query-editor__display">
              <div 
                className="query-editor__formatted-text"
                dangerouslySetInnerHTML={{ 
                  __html: highlightQuery(formattedQuery || builderState.queryText) || 
                         '<span class="query-editor__placeholder">Your formatted query will appear here...</span>' 
                }}
              />
            </div>
          )}
        </div>
        
        {/* Validation Messages */}
        {!validation.isValid && (
          <div className="query-editor__validation">
            {validation.errors.map((error, index) => (
              <div key={index} className="query-editor__error">
                {error}
              </div>
            ))}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="query-editor__actions">
          <div className="query-editor__actions-left">
            <button 
              onClick={handleToggleEditMode}
              className={`query-editor__btn ${builderState.isEditMode 
                ? 'query-editor__btn--primary' 
                : 'query-editor__btn--secondary'
              }`}
            >
              <Edit3 size={16} className="query-editor__btn-icon" />
              {builderState.isEditMode ? 'Exit Edit' : 'Edit Query'}
            </button>
            
            {builderState.isEditMode && (
              <button 
                onClick={handleFormatQuery}
                className="query-editor__btn query-editor__btn--accent"
              >
                <Wand2 size={16} className="query-editor__btn-icon" />
                Format Query
              </button>
            )}
          </div>
          
          <a 
            href={generatePubMedUrl(builderState.queryText)}
            target="_blank"
            rel="noopener noreferrer"
            className="query-editor__btn query-editor__btn--success"
          >
            <Play size={16} className="query-editor__btn-icon" />
            Run Query
          </a>
        </div>
      </div>

      {/* Add New Search Term Section - Only shown when in edit mode */}
      {builderState.isEditMode && (
        <div className="query-editor__builder">
          <div className="query-editor__builder-content">
            <h5 className="query-editor__builder-title">
              <Plus size={16} className="query-editor__builder-title-icon" />
              Add New Search Term
            </h5>
            
            <div className="query-editor__builder-form">
              <div className="query-editor__form-row">
                <div className="query-editor__form-group">
                  <label className="query-editor__label">Field Type</label>
                  <select
                    value={builderState.selectedField}
                    onChange={(e) => setBuilderState(prev => ({ ...prev, selectedField: e.target.value }))}
                    className="query-editor__select"
                  >
                    {QUERY_FIELD_OPTIONS.map(option => (
                      <option key={option.name} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="query-editor__form-group query-editor__form-group--flex">
                  <label className="query-editor__label">Search Term</label>
                  <input
                    type="text"
                    value={builderState.newTerm}
                    onChange={(e) => setBuilderState(prev => ({ ...prev, newTerm: e.target.value }))}
                    placeholder="Enter search term..."
                    className="query-editor__input"
                    onKeyDown={(e) => e.key === 'Enter' && addOperatorWithTerm('AND')}
                  />
                </div>
              </div>

              <div className="query-editor__button-groups">
                <div className="query-editor__button-group">
                  <button
                    onClick={() => addOperatorWithTerm('AND')}
                    disabled={!builderState.newTerm.trim()}
                    className="query-editor__operator-btn query-editor__operator-btn--and"
                  >
                    <Plus size={14} className="query-editor__btn-icon" />
                    AND
                  </button>
                  
                  <button
                    onClick={() => addOperatorWithTerm('OR')}
                    disabled={!builderState.newTerm.trim()}
                    className="query-editor__operator-btn query-editor__operator-btn--or"
                  >
                    <Plus size={14} className="query-editor__btn-icon" />
                    OR
                  </button>
                  
                  <button
                    onClick={() => addOperatorWithTerm('NOT')}
                    disabled={!builderState.newTerm.trim()}
                    className="query-editor__operator-btn query-editor__operator-btn--not"
                  >
                    <Plus size={14} className="query-editor__btn-icon" />
                    NOT
                  </button>
                </div>
                
                <div className="query-editor__button-group query-editor__button-group--utility">
                  <button
                    onClick={addNestedParentheses}
                    className="query-editor__operator-btn query-editor__operator-btn--nest"
                  >
                    <FolderPlus size={14} className="query-editor__btn-icon" />
                    Nest ( )
                  </button>
                </div>
              </div>

              <div className="query-editor__instructions">
                <p className="query-editor__instructions-title">Quick Instructions:</p>
                <ul className="query-editor__instructions-list">
                  <li>Click in the query editor above to position your cursor</li>
                  <li>Enter a search term and click an operator button to add it at cursor position</li>
                  <li>Select text in the editor and click "Nest ( )" to wrap in parentheses</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryEditor;