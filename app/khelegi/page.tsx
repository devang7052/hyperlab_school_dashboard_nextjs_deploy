'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSession } from '../hooks/useSession';
import { useDashboardConfig } from '../lib/DashboardConfigContext';
import { useFilteredSurveyData } from '../hooks/khelegi/khelegiTable/useFilteredSurveyData';
import LoadingSpinner from '../components/common/loadingSpinner';
import KhelegiFilterSidebar from './components/KhelegiFilterSidebar';
import AnalyticsView from './components/AnalyticsView';
import { TabNavigation, KhelegiTab } from './components/TabNavigation';
import SurveyResponsesTable from './components/SurveyResponsesTable';

export default function KhelegiPage() {
  const { user, isLoading: sessionLoading, isAuthenticated, logout, redirectToLogin } = useSession();
  const { config } = useDashboardConfig();
  const [activeTab, setActiveTab] = useState<KhelegiTab>('overview');
  
  // Fetch survey data
  const {
    surveys,
    isLoading: surveysLoading,
    error: surveysError,
    filterState,
    setFilterValue,
    clearFilters,
    loadMoreSurveys,
    hasMoreSurveys,
    hasActiveFilters,
    handleSort,
    getSortIconForField,
    isSorting,
    currentPage,
    totalItems,
  } = useFilteredSurveyData({});

  // Show loading while session is being checked or config is loading
  if (sessionLoading || !config || surveysLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen"
           style={{ backgroundColor: config?.theme?.background || '#f9fafb' }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!sessionLoading && !isAuthenticated) {
    redirectToLogin();
  }

  // Don't render anything if not authenticated (redirect is in progress)
  if (!isAuthenticated || !user) {
    return null;
  }

  // Render the main dashboard with exact same layout as home page
  return (
    <div className="khelegi-theme h-screen bg-[var(--background)] flex flex-col">
      {/* Header - Fixed height */}
      <header className="flex-shrink-0 w-full bg-[var(--foreground)] py-5 px-8 flex justify-between items-center z-50">
        <Image src="/icons/hyperlab_logo.svg" alt="Hyperlab Logo" width={32} height={32} className="h-8" />
        <button 
          onClick={logout}
          className="px-4 py-2 bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)] text-sm"
        >
          Logout
        </button>
      </header>

      {/* Content Area - Takes remaining space */}
      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar - Fixed width, full height of available space */}
        <KhelegiFilterSidebar 
          filterState={filterState}
          setFilterValue={setFilterValue}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        {/* Main Content Area - Scrollable within allocated space */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <div className="p-9">
            {/* Show loading overlay for right content when loading */}
            {surveysLoading && (
              <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner />
              </div>
            )}

            {/* Show error state for survey data */}
            {surveysError && !surveysLoading && (
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="text-[var(--error-500)] mb-4">
                  <h2 className="text-xl font-semibold">Error Loading Survey Data</h2>
                  <p className="text-sm">{surveysError?.message || 'Failed to load survey data'}</p>
                  <p className="text-sm">Please try again later or contact support.</p>
                </div>
              </div>
            )}

            {/* Main content - only show when data is loaded and no errors */}
            {!surveysLoading && !surveysError && surveys && (
              <>
                {/* Survey Header */}
                <div className="mb-6">
                  <h1 className="text-4xl font-[MADE_Outer_Sans_Regular] text-[var(--neutral-100)] uppercase mb-2">
                    Khelegi Survey Dashboard
                  </h1>
                </div>

                {/* Tabs */}
                <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Tab Content */}
                {activeTab === 'analytics' && (
                  <div className="mt-2">
                    <AnalyticsView surveys={surveys} isLoading={false} />
                  </div>
                )}

                {/* Overview Content */}
                {activeTab === 'overview' && (
                  <>
                    {/* Survey Responses Table Section */}
                    <div className="mt-8 w-full overflow-hidden">
                      <SurveyResponsesTable
                        surveys={surveys}
                        loadMoreSurveys={loadMoreSurveys}
                        hasMoreSurveys={hasMoreSurveys}
                        filterState={filterState}
                        setFilterValue={setFilterValue}
                        isLoading={false}
                        error={null}
                        isFetchingMore={false}
                        handleSort={handleSort}
                        getSortIconForField={getSortIconForField}
                        isSorting={isSorting}
                        currentPage={currentPage}
                        totalItems={totalItems}
                      />
                    </div>
                  </>
                )}
                
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
