import { FilterOption } from './dashboardConfig';
import { StudentWithTestData } from '../service/homeService';

// Constants moved from useFilteredData
export const UI_INITIAL_DISPLAY = 20; // Initial number of students to show
export const UI_DISPLAY_INCREMENT = 10; // Number of students to add when loading more
export const FIREBASE_FETCH_LIMIT = 50; // Should match the limit in useHomeTableData

// Enum for filter types to make it more type-safe and readable
export enum FilterType {
  STANDARD = 'standard',
  SECTION = 'section', 
  PAYMENT_STATUS = 'paymentStatus', // Now multi-select
  GENDER = 'gender',
  BMI = 'bmi', // New BMI filter
}

// Type-safe filter state using specific filter types
// Now supports both single values (string) and multiple values (string[])
export interface FilterState {
  [FilterType.STANDARD]: string;
  [FilterType.SECTION]: string;
  [FilterType.PAYMENT_STATUS]: string[]; // Multi-select for checkboxes
  [FilterType.GENDER]: string[]; // Multi-select for checkboxes
  [FilterType.BMI]: string[]; // Multi-select for BMI categories
}

// BMI Categories with their ranges
export enum BMICategory {
  UNDERWEIGHT = 'underweight',
  NORMAL = 'normal',
  OVERWEIGHT = 'overweight',
  OBESE_CLASS_1 = 'obese_class_1',
  OBESE_CLASS_2 = 'obese_class_2',
  OBESE_CLASS_3 = 'obese_class_3',
}

// BMI category definitions
export const BMI_CATEGORIES = {
  [BMICategory.UNDERWEIGHT]: { label: 'Underweight', min: 0, max: 18.4 },
  [BMICategory.NORMAL]: { label: 'Normal', min: 18.5, max: 24.9 },
  [BMICategory.OVERWEIGHT]: { label: 'Overweight', min: 25, max: 29.9 },
  [BMICategory.OBESE_CLASS_1]: { label: 'Obese (Class 1)', min: 30, max: 34.9 },
  [BMICategory.OBESE_CLASS_2]: { label: 'Obese (Class 2)', min: 35, max: 39.9 },
  [BMICategory.OBESE_CLASS_3]: { label: 'Obese (Class 3)', min: 40, max: 999 },
};

/**
 * Helper function to categorize BMI value
 */
export const getBMICategory = (bmi: number): BMICategory | null => {
  if (bmi < 18.5) return BMICategory.UNDERWEIGHT;
  if (bmi >= 18.5 && bmi <= 24.9) return BMICategory.NORMAL;
  if (bmi >= 25 && bmi <= 29.9) return BMICategory.OVERWEIGHT;
  if (bmi >= 30 && bmi <= 34.9) return BMICategory.OBESE_CLASS_1;
  if (bmi >= 35 && bmi <= 39.9) return BMICategory.OBESE_CLASS_2;
  if (bmi >= 40) return BMICategory.OBESE_CLASS_3;
  return null;
};

// Filter definition with type-safe predicates
interface FilterDefinition {
  type: FilterType;
  predicate: (student: StudentWithTestData, value: string | string[]) => boolean;
}

// Centralized filter definitions - easy to maintain and extend
export const FILTER_DEFINITIONS: FilterDefinition[] = [
  {
    type: FilterType.STANDARD,
    predicate: (student, value) => !value || student.std === value
  },
  {
    type: FilterType.SECTION,
    predicate: (student, value) => !value || student.section === value
  },
  {
    type: FilterType.PAYMENT_STATUS,
    predicate: (student, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.includes(student.paymentStatus);
    }
  },
  {
    type: FilterType.GENDER,
    predicate: (student, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.includes(student.gender);
    }
  },
  {
    type: FilterType.BMI,
    predicate: (student, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      
      const bmi = student.latestTest?.score?.bmi;
      if (!bmi || typeof bmi !== 'number') return false; // No BMI data = exclude
      
      const bmiCategory = getBMICategory(bmi);
      return bmiCategory ? value.includes(bmiCategory) : false;
    }
  }
];

// Mapping from old filter keys to new filter types for backward compatibility
export const LEGACY_KEY_MAPPING: Record<string, FilterType> = {
  'overview1': FilterType.STANDARD,
  'overview2': FilterType.SECTION,
  'overview3': FilterType.PAYMENT_STATUS,
};

/**
 * Creates initial filter state with all empty values
 */
export const createInitialFilterState = (): FilterState => ({
  [FilterType.STANDARD]: '',
  [FilterType.SECTION]: '',
  [FilterType.PAYMENT_STATUS]: [],
  [FilterType.GENDER]: [],
  [FilterType.BMI]: [],
});

export const applyFilters = (students: StudentWithTestData[], filters: FilterState): StudentWithTestData[] => {
  return students.filter(student => {
    return FILTER_DEFINITIONS.every(({ type, predicate }) => {
      const filterValue = filters[type];
      return predicate(student, filterValue);
    });
  });
};

export const normalizeFilterType = (typeOrKey: FilterType | string): FilterType => {
  return Object.values(FilterType).includes(typeOrKey as FilterType) 
    ? typeOrKey as FilterType
    : LEGACY_KEY_MAPPING[typeOrKey] || FilterType.STANDARD;
};

export const mergeStudentsWithoutDuplicates = (
  existingStudents: StudentWithTestData[], 
  newStudents: StudentWithTestData[]
): StudentWithTestData[] => {
  const existingIds = new Set(existingStudents.map(s => s.sId));
  const uniqueNewStudents = newStudents.filter(s => !existingIds.has(s.sId));
  return [...existingStudents, ...uniqueNewStudents];
};

export const hasMoreData = (fetchedCount: number, limit: number = FIREBASE_FETCH_LIMIT): boolean => {
  return fetchedCount >= limit;
};

export const getFilterOptionsByKey = (filters: FilterOption[], key: string): { value: string; label: string }[] => {
  return filters
    .filter(filter => filter.key === key)
    .map(filter => ({ value: filter.value, label: filter.label }));
};

export const hasFilterKey = (filters: FilterOption[], key: string): boolean => {
  return filters.some(filter => filter.key === key);
};

/**
 * Helper function to toggle a value in a multi-select filter
 */
export const toggleFilterValue = (currentValues: string[], value: string): string[] => {
  if (currentValues.includes(value)) {
    return currentValues.filter(v => v !== value);
  } else {
    return [...currentValues, value];
  }
};

/**
 * Helper function to check if any filters are active
 */
export const hasActiveFilters = (filterState: FilterState): boolean => {
  return Object.entries(filterState).some(([, value]) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== '';
  });
};

/**
 * Helper function to clear all filters
 */
export const clearAllFilters = (): FilterState => createInitialFilterState();
