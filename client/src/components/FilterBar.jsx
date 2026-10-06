import React from 'react';
import { Search, Filter, LayoutGrid, List, RotateCcw, ArrowUpDown, MapPin } from 'lucide-react';

export default function FilterBar({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  onResetSeed,
  totalResults
}) {
  return (
    <div className="card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by location, keyword, or report ID..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="form-input"
            style={{ paddingLeft: '38px', fontSize: '0.9rem' }}
          />
        </div>

        {/* View Toggle & Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            padding: '3px',
            borderRadius: '8px'
          }}>
            <button
              onClick={() => onViewModeChange('cards')}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                backgroundColor: viewMode === 'cards' ? '#ffffff' : 'transparent',
                color: viewMode === 'cards' ? '#0284c7' : '#64748b',
                boxShadow: viewMode === 'cards' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              <LayoutGrid size={15} /> Cards
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                backgroundColor: viewMode === 'table' ? '#ffffff' : 'transparent',
                color: viewMode === 'table' ? '#0284c7' : '#64748b',
                boxShadow: viewMode === 'table' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              <List size={15} /> Table
            </button>
            <button
              onClick={() => onViewModeChange('map')}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                backgroundColor: viewMode === 'map' ? '#ffffff' : 'transparent',
                color: viewMode === 'map' ? '#0284c7' : '#64748b',
                boxShadow: viewMode === 'map' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              <MapPin size={15} /> Map
            </button>
          </div>

          <button
            onClick={onResetSeed}
            title="Reset to default hackathon seed reports"
            className="btn btn-secondary"
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}
          >
            <RotateCcw size={14} /> Reset Data
          </button>
        </div>
      </div>

      {/* Filter Dropdowns Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.85rem',
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #f1f5f9'
      }}>
        {/* Issue Type */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.3rem' }}>
            Issue Type
          </label>
          <select
            value={filters.issueType}
            onChange={(e) => onFilterChange('issueType', e.target.value)}
            className="form-select"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
          >
            <option value="All">All Issue Types</option>
            <option value="Pothole">Pothole</option>
            <option value="Damaged Road">Damaged Road</option>
            <option value="Broken Streetlight">Broken Streetlight</option>
            <option value="Overflowing Drain">Overflowing Drain</option>
            <option value="Other Infrastructure Issue">Other Infrastructure Issue</option>
          </select>
        </div>

        {/* Severity */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.3rem' }}>
            Severity
          </label>
          <select
            value={filters.severity}
            onChange={(e) => onFilterChange('severity', e.target.value)}
            className="form-select"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.3rem' }}>
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="form-select"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.3rem' }}>
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="form-select"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="severity">Highest Severity</option>
            <option value="confidence">Highest Confidence</option>
          </select>
        </div>
      </div>
    </div>
  );
}
