'use client';

import { useState, useEffect } from 'react';
import { useSession } from '../hooks/useSession';
import { useHomeData } from '../hooks/home/useHomeData';
import { useFilteredData } from '../hooks/home/homeTable/useFilteredData';
import { useDashboardConfig } from '../lib/DashboardConfigContext';
import LoadingSpinner from '../components/common/loadingSpinner';
import LeftSidebar from './components/LeftSidebar';
import StudentStatisticsCards from './components/StudentStatisticsCards';
import TestStatisticsChart from './components/testOverview';
import StudentTable from './components/studentTable';


export default function HomePage() {
  const { user, isLoading: sessionLoading, isAuthenticated, logout, redirectToLogin } = useSession();
  const { config } = useDashboardConfig();
  
  // State to track currently selected school email (defaults to user's email)
  const [selectedSchoolEmail, setSelectedSchoolEmail] = useState<string>(user?.email || '');
  
  // Fetch home data for the currently selected school (for main content)
  const { 
    data: selectedSchoolHomeData, 
    isLoading: selectedSchoolDataLoading, 
    error: selectedSchoolError, 
  } = useHomeData(selectedSchoolEmail);

  // Fetch home data for the current user's primary school (for the sidebar)
  const { 
    data: currentUserHomeData, 
    isLoading: currentUserDataLoading, 
  } = useHomeData(user?.email);

  // Get all available filters from config
  const allFilters = config?.filters?.filters || [];

  // Use unified hook that handles both data fetching and filtering
  const {
    students: tableStudents,
    isLoading: tableDataLoading,
    error: tableDataError,
    selectedStd,
    setSelectedStd,
    filterState,
    setFilterValue,
    toggleMultiFilterValue,
    clearFilters,
    loadMoreUIStudents,
    hasMoreUIStudents,
    hasActiveFilters,
    handleSort,
    getSortIconForField,
    updatePaymentStatus,
    isUpdatingPayment,
  } = useFilteredData({ 
    instituteId: selectedSchoolHomeData?.studentStats?.instituteId
  });

  // Ensure selectedSchoolEmail is set to user.email once user is loaded
  useEffect(() => {
    if (user?.email && !selectedSchoolEmail) {
      setSelectedSchoolEmail(user.email);
    }
  }, [user, selectedSchoolEmail]);

  const handleSchoolSelect = (schoolEmail: string) => {
    setSelectedSchoolEmail(schoolEmail);
    // Reset selected class when switching schools to avoid loading specific class data
    setSelectedStd('');
  };

  const handleHomeClick = () => {
    setSelectedSchoolEmail(user?.email || '');
    // Reset selected class when going back to home school
    setSelectedStd('');
  };

  // Show loading while session is being checked or config is loading or initial user data is loading
  if (sessionLoading || !config || currentUserDataLoading) {
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

  // Render the main dashboard with new layout
  return (
    <div className="h-screen bg-[var(--background)] flex flex-col">
      {/* Header - Fixed height */}
      <header className="flex-shrink-0 w-full bg-[var(--foreground)] py-5 px-8 flex justify-between items-center z-50">
        <img src="/icons/hyperlab_logo.svg" alt="Hyperlab Logo" className="h-8" />
        <button 
          onClick={logout}
          className="px-4 py-2 bg-[var(--neutral-20)] font-['MADE_Outer_Sans_Thin'] text-[var(--neutral-700)] cursor-pointer  hover:bg-[var(--background-hover)] text-md"
        >
          Logout
        </button>
      </header>

      {/* Content Area - Takes remaining space */}
      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar - Fixed width, full height of available space */}
        <LeftSidebar 
          connectedSchools={currentUserHomeData?.connectedSchools || []} 
          config={config} 
          onSchoolSelect={handleSchoolSelect}
          onHomeClick={handleHomeClick}
          selectedSchoolEmail={selectedSchoolEmail}
          filterState={filterState}
          toggleMultiFilterValue={toggleMultiFilterValue}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={() => clearFilters()}
          allFilters={allFilters}
        />

        {/* Main Content Area - Scrollable within allocated space */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <div className="p-9">
            {/* Show loading overlay for right content when switching schools */}
            {selectedSchoolDataLoading && (
              <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner />
              </div>
            )}

            {/* Show error state for selected school data */}
            {selectedSchoolError && !selectedSchoolDataLoading && (
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="text-[var(--error-500)] mb-4">
                  <h2 className="text-xl font-semibold">Error Loading Dashboard</h2>
                  <p className="text-sm">{selectedSchoolError?.message || 'Failed to load dashboard data'}</p>
                  <p className="text-sm">Please try again later or contact support.</p>
                </div>
              </div>
            )}

            {/* Main content - only show when data is loaded and no errors */}
            {!selectedSchoolDataLoading && !selectedSchoolError && selectedSchoolHomeData && (
              <>
                {/* School Header */}
                <div className="mb-6">
                  <h1 className="text-4xl font-[MADE_Outer_Sans_Regular] text-[var(--neutral-100)] uppercase mb-2">
                    {selectedSchoolHomeData.studentStats.schoolName}
                  </h1>
                </div>

                {/* Student Statistics Cards */}
                <StudentStatisticsCards studentStats={selectedSchoolHomeData.studentStats} config={config} />

                {/* Test Statistics Section */}
                <TestStatisticsChart testGradstats={selectedSchoolHomeData.testGradstats} config={config} />

                {/* Class Filter and Student Table Section */}
                <div className="mt-8 w-full overflow-hidden">
                  <StudentTable
                    students={tableStudents}
                    loadMoreUIStudents={loadMoreUIStudents}
                    hasMoreUIStudents={hasMoreUIStudents}
                    selectedStd={selectedStd}
                    setSelectedStd={setSelectedStd}
                    filterState={filterState}
                    setFilterValue={setFilterValue}
                    allFilters={allFilters}
                    tableDataLoading={tableDataLoading}
                    tableDataError={tableDataError}
                    // Sorting props
                    handleSort={handleSort}
                    getSortIconForField={getSortIconForField}
                    config={config}
                    // Payment status update props
                    updatePaymentStatus={updatePaymentStatus}
                    isUpdatingPayment={isUpdatingPayment}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
