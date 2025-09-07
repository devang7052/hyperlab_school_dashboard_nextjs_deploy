'use client';

import React, { useState } from 'react';
import { StudentWithTestData } from '../../service/homeService';
import { PaymentStatus, Gender } from '../../models/schoolStudent';
import LoadingSpinner from '../../components/common/loadingSpinner';
import { FilterState, FilterType } from '@/app/utils/filterHelpers';
import { getFilterOptionsByKey, hasFilterKey } from '@/app/utils/filterHelpers';
import { DashboardConfig, FilterOption } from '@/app/utils/dashboardConfig';
import { SortField } from '@/app/utils/sortHelpers';
import SortableTableHeader from '@/app/components/common/SortableTableHeader';
import { calculateAge, formatClassSection, formatScore, formatScoreOutOf10, getSortFieldForColumn } from '@/app/utils/formatters';
import CustomSelect from '../../components/common/CustomSelect';
import PaymentStatusConfirmDialog from '../../components/common/PaymentStatusConfirmDialog';

interface StudentTableProps {
  students: StudentWithTestData[];
  loadMoreUIStudents: () => void;
  hasMoreUIStudents: boolean;
  selectedStd: string;
  setSelectedStd: (std: string) => void;
  filterState: FilterState;
  setFilterValue: (key: string, value: string) => void;
  allFilters: FilterOption[];
  tableDataLoading: boolean;
  tableDataError: Error | null;
  // Sorting props
  handleSort: (field: SortField) => void;
  getSortIconForField: (field: SortField) => string;
  config: DashboardConfig;
  // Payment status update props
  updatePaymentStatus: (studentId: string, paymentStatus: PaymentStatus) => Promise<void>;
  isUpdatingPayment: boolean;
}

