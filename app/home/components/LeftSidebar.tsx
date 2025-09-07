import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { DashboardConfig } from '@/app/utils/dashboardConfig';
import { FilterState, FilterType, hasFilterKey, getFilterOptionsByKey } from '@/app/utils/filterHelpers';
import FilterSection from '@/app/components/common/FilterSection';
import { FilterOption } from '@/app/utils/dashboardConfig';

interface ConnectedSchool {
  id: string;
  name: string;
  email: string;
}

interface LeftSidebarProps {
  connectedSchools: ConnectedSchool[];
  config: DashboardConfig;
  onSchoolSelect: (schoolEmail: string) => void;
  onHomeClick: () => void;
  selectedSchoolEmail: string;
  filterState: FilterState;
  toggleMultiFilterValue: (type: FilterType, value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  allFilters: FilterOption[];
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ 
  connectedSchools, 
  config, 
  onSchoolSelect, 
  onHomeClick, 
  selectedSchoolEmail, 
  filterState,
  toggleMultiFilterValue,
  hasActiveFilters,
  onClearFilters,
  allFilters,
}) => {
  const router = useRouter();
  
  // State for collapsible filter sections
  const [expandedSections, setExpandedSections] = useState({
    gender: true,
    paymentStatus: true,
    bmi: true,
  });

  const toggleSection = (section: 'gender' | 'paymentStatus' | 'bmi') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Memoized filter options from config
  const genderOptions = useMemo(() => 
    getFilterOptionsByKey(allFilters, 'sidebar_gender').map(option => ({
      value: option.value,
      label: option.label,
    })), [allFilters]
  );

  const paymentStatusOptions = useMemo(() => 
    getFilterOptionsByKey(allFilters, 'sidebar_payment').map(option => ({
      value: option.value,
      label: option.label,
    })), [allFilters]
  );

  const bmiOptions = useMemo(() => 
    getFilterOptionsByKey(allFilters, 'sidebar_bmi').map(option => ({
      value: option.value,
      label: option.label,
    })), [allFilters]
  );

  // Removed unused variables

  return (
    <div className="w-80 bg-[var(--background)] shadow-lg h-full flex flex-col">
      <div className="pt-5 px-3 h-full flex flex-col">
        {/* Home Button */}
        <button
          className={`w-full flex items-center px-4 py-2 text-[var(--neutral-500)] font-['MADE_Outer_Sans_Light'] cursor-pointer bg-[var(--primary-100)] rounded-3xl mb-4`}
          onClick={onHomeClick}
        >
          <Image src="/icons/home.svg" alt="Home Icon" width={16} height={16} className="h-4 mr-5" />
          {config.terminology.home}
        </button>

        {/* Schools Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-md text-[var(--neutral-80)] tracking-wider flex ml-3 items-center mt-4 font-['MADE_Outer_Sans_Light']">
              <Image src="/icons/domain.svg" alt="Domain Icon" width={20} height={20} className="h-5 mr-4" />
              {config.terminology.schools}
            </h3>
            <button
              className="p-1 mt-1 text-[var(--neutral-500)] cursor-pointer"
              onClick={() => {
                router.push('/home/addSchool');
              }}
            >
              <Image src="/icons/add.svg" alt="Add Icon" width={12} height={12} className="h-3 mr-2 mt-3" />
            </button>
          </div>

          {/* Connected Schools List - Limited to 6 schools with scroll */}
          <div className="space-y-3 mt-5 max-h-56 overflow-y-auto custom-scrollbar">
            {connectedSchools.length > 0 ? (
              connectedSchools.map((school) => {
                const isSelected = selectedSchoolEmail === school.email;
                return (
                  <button
                    key={school.id}
                    className={`w-full text-left px-7 py-2 text-sm font-['MADE_Outer_Sans_Light'] rounded-md cursor-pointer transition-colors truncate ${
                      isSelected 
                        ? 'bg-[var(--primary-50)] text-[var(--primary-500)]' 
                        : 'text-[var(--neutral-500)]'
                    }`}
                    onClick={() => onSchoolSelect(school.email)}
                    title={school.name}
                  >
                    {school.name}
                  </button>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 px-3 py-2">No schools connected</p>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="border-t border-[var(--neutral-600)] pt-4 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl text-[var(--neutral-80)] tracking-wider flex ml-3 items-center font-['MADE_Outer_Sans_Light']">
              <Image src="/icons/filter_icon.svg" alt="Filter Icon" width={16} height={16} className="h-4 mr-3" />
              Filters
            </h3>
            <button 
                className={`text-base cursor-pointer p-1 w-20 mt-1 mr-2 font-['MADE_Outer_Sans_Light'] ${hasActiveFilters ? 'bg-[var(--primary-500)] text-[var(--neutral-10)] rounded-xl' : 'text-[var(--neutral-40)] rounded-xl bg-[var(--neutral-10)] '}`}
                onClick={onClearFilters}
              >
                Clear all
              </button>
          </div>
          
          {/* Scrollable Filter Content */}
          <div className="flex-1 overflow-y-auto pl-3 custom-scrollbar">

            {/* Gender Filter - Only show if configured */}
            {hasFilterKey(allFilters, 'sidebar_gender') && (
              <FilterSection
                title="Gender"
                isExpanded={expandedSections.gender}
                onToggle={() => toggleSection('gender')}
                options={genderOptions}
                selectedValues={filterState[FilterType.GENDER]}
                onOptionChange={(value) => toggleMultiFilterValue(FilterType.GENDER, value)}
              />
            )}

            {/* Payment Status Filter - Only show if configured */}
            {hasFilterKey(allFilters, 'sidebar_payment') && (
              <FilterSection
                title="Payment Status"
                isExpanded={expandedSections.paymentStatus}
                onToggle={() => toggleSection('paymentStatus')}
                options={paymentStatusOptions}
                selectedValues={filterState[FilterType.PAYMENT_STATUS]}
                onOptionChange={(value) => toggleMultiFilterValue(FilterType.PAYMENT_STATUS, value)}
              />
            )}

            {/* BMI Filter - Only show if configured */}
            {hasFilterKey(allFilters, 'sidebar_bmi') && (
              <FilterSection
                title="BMI"
                isExpanded={expandedSections.bmi}
                onToggle={() => toggleSection('bmi')}
                options={bmiOptions}
                selectedValues={filterState[FilterType.BMI]}
                onOptionChange={(value) => toggleMultiFilterValue(FilterType.BMI, value)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar; 