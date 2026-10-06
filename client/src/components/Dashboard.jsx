import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, PlusCircle, Inbox } from 'lucide-react';
import StatsCards from './StatsCards';
import FilterBar from './FilterBar';
import ReportCard from './ReportCard';
import ReportTable from './ReportTable';
import MapView from './MapView';
import ReportModal from './ReportModal';
import { getReports, getStats, resetSeedData } from '../services/api';

export default function Dashboard({ onNavigateToReport }) {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Filters State
  const [filters, setFilters] = useState({
    issueType: 'All',
    severity: 'All',
    status: 'All',
    search: '',
    sortBy: 'newest'
  });

  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [selectedReport, setSelectedReport] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Load data
  const loadDashboardData = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const [reportsData, statsData] = await Promise.all([
        getReports(filters),
        getStats()
      ]);
      setReports(reportsData.reports || []);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setErrorMessage(err.message || 'Failed to load dashboard data. Please verify the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleStatusUpdated = (updatedReport) => {
    setReports(prev => prev.map(r => r.id === updatedReport.id ? updatedReport : r));
    setSelectedReport(updatedReport);
    // Reload stats to reflect new status count
    getStats().then(setStats).catch(() => {});
  };

  const handleResetSeed = async () => {
    try {
      setIsLoading(true);
      await resetSeedData();
      await loadDashboardData();
      setToastMessage('Seed demo reports restored successfully!');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      setErrorMessage('Failed to reset seed data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      {/* Title & Action Row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            Municipal Operations Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Live triage feed of public infrastructure defects reported across city wards.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={loadDashboardData}
            disabled={isLoading}
            className="btn btn-secondary"
            style={{ padding: '0.65rem 1rem' }}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>

          <button
            onClick={onNavigateToReport}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.25rem' }}
          >
            <PlusCircle size={18} />
            Report Issue
          </button>
        </div>
      </div>

      {toastMessage && (
        <div style={{
          padding: '0.75rem 1rem',
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '8px',
          color: '#047857',
          fontWeight: 600,
          fontSize: '0.875rem',
          marginBottom: '1.5rem'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Top 4 Required Statistics Cards */}
      <StatsCards stats={stats} />

      {/* Filters and Controls Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetSeed={handleResetSeed}
        totalResults={reports.length}
      />

      {/* Error Notice */}
      {errorMessage && (
        <div style={{
          padding: '1.25rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          color: '#b91c1c',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <AlertCircle size={22} />
          <div>
            <div style={{ fontWeight: 700 }}>Connection Error</div>
            <div style={{ fontSize: '0.875rem' }}>{errorMessage}</div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <RefreshCw size={36} color="#0284c7" className="animate-spin" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: '#64748b', fontWeight: 600 }}>Loading infrastructure reports...</p>
        </div>
      ) : reports.length === 0 ? (
        /* Empty State */
        <div className="card" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            color: '#94a3b8'
          }}>
            <Inbox size={30} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            No Matching Reports Found
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            Try adjusting your search query, issue type, or severity filter, or reset to sample demo data.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setFilters({ issueType: 'All', severity: 'All', status: 'All', search: '', sortBy: 'newest' })}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
            <button onClick={handleResetSeed} className="btn btn-primary">
              Restore Sample Reports
            </button>
          </div>
        </div>
      ) : (
        /* Reports Results Grid or Table */
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
            <span>Showing <strong>{reports.length}</strong> reports</span>
          </div>

          {viewMode === 'map' ? (
            <MapView
              reports={reports}
              onSelectReport={(r) => setSelectedReport(r)}
            />
          ) : viewMode === 'table' ? (
            <ReportTable
              reports={reports}
              onSelectReport={(r) => setSelectedReport(r)}
            />
          ) : (
            <div className="grid-cols-auto">
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onSelectReport={(r) => setSelectedReport(r)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Report Details Modal */}
      {selectedReport && (
        <ReportModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
}