const StudentTable: React.FC<StudentTableProps> = ({ 
  students, 
  loadMoreUIStudents, 
  hasMoreUIStudents,
  selectedStd,
  setSelectedStd,
  filterState,
  allFilters,
  setFilterValue,
  tableDataLoading,
  tableDataError,
  // Sorting props
  handleSort,
  getSortIconForField,
  config,
  // Payment status update props
  updatePaymentStatus,
  isUpdatingPayment,
}) => {
  // State for custom confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    student: StudentWithTestData | null;
  }>({
    isOpen: false,
    student: null,
  });

  // Define common classnames for table headers
  const baseHeaderClassnames = "px-4 py-4 text-center text-md font-['MADE_Outer_Sans_Light'] text-[var(--neutral-20)] min-w-[150px]";

  // Define common classnames for table data cells
  const baseTableCellClassnames = "px-4 py-5 text-md text-[var(--neutral-300)] font-['MADE_Outer_Sans_Light']";

  // Get enabled columns from config
  const enabledColumns = config.tableConfig.columns.filter(col => col.enabled);

  // Helper function to get column config by key
  const getColumnConfig = (key: string) => {
    return config.tableConfig.columns.find(col => col.key === key);
  };

  // Handle payment status click with custom dialog
  const handlePaymentStatusClick = (student: StudentWithTestData) => {
    if (isUpdatingPayment || !student.id) return;
    
    setConfirmDialog({
      isOpen: true,
      student: student,
    });
  };

  // Handle confirmation dialog confirm
  const handleConfirmPaymentStatusUpdate = async () => {
    if (!confirmDialog.student?.id) return;

    const student = confirmDialog.student;
    const studentId = student.id;
    if (!studentId) return;

    const currentStatus = student.paymentStatus;
    const newStatus = currentStatus === PaymentStatus.PAID ? PaymentStatus.UNPAID : PaymentStatus.PAID;
    
    try {
      await updatePaymentStatus(studentId, newStatus);
      setConfirmDialog({ isOpen: false, student: null });
    } catch (error) {
      console.error('Failed to update payment status:', error);
      alert('Failed to update payment status. Please try again.');
    }
  };

  // Handle confirmation dialog cancel
  const handleCancelPaymentStatusUpdate = () => {
    setConfirmDialog({ isOpen: false, student: null });
  };

  // Helper function to render payment status
  const renderPaymentStatus = (status: PaymentStatus, student: StudentWithTestData) => {
    const baseClasses = "flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity";
    
    switch (status) {
      case PaymentStatus.PAID:
        return (
          <div className={baseClasses} onClick={() => handlePaymentStatusClick(student)}>
            <div className="w-6 h-6 bg-[var(--success-700)] rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-[var(--background)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        );
      case PaymentStatus.UNPAID:
        return (
          <div className={baseClasses} onClick={() => handlePaymentStatusClick(student)}>
            <div className="w-6 h-6 bg-[var(--error-500)] rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-[var(--background)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        );

      default:
        return (
          <div className={baseClasses} onClick={() => handlePaymentStatusClick(student)}>
            <div className="w-6 h-6 border border-[var(--neutral-400)] rounded flex items-center justify-center">
              {/* Empty box */}
            </div>
          </div>
        );
    }
  };

  // Helper function to render cell content based on column key
  const renderCellContent = (student: StudentWithTestData, columnKey: string) => {
    switch (columnKey) {
      case 'rowNumber':
        return students.indexOf(student) + 1;
      case 'name':
        const reportUrl = `https://report.hyperlab.life/?uuid=${student.qrCode}`;
        return (
          <div 
            className="cursor-pointer whitespace-normal " 
            title={student.name || '-'}
            onClick={() => window.open(reportUrl, '_blank')} // '_blank' Open report in new tab
          >
            {student.name || '-'}
          </div>
        );
      case 'paymentStatus':
        return renderPaymentStatus(student.paymentStatus, student);
      case 'gender':
        return student.gender === Gender.MALE ? 'Male' : student.gender === Gender.FEMALE ? 'Female' : '-';
      case 'age':
        return student.dateOfBirth ? calculateAge(student.dateOfBirth) : '-';
      case 'classSection':
        return student.std && student.section ? formatClassSection(student.std, student.section) : '-';
      case 'bmi':
        return student.latestTest?.score?.bmi ? formatScore(student.latestTest.score.bmi) : '-';
      case 'overallScore':
        return student.latestTest?.score.overallScore ? student.latestTest.score.overallScore : '-';
      case 'pushup':
        return student.latestTest?.score?.pushup ? formatScore(student.latestTest.score.pushup) : '-';
      case 'plank':
        return student.latestTest?.score?.plank ? formatScore(student.latestTest.score.plank) : '-';
      case 'memory':
        return formatScoreOutOf10(student.latestTest?.score?.chimpTest);
      case 'concentration':
        return formatScoreOutOf10(student.latestTest?.score?.concentration);
      case 'speed':
        return student.latestTest?.score?.fatigue ? formatScore(student.latestTest.score.fatigue) : '-';
      case 'coreBalance':
        return formatScoreOutOf10(student.latestTest?.score?.coreBalance);
      case 'bodyControl':
        return formatScoreOutOf10(student.latestTest?.score?.bodyControl);
      default:
        return '-';
    }
  };

  return (
    <>
      <div className="bg-[var(--background)] rounded-lg w-full">
        {/* Table Header and Filters */}
        <div className="py-4 flex justify-between items-center">
          <h3 className="text-2xl font-['MADE_Outer_Sans_Light'] text-[var(--neutral-500)]">
            {config.terminology.tableTitle}
          </h3>
          {/* Dynamic Filters based on config */}
          <div className="flex items-center gap-4 ">
            {/* Overview1 Filter (std/class/rank/level) - Only show if options exist in the particular config */}
            {hasFilterKey(allFilters, 'overview1') && (
              <CustomSelect
                options={getFilterOptionsByKey(allFilters, 'overview1')}
                value={selectedStd}
                onChange={setSelectedStd}
                placeholder={config.terminology.tablePrimaryFilter}
                className="w-32"
              />
            )}

            {/* Overview2 Filter (section/unit/squadron) - Only show if options exist */}
            {hasFilterKey(allFilters, 'overview2') && (
              <CustomSelect
                options={getFilterOptionsByKey(allFilters, 'overview2')}
                value={filterState[FilterType.SECTION] || ''}
                onChange={(value) => setFilterValue(FilterType.SECTION, value)}
                placeholder={config.terminology.tableSecondaryFilter}
                className="w-32"
                showAll={true}
              />
            )}
          </div>
        </div>

        {/* Content Area for Table and messages */}
        <div className="p-0"> 
          {!selectedStd ? (
            <div className="text-[var(--neutral-400)] text-center py-12 bg-[var(--background)] rounded-lg p-8">
              <div className="flex flex-col items-center">
                <h4 className="text-lg font-[MADE_Outer_Sans_Light] text-[var(--neutral-300)] mb-2">
                  No Students Found
                </h4>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto w-full custom-scrollbar">
              {tableDataLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : tableDataError ? (
                <div className="text-[var(--error-500)] text-center py-8 bg-[var(--foreground)] rounded-lg p-6">
                  <p>Error loading student data: {tableDataError.message}</p>
                </div>
              ) : students && students.length > 0 ? (
                <div className="w-full ">
                
                  {/* Horizontally Scrollable Table Container */}
                  <div 
                    className="overflow-x-auto overflow-y-visible w-full border border-[var(--neutral-40)] " 
                    style={{ 
                      maxWidth: '100%',
                      WebkitOverflowScrolling: 'touch'
                    }}
                  >
                    <table className="w-full border-collapse" style={{ minWidth: '1400px' }}>
                        {/* Table Headers */}
                        <thead className="bg-[var(--neutral-200)]">
                          <tr>
                            {enabledColumns.map((column) => {
                              const sortField = getSortFieldForColumn(column.key);
                              const columnConfig = getColumnConfig(column.key);
                              
                              if (column.key === 'rowNumber') {
                                return (
                                  <th key={column.key} className={`px-4 py-4 text-center text-md font-['MADE_Outer_Sans_Light'] text-[var(--neutral-20)] min-w-[50px]`}>
                                    {column.label}
                                  </th>
                                );
                              }
                              
                              if (sortField && column.sortable) {
                                return (
                                  <SortableTableHeader
                                    key={column.key}
                                    field={sortField}
                                    onSort={handleSort}
                                    getSortIcon={getSortIconForField}
                                    className={`${baseHeaderClassnames} ${columnConfig?.width || 'min-w-[150px]'}`}
                                  >
                                    {column.label}
                                  </SortableTableHeader>
                                );
                              } else {
                                return (
                                  <th key={column.key} className={`${baseHeaderClassnames} ${columnConfig?.width || 'min-w-[150px]'} `}>
                                    {column.label}
                                  </th>
                                );
                              }
                            })}
                          </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-[var(--neutral-40)]">
                          {students.map((student) => (
                            <tr 
                              key={student.id || student.sId} 
                              className="cursor-pointer"
                            >
                              {enabledColumns.map((column) => {
                                const columnConfig = getColumnConfig(column.key);
                                return (
                                  <td 
                                    key={column.key} 
                                    className={`${baseTableCellClassnames} ${column.key === 'name' ? 'w-[180px]' : columnConfig?.width || 'min-w-[150px]'} `}
                                  >
                                    {renderCellContent(student, column.key)}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                  </div>
                </div>
              ) : (
                <div className="text-[var(--neutral-400)] text-center py-12 bg-[var(--background)] rounded-lg p-8">
                  <div className="flex flex-col items-center">
               
                    <h4 className="text-lg font-[MADE_Outer_Sans_Light] text-[var(--neutral-300)] mb-2">
                      No Students Found
                    </h4>
                   
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with student count and Load More button */}
        <div className=" px-6 py-3  flex justify-center items-center">
          {hasMoreUIStudents && students && students.length > 0 && !tableDataLoading && !tableDataError && (
            <button 
              onClick={loadMoreUIStudents}
              className="px-4 py-2 bg-[var(--primary-500)] text-white rounded-md hover:bg-[var(--primary-600)] transition-colors duration-200"
              // disabled={isFetchingMore}
            >
              Show More
            </button>
          )}
        </div>
      </div>

      {/* Custom Payment Status Confirmation Dialog */}
      <PaymentStatusConfirmDialog
        isOpen={confirmDialog.isOpen}
        studentName={confirmDialog.student?.name || ''}
        currentStatus={confirmDialog.student?.paymentStatus || PaymentStatus.UNPAID}
        onConfirm={handleConfirmPaymentStatusUpdate}
        onCancel={handleCancelPaymentStatusUpdate}
        isLoading={isUpdatingPayment}
      />
    </>
  );
};

export default StudentTable;