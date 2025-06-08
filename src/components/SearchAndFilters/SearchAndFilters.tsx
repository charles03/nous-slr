// components/SearchAndFilters/SearchAndFilters.tsx

import React from 'react';
import { Search, List, Grid, Filter, ChevronDown } from 'lucide-react';
import { ViewMode, SortBy, SortOrder } from '../../types/project';
import './SearchAndFilters.css';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortBy;
  onSortByChange: (sortBy: SortBy) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}) => {
  return (
    <div className="search-filters">
      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-input-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search projects by name, category, or creator..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      {/* View Controls and Sorting */}
      <div className="controls">
        <div className="view-toggle">
          <button 
            className={`view-btn ${viewMode === 'list' ? 'view-btn--active' : ''}`}
            onClick={() => onViewModeChange('list')}
            title="List View"
          >
            <List size={18} />
          </button>
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'view-btn--active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Grid View"
          >
            <Grid size={18} />
          </button>
        </div>
        
        <div className="sort-controls">
          <div className="sort-container">
            <Filter size={14} className="sort-icon" />
            <span className="sort-label">Sort by:</span>
            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as SortBy)}
            >
              <option value="name">Name</option>
              <option value="creationDate">Created</option>
              <option value="modifiedDate">Modified</option>
              <option value="creator">Creator</option>
              <option value="diseaseCategory">Category</option>
            </select>
            <button 
              className="sort-order-btn" 
              onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <ChevronDown 
                size={14} 
                className={`sort-arrow ${sortOrder === 'asc' ? 'sort-arrow--asc' : ''}`} 
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;