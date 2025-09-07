import { StudentWithTestData } from '../service/homeService';
import { Gender, PaymentStatus } from '../models/schoolStudent';
import { calculateAge } from './formatters';

export enum SortDirection {
  NONE = 'none',
  ASC = 'asc',
  DESC = 'desc'
}

export enum SortField {
  NAME = 'name',
  PAYMENT_STATUS = 'paymentStatus',
  GENDER = 'gender',
  AGE = 'age',
  CLASS_SECTION = 'classSection',
  BMI = 'bmi',
  OVERALL_SCORE = 'overallScore',
  PUSHUP = 'pushup',
  PLANK = 'plank',
  MEMORY = 'memory',
  CONCENTRATION = 'concentration',
  SPEED = 'speed',
  CORE_BALANCE = 'coreBalance',
  BODY_CONTROL = 'bodyControl'
}

export interface SortState {
  field: SortField | null;
  direction: SortDirection;
}

export const createInitialSortState = (): SortState => ({
  field: null,
  direction: SortDirection.NONE
});



/**
 * Get sortable value from student based on field
 */
export const getSortableValue = (student: StudentWithTestData, field: SortField): string | number | undefined => {
  switch (field) {
    case SortField.NAME:
      return (student.name || '').toLowerCase();
    
    case SortField.PAYMENT_STATUS:
      // Convert to number for sorting: Paid = 1, Unpaid = 0
      return student.paymentStatus === PaymentStatus.PAID ? 1 : 0;
    
    case SortField.GENDER:
      // Convert to number for sorting: Male = 1, Female = 0
      return student.gender === Gender.MALE ? 1 : 0;
    
    case SortField.AGE:
      return student.dateOfBirth ? calculateAge(student.dateOfBirth) : 0;
    
    case SortField.CLASS_SECTION:
      // Combine class and section for sorting
      const classNum = student.std ? parseInt(student.std.replace('Std.', '')) : 0;
      const sectionChar = student.section ? student.section.replace('Section.', '') : 'z';
      return `${classNum.toString().padStart(2, '0')}_${sectionChar}`;
    
    case SortField.BMI:
      return student.latestTest?.score?.bmi || 0;
    
    case SortField.OVERALL_SCORE:
      if (!student.latestTest?.score) return 0;
      const scores = student.latestTest.score;
      return (scores.bodyControl + scores.concentration + scores.coreBalance + scores.fatigue) / 4;
    
    case SortField.PUSHUP:
      return student.latestTest?.score?.pushup || 0;
    
    case SortField.PLANK:
      return student.latestTest?.score?.plank || 0;
    
    case SortField.MEMORY:
      return student.latestTest?.score?.chimpTest || 0;
    
    case SortField.CONCENTRATION:
      return student.latestTest?.score?.concentration || 0;
    
    case SortField.SPEED:
      return student.latestTest?.score?.fatigue || 0;
    
    case SortField.CORE_BALANCE:
      return student.latestTest?.score?.coreBalance || 0;
    
    case SortField.BODY_CONTROL:
      return student.latestTest?.score?.bodyControl || 0;
    
    default:
      return 0;
  }
};

/**
 * Sort students array based on field and direction
 */
export const sortStudents = (
  students: StudentWithTestData[], 
  field: SortField | null, 
  direction: SortDirection
): StudentWithTestData[] => {
  if (!field || direction === SortDirection.NONE) {
    return students; // Return original order
  }

  return [...students].sort((a, b) => {
    const aValue = getSortableValue(a, field);
    const bValue = getSortableValue(b, field);
    
    let comparison = 0;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else {
      comparison = Number(aValue || 0) - Number(bValue || 0);
    }
    
    return direction === SortDirection.ASC ? comparison : -comparison;
  });
};

/**
 * Get next sort direction in cycle: none -> asc -> desc -> none
 */
export const getNextSortDirection = (currentDirection: SortDirection): SortDirection => {
  switch (currentDirection) {
    case SortDirection.NONE:
      return SortDirection.ASC;
    case SortDirection.ASC:
      return SortDirection.DESC;
    case SortDirection.DESC:
      return SortDirection.NONE;
    default:
      return SortDirection.ASC;
  }
};

/**
 * Get sort icon for display
 */
export const getSortIcon = (field: SortField, currentField: SortField | null, direction: SortDirection): string => {
  if (currentField !== field || direction === SortDirection.NONE) {
    return ''; // No icon
  }
  
  return direction === SortDirection.ASC ? '↑' : '↓';
}; 