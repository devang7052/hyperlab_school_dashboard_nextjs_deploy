import React, { useState } from 'react';
import Image from 'next/image';
import { SurveyFilterState } from '../../hooks/khelegi/khelegiTable/useSurveyFilters';
import FilterSection from '@/app/components/common/FilterSection';

interface KhelegiFilterSidebarProps {
  filterState: SurveyFilterState;
  setFilterValue: (field: keyof SurveyFilterState, value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const KhelegiFilterSidebar: React.FC<KhelegiFilterSidebarProps> = ({
  filterState,
  setFilterValue,
  hasActiveFilters,
  onClearFilters,
}) => {
  
  // State for collapsible filter sections
  const [expandedSections, setExpandedSections] = useState({
    demographics: true,
    family: true,
    sports: true,
    menstrualHealth: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Demographics Filter Options
  const ageGroupOptions = [
    { value: 'AgeGroup.8to12', label: '8-12 years' },
    { value: 'AgeGroup.12to17', label: '12-17 years' },
    { value: 'AgeGroup.18to27', label: '18-27 years' },
    { value: 'AgeGroup.parent', label: 'Parent' },
  ];

  const schoolTypeOptions = [
    { value: 'State Board govt funded', label: 'State Board govt funded' },
    { value: 'State Board self funded', label: 'State Board self funded' },
    { value: 'ICSE', label: 'ICSE' },
    { value: 'CBSE', label: 'CBSE' },
    { value: 'IB', label: 'IB' },
    { value: 'IGCSE', label: 'IGCSE' },
  ];


  const religionOptions = [
    { value: 'Hindu', label: 'Hindu' },
    { value: 'Muslim', label: 'Muslim' },
    { value: 'Christian', label: 'Christian' },
    { value: 'Sikh', label: 'Sikh' },
    { value: 'Jain', label: 'Jain' },
    { value: 'Buddhist', label: 'Buddhist' },
    { value: "Don't know", label: "Don't know" },
    { value: 'Other:', label: 'Other' },
  ];

  const casteCommunityOptions = [
    { value: 'Scheduled Tribe', label: 'Scheduled Tribe' },
    { value: 'Scheduled Caste', label: 'Scheduled Caste' },
    { value: 'General', label: 'General' },
    { value: "Don't know", label: "Don't know" },
    { value: 'Other:', label: 'Other' },
  ];

  // Family Background Filter Options
  const parentalEducationOptions = [
    { value: 'No formal education', label: 'No formal education' },
    { value: 'Primary (1st-5th)', label: 'Primary (1st-5th)' },
    { value: 'Secondary (6th–10th)', label: 'Secondary (6th–10th)' },
    { value: 'Higher secondary (11th–12th)', label: 'Higher secondary (11th–12th)' },
    { value: 'Graduate', label: 'Graduate' },
    { value: 'Postgraduate', label: 'Postgraduate' },
  ];

  const parentalOccupationOptions = [
    { value: 'Government Service', label: 'Government Service' },
    { value: 'Private Job', label: 'Private Job' },
    { value: 'Daily Wage / Labor', label: 'Daily Wage / Labor' },
    { value: 'Business', label: 'Business' },
    { value: 'Farmer', label: 'Farmer' },
    { value: 'Homemaker', label: 'Homemaker' },
    { value: 'Unemployed', label: 'Unemployed' },
    { value: 'Don\'t Know', label: 'Don\'t Know' },
    { value: 'Other', label: 'Other' },
  ];

  // Sports Participation Filter Options
  const sportsParticipationStatusOptions = [
    { value: 'Active/Regular', label: 'Active/Regular' },
    { value: 'Active/Irregular', label: 'Active/Irregular' },
    { value: 'Dropout', label: 'Dropout' },
    { value: 'Returnee', label: 'Returnee' },
    { value: 'Never played', label: 'Never played' },
    { value: 'Cannot determine', label: 'Cannot determine' },
  ];

  const sportsFrequencyOptions = [
    { value: 'SportsFrequency.daily', label: 'Daily' },
    { value: 'SportsFrequency.weekly', label: 'Weekly' },
    { value: 'SportsFrequency.monthly', label: 'Monthly' },
    { value: 'SportsFrequency.none', label: 'None' },
  ];

  // Menstrual Health Filter Options
  const menarcheStatusOptions = [
    { value: 'Pre-menarche', label: 'Pre-menarche' },
    { value: 'Post-menarche', label: 'Post-menarche' },
    { value: 'None', label: 'None' },
  ];

  const menstrualProductUseOptions = [
    { value: 'Sanitary Pads', label: 'Sanitary Pads' },
    { value: 'Cloth', label: 'Cloth' },
    { value: 'Menstrual Cup', label: 'Menstrual Cup' },
    { value: 'Tampon', label: 'Tampon' },
    { value: 'Period Panties', label: 'Period Panties' },
    { value: 'Nothing', label: 'Nothing' },
    { value: 'Other:', label: 'Other' },
  ];

  // Performance Index Filter Options removed as requested

  // Helper function to convert filter values to array format for FilterSection
  const getFilterValueAsArray = (field: keyof SurveyFilterState): string[] => {
    const value = filterState[field];
    if (!value) return [];
    
    // If it's already an array (from multi-select), return it
    if (Array.isArray(value)) return value;
    
    // If it's a string, convert to array
    return value.split(',').filter(v => v.trim() !== '');
  };

  // Helper function to handle multi-select filter changes
  const handleMultiFilterChange = (field: keyof SurveyFilterState, value: string) => {
    const currentValues = getFilterValueAsArray(field);
    let newValues: string[];
    
    if (currentValues.includes(value)) {
      // Remove value if it's already selected
      newValues = currentValues.filter(v => v !== value);
    } else {
      // Add value if it's not selected
      newValues = [...currentValues, value];
    }
    
    // Convert array back to comma-separated string for storage
    setFilterValue(field, newValues.join(','));
  };

  return (
    <div className="w-80 bg-[var(--background)] shadow-lg h-full flex flex-col">
      <div className="pt-5 px-3 h-full flex flex-col">
        {/* Home Button */}
        <button
          className={`w-full flex items-center px-4 py-2 text-[var(--neutral-500)] font-['Manrope'] cursor-pointer bg-[var(--primary-100)] font-semibold rounded-3xl mb-4`}
          onClick={() => window.location.href = '/home'}
        >
          <Image src="/icons/home.svg" alt="Home Icon" width={16} height={16} className="h-4 mr-5 font-['Manrope']" />
          Back to Home
        </button>

        {/* Filters Section */}
        <div className="border-t border-[var(--neutral-600)] pt-4 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl text-[var(--neutral-80)] tracking-wider flex ml-3 items-center font-normal">
              <Image src="/icons/filter_icon.svg" alt="Filter Icon" width={16} height={16} className="h-4 mr-3" />
              Filters
            </h3>
            <button 
              className={`text-base p-1 w-24 mt-1 mr-2 font-bold font-['Manrope'] rounded-xl bg-[var(--neutral-500)] text-[var(--neutral-10)] ${hasActiveFilters ? 'opacity-100 hover:bg-[var(--neutral-600)] cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
            >
              Clear all
            </button>
          </div>
          
          {/* Scrollable Filter Content */}
          <div className="flex-1 overflow-y-auto pl-3 custom-scrollbar">

            {/* Demographics Section */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection('demographics')}
                className="flex items-center justify-between w-full text-left text-[var(--neutral-100)] font-normal py-2 hover:text-[var(--primary-500)]"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Demographics</span>
                </div>
                <span>{expandedSections.demographics ? '▾' : '▸'}</span>
              </button>
              
              {expandedSections.demographics && (
                <div className="ml-4 space-y-3">
                  <FilterSection
                    title="Age Group"
                    isExpanded={true}
                    onToggle={() => {}}
                    options={ageGroupOptions}
                    selectedValues={getFilterValueAsArray('ageGroup')}
                    onOptionChange={(value) => handleMultiFilterChange('ageGroup', value)}
                    bold={false}
                    inheritFont={true}
                  />
                  
                  <FilterSection
                    title="School Type"
                    isExpanded={true}
                    onToggle={() => {}}
                    options={schoolTypeOptions}
                    selectedValues={getFilterValueAsArray('schoolType')}
                    onOptionChange={(value) => handleMultiFilterChange('schoolType', value)}
                    bold={false}
                    inheritFont={true}
                  />
                  
                  
                  <FilterSection
                    title="Religion"
                    isExpanded={true}
                    onToggle={() => {}}
                    options={religionOptions}
                    selectedValues={getFilterValueAsArray('religion')}
                    onOptionChange={(value) => handleMultiFilterChange('religion', value)}
                    bold={false}
                    inheritFont={true}
                  />
                  
                  <FilterSection
                    title="Caste/Community"
                    isExpanded={true}
                    onToggle={() => {}}
                    options={casteCommunityOptions}
                    selectedValues={getFilterValueAsArray('casteCommunity')}
                    onOptionChange={(value) => handleMultiFilterChange('casteCommunity', value)}
                    bold={false}
                    inheritFont={true}
                  />
                </div>
              )}
            </div>

            {/* Family Background Section */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection('family')}
                className="flex items-center justify-between w-full text-left text-[var(--neutral-100)] font-normal py-2 hover:text-[var(--primary-500)]"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Family Background</span>
                </div>
                <span>{expandedSections.family ? '▾' : '▸'}</span>
              </button>
              
              {expandedSections.family && (
                <div className="ml-4 space-y-3">
                  <FilterSection
                    title="Parental Education"
                    isExpanded={true}
                    onToggle={() => {}}
                    options={parentalEducationOptions}
                    selectedValues={getFilterValueAsArray('parentalEducation')}
                    onOptionChange={(value) => handleMultiFilterChange('parentalEducation', value)}
                    bold={false}
                    inheritFont={true}
                  />
                  
                  <FilterSection
                    title="Parental Occupation"
                    isExpanded={true}
                    onToggle={() => {}}
                    options={parentalOccupationOptions}
                    selectedValues={getFilterValueAsArray('parentalOccupation')}
                    onOptionChange={(value) => handleMultiFilterChange('parentalOccupation', value)}
                    bold={false}
                    inheritFont={true}
                  />
                </div>
              )}
            </div>

            {/* Sports Participation Section */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection('sports')}
                className="flex items-center justify-between w-full text-left text-[var(--neutral-100)] font-normal py-2 hover:text-[var(--primary-500)]"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Sports Participation</span>
                </div>
                <span>{expandedSections.sports ? '▾' : '▸'}</span>
              </button>
              
              {expandedSections.sports && (
                <div className="ml-4 space-y-3">
                  <FilterSection
                    title="Current Status"
                    isExpanded={true}
                    onToggle={() => {}}
                    options={sportsParticipationStatusOptions}
                    selectedValues={getFilterValueAsArray('sportsParticipationStatus')}
                    onOptionChange={(value) => handleMultiFilterChange('sportsParticipationStatus', value)}
                    bold={false}
                    inheritFont={true}
                  />
                  
                  <FilterSection
                    title="Frequency"
                    isExpanded={true}
                    onToggle={() => {}}
                    options={sportsFrequencyOptions}
                    selectedValues={getFilterValueAsArray('sportsFrequency')}
                    onOptionChange={(value) => handleMultiFilterChange('sportsFrequency', value)}
                    bold={false}
                    inheritFont={true}
                  />
                </div>
              )}
            </div>

            {/* Menstrual Health Section */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection('menstrualHealth')}
                className="flex items-center justify-between w-full text-left text-[var(--neutral-100)] font-normal py-2 hover:text-[var(--primary-500)]"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Menstrual Health</span>
                </div>
                <span>{expandedSections.menstrualHealth ? '▾' : '▸'}</span>
              </button>
              
              {expandedSections.menstrualHealth && (
                <div className="ml-4 space-y-3">
                  <FilterSection
                    title="Menarche Status"
                    isExpanded={true}
                    onToggle={() => {}}
                    options={menarcheStatusOptions}
                    selectedValues={getFilterValueAsArray('menarcheStatus')}
                    onOptionChange={(value) => handleMultiFilterChange('menarcheStatus', value)}
                    bold={false}
                    inheritFont={true}
                  />
                  
                  <FilterSection
                    title="Menstrual Product Use"
                    isExpanded={true}
                    onToggle={() => {}}
                    options={menstrualProductUseOptions}
                    selectedValues={getFilterValueAsArray('menstrualProductUse')}
                    onOptionChange={(value) => handleMultiFilterChange('menstrualProductUse', value)}
                    bold={false}
                    inheritFont={true}
                  />
                  
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default KhelegiFilterSidebar;
