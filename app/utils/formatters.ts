import { SortField } from "./sortHelpers";

export const COLLECTION_NAMES = {
    SCHOOL_STUDENTS: 'SchoolStudents',
    SCHOOL_INSTITUTES: 'SchoolInstitutes',
    TEST_GRADSTATS: 'TestGradeStats',
    SCHOOL_CONNECTION: 'SchoolConnections',
    STUDENT_LATEST_TESTS: 'StudentLatestTests',
    SURVEY_RESPONSES: 'Responses', // Khelegi survey responses
  } as const;
  
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

  // Helper function to get sort field for column key
 export const getSortFieldForColumn = (columnKey: string): SortField | null => {
    const sortFieldMap: Record<string, SortField> = {
      'name': SortField.NAME,
      'paymentStatus': SortField.PAYMENT_STATUS,
      'gender': SortField.GENDER,
      'age': SortField.AGE,
      'classSection': SortField.CLASS_SECTION,
      'bmi': SortField.BMI,
      'overallScore': SortField.OVERALL_SCORE,
      'pushup': SortField.PUSHUP,
      'plank': SortField.PLANK,
      'memory': SortField.MEMORY,
      'concentration': SortField.CONCENTRATION,
      'speed': SortField.SPEED,
      'coreBalance': SortField.CORE_BALANCE,
      'bodyControl': SortField.BODY_CONTROL,
    };
    return sortFieldMap[columnKey] || null;
  };

export function getClassNumber(stdString: string): number {
  const mapping: Record<string, number> = {
    'Std.one': 1,
    'Std.two': 2,
    'Std.three': 3,
    'Std.four': 4,
    'Std.five': 5,
    'Std.six': 6,
    'Std.seven': 7,
    'Std.eight': 8,
    'Std.nine': 9,
    'Std.ten': 10,
    'Std.eleven': 11,
    'Std.twelve': 12
  };
  
  return mapping[stdString] || 0; // Return 0 if not found
}



  export const TEST_NAMES = {
    PUSHUP: 'Tests.pushup',
    PLANK: 'Tests.plank',
    CHIMP_TEST: 'Tests.chimpTest',
    CONCENTRATION: 'Tests.concentration',
    FATIGUE: 'Tests.fatigue',
    CORE_BALANCE: 'Tests.coreBalance',
    BODY_CONTROL: 'Tests.bodyControl',
    BMI: 'Tests.bmi',
    VERTICAL_JUMP: 'Tests.verticalJump',
    HEIGHT: 'Tests.height',
    WEIGHT: 'Tests.weight',
    OVERALL_SCORE: 'Tests.overallScore'
  } as const;
  

export function getStdFromNumber(num: number): string {
  const mapping: Record<number, string> = {
    1: 'Std.one',
    2: 'Std.two',
    3: 'Std.three',
    4: 'Std.four',
    5: 'Std.five',
    6: 'Std.six',
    7: 'Std.seven',
    8: 'Std.eight',
    9: 'Std.nine',
    10: 'Std.ten',
    11: 'Std.eleven',
    12: 'Std.twelve'
  };
  
  return mapping[num] || '';
}

export function formatTestName(testString: string): string {
  // Remove the 'Tests.' prefix if it exists
  const nameWithoutPrefix = testString.replace('Tests.', '');
  
  // Convert to title case (capitalize first letter of each word) and add space before capital letters
  return nameWithoutPrefix
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Helper to format enum keys for display (e.g., Gender.Male -> Male)
export function formatEnumKey(key: string): string {
  return key.split('.')[1] || key;
}

// Helper to create options for class (4-12)
export function getClassOptions() {
  return Array.from({ length: 9 }, (_, i) => i + 4).map(num => ({
      value: String(num),
      label: String(num)
  }));
}

// Helper to create options for section (A-I)
export function getSectionOptions() {
  return Array.from({ length: 9 }, (_, i) => String.fromCharCode(65 + i)).map(char => ({
      value: `Section.${char.toLowerCase()}`,
      label: char
  }));
}

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth: Date | string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Helper function to format class and section
 */
export const formatClassSection = (std: string, section: string): string => {
  const classNumber = getClassNumber(std); // Convert 'Std.one' to 1
  const sectionLetter = section.replace('Section.', '').toUpperCase();
  return `${classNumber}${sectionLetter}`;
};

/**
 * Helper function to format score values
 */
export const formatScore = (value: number | undefined): string => {
  if (value === undefined || value === null) return '-';
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
};

/**
 * Helper function to format memory score (and other /10 scores)
 */
export const formatScoreOutOf10 = (score: number | undefined, maxScore: number = 10): string => {
  if (score === undefined || score === null) return '0/10';
  return `${formatScore(score)}/${maxScore}`;
};


