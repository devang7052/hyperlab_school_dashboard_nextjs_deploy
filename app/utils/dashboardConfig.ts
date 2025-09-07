// app/config/dashboardConfig.ts
import type { DashboardType } from '../models/schoolInstitute';

export interface FilterOption {
  key: string;
  value: string;
  label: string;
}

export interface DashboardFilters {
  filters: FilterOption[];
}

export interface TableColumn {
  key: string;
  label: string;
  enabled: boolean;
  sortable?: boolean;
  width?: string;
}

export interface DashboardTableConfig {
  columns: TableColumn[];
}

export interface DashboardTheme {
  background: string;
  background_hover: string;
  foreground: string;
  neutral_800: string;
  neutral_40: string;
  neutral_30: string;
  error_500: string;
  primary_600: string;
  neutral_200: string;
  neutral_10: string;
  neutral_80: string;
  primary_500: string;
  neutral_20: string;
  neutral_500: string;
  neutral_600: string;
  neutral_400: string;
  neutral_700: string;
  neutral_100: string;
  primary_100: string;
  primary_400: string;
  secondary_400: string;
}

export interface DashboardTerminology {
  dashboard: string;
  schools: string;
  home: string;
  institution: string;
  students: string;
  maleStudents: string;
  femaleStudents: string;
  paidStudents: string;
  unpaidStudents: string;
  totalCount: string;
  tablePrimaryFilter: string;
  tableSecondaryFilter: string;
  tableTitle: string;
  overviewTitle: string;
}


export interface DashboardConfig {
  type: DashboardType;
  theme: DashboardTheme;
  terminology: DashboardTerminology;
  filters: DashboardFilters;
  tableConfig: DashboardTableConfig;
}

// Demo configurations for each dashboard type
export const DASHBOARD_CONFIGS: Record<DashboardType, DashboardConfig> = {
  school: {
    type: 'school',
    theme: {
      primary_500: '#E30051', // Mapped from original primary
      secondary_400: '#7474DC', // Mapped from original secondary
      neutral_40: '#C0C0C0', // Mapped from original accent
      neutral_10: '#F0F0F0', // Mapped from original background
      background: '#ffffff', // Mapped from original cardBackground
      foreground: '#171717', // Mapped from original textPrimary
      neutral_80: '#808080', // Mapped from original textSecondary
      neutral_30: '#D0D0D0',

      // Default values from globals.css for other colors not explicitly mapped
      background_hover: '#f2f2f2',
      neutral_800: '#101010',
      error_500: '#F53D3D',
      primary_600: '#cc0047',
      neutral_200: '#505050',
      neutral_20: '#E0E0E0',
      neutral_500: '#2a2a2a',
      neutral_600: '#202020',
      neutral_400: '#303030',
      neutral_700: '#1A1A1A',
      neutral_100: '#606060',
      primary_100: '#F9CCDC',
      primary_400: '#EC4D86',
    },
    terminology: {
      dashboard: 'School Dashboard',
      schools: 'Schools',
      home: 'Home',
      institution: 'School',
      students: 'Students',
      maleStudents: 'Boys',
      femaleStudents: 'Girls',
      paidStudents: 'Paid Students',
      unpaidStudents: 'Unpaid Students',
      totalCount: 'Total Students',
      tablePrimaryFilter: 'Class',
      tableSecondaryFilter: 'Section',
      tableTitle: 'Students',
      overviewTitle: 'Overview',
    },

    filters: {
      filters: [
        { key: 'overview1', value: 'Std.four', label: '4' },
        { key: 'overview1', value: 'Std.five', label: '5' },
        { key: 'overview1', value: 'Std.six', label: '6' },
        { key: 'overview1', value: 'Std.seven', label: '7' },
        { key: 'overview1', value: 'Std.eight', label: '8' },
        { key: 'overview1', value: 'Std.nine', label: '9' },
        { key: 'overview1', value: 'Std.ten', label: '10' },
        { key: 'overview1', value: 'Std.eleven', label: '11' },
        { key: 'overview1', value: 'Std.twelve', label: '12' },
        { key: 'overview2', value: 'Section.a', label: 'A' },
        { key: 'overview2', value: 'Section.b', label: 'B' },
        { key: 'overview2', value: 'Section.c', label: 'C' },
        { key: 'overview2', value: 'Section.d', label: 'D' },
        { key: 'overview2', value: 'Section.e', label: 'E' },
        { key: 'overview2', value: 'Section.f', label: 'F' },
        { key: 'overview2', value: 'Section.g', label: 'G' },
        { key: 'overview2', value: 'Section.h', label: 'H' },
        { key: 'overview2', value: 'Section.i', label: 'I' },
        { key: 'overview2', value: 'Section.j', label: 'J' },
        { key: 'overview2', value: 'Section.k', label: 'K' },
        { key: 'overview2', value: 'Section.l', label: 'L' },
        { key: 'overview2', value: 'Section.m', label: 'M' },
        { key: 'overview2', value: 'Section.n', label: 'N' },
        { key: 'overview2', value: 'Section.o', label: 'O' },
        { key: 'overview2', value: 'Section.p', label: 'P' },
        { key: 'overview2', value: 'Section.q', label: 'Q' },
        { key: 'overview2', value: 'Section.r', label: 'R' },
        { key: 'overview2', value: 'Section.s', label: 'S' },
        { key: 'overview2', value: 'Section.t', label: 'T' },
        { key: 'overview2', value: 'Section.u', label: 'U' },
        { key: 'overview2', value: 'Section.v', label: 'V' },
        { key: 'overview2', value: 'Section.w', label: 'W' },
        { key: 'overview2', value: 'Section.x', label: 'X' },
        { key: 'overview2', value: 'Section.y', label: 'Y' },
        { key: 'overview2', value: 'Section.z', label: 'Z' },
        
        // // Sidebar filters
        { key: 'sidebar_gender', value: 'Gender.male', label: 'Male' },
        { key: 'sidebar_gender', value: 'Gender.female', label: 'Female' },
        { key: 'sidebar_payment', value: 'PaymentStatus.paid', label: 'Paid' },
        { key: 'sidebar_payment', value: 'PaymentStatus.unpaid', label: 'Unpaid' },
        { key: 'sidebar_bmi', value: 'underweight', label: 'Underweight' },
        { key: 'sidebar_bmi', value: 'normal', label: 'Normal' },
        { key: 'sidebar_bmi', value: 'overweight', label: 'Overweight' },
        { key: 'sidebar_bmi', value: 'obese_class_1', label: 'Obese (Class 1)' },
        { key: 'sidebar_bmi', value: 'obese_class_2', label: 'Obese (Class 2)' },
        { key: 'sidebar_bmi', value: 'obese_class_3', label: 'Obese (Class 3)' },
      ]
      
    },
    tableConfig: {
      //keys should match with database fields
      columns: [
        { key: 'rowNumber', label: '#', enabled: true, sortable: false, width: 'w-16' },
        { key: 'name', label: 'Full Name', enabled: true, sortable: true, width: 'w-40' },
        { key: 'paymentStatus', label: 'Payment Status', enabled: true, sortable: true, width: 'w-32' },
        { key: 'gender', label: 'Gender', enabled: true, sortable: true, width: 'w-24' },
        { key: 'age', label: 'Age', enabled: true, sortable: true, width: 'w-20' },
        { key: 'classSection', label: 'Class/Sections', enabled: true, sortable: true, width: 'w-32' },
        { key: 'bmi', label: 'BMI', enabled: true, sortable: true, width: 'w-24' },
        { key: 'overallScore', label: 'Overall Score', enabled: true, sortable: true, width: 'w-32' },
        { key: 'pushup', label: 'Pushup (30s)', enabled: true, sortable: true, width: 'w-32' },
        { key: 'plank', label: '60s Plank (secs)', enabled: true, sortable: true, width: 'w-36' },
        { key: 'memory', label: 'Memory', enabled: true, sortable: true, width: 'w-28' },
        { key: 'concentration', label: 'Concentration', enabled: true, sortable: true, width: 'w-32' },
        { key: 'speed', label: 'Speed', enabled: true, sortable: true, width: 'w-24' },
        { key: 'coreBalance', label: 'Core Balance', enabled: true, sortable: true, width: 'w-32' },
        { key: 'bodyControl', label: 'Body Control', enabled: true, sortable: true, width: 'w-32' },
      ]
    }
  },
  army: {
    type: 'army',
    theme: {
      primary_500: '#8A2BE2', // Purple
      secondary_400: '#FFD700', // Gold
      neutral_40: '#A9A9A9',
      neutral_10: '#F5F5DC',
      background: '#ffffff',
      foreground: '#171717',
      neutral_80: '#808080',
      neutral_30: '#D0D0D0',
      background_hover: '#f2f2f2',
      neutral_800: '#101010',
      error_500: '#F53D3D',
      primary_600: '#6A5ACD',
      neutral_200: '#505050',
      neutral_20: '#E0E0E0',
      neutral_500: '#2a2a2a',
      neutral_600: '#202020',
      neutral_400: '#303030',
      neutral_700: '#1A1A1A',
      neutral_100: '#606060',
      primary_100: '#E6E6FA',
      primary_400: '#9370DB',
    },
    terminology: {
      dashboard: 'Military Operations Dashboard',
      schools: 'Branches',
      home: 'Headquarters',
      institution: 'Branch',
      students: 'Service Members',
      maleStudents: 'Male Service Members',
      femaleStudents: 'Female Service Members',
      paidStudents: 'Active Duty',
      unpaidStudents: 'Reserves',
      totalCount: 'Total Service Members',
      tablePrimaryFilter: 'Unit',
      tableSecondaryFilter: 'Status',
      tableTitle: 'Service Members',
      overviewTitle: 'Operations Overview',
    },
    filters: {
      filters: [
        { key: 'overview1', value: 'Std.one', label: 'Infantry' },
        { key: 'overview1', value: 'Std.two', label: 'Artillery' },
        { key: 'overview1', value: 'Std.three', label: 'Cavalry' },
        { key: 'overview1', value: 'Std.four', label: 'Engineers' },
        { key: 'overview1', value: 'Std.five', label: 'Logistics' },
        { key: 'overview1', value: 'Std.six', label: 'Medical' },
        { key: 'overview1', value: 'Std.seven', label: 'Aviation' },
        { key: 'overview1', value: 'Std.eight', label: 'Special Forces' },
        { key: 'overview1', value: 'Std.nine', label: 'Cyber Warfare' },
        { key: 'overview1', value: 'Std.ten', label: 'Military Police' },
        { key: 'overview1', value: 'Std.eleven', label: 'Intelligence' },
        { key: 'overview1', value: 'Std.twelve', label: 'Signal Corps' },
        // Overview2
        { key: 'overview2', value: 'Section.a', label: 'Deployed' },
        { key: 'overview2', value: 'Section.b', label: 'Training' },
        { key: 'overview2', value: 'Section.c', label: 'Garrison' },
        { key: 'overview2', value: 'Section.d', label: 'Leave' },
        { key: 'overview3', value: 'active', label: 'Active Duty' },
        { key: 'overview3', value: 'inactive', label: 'Reserves' },
        { key: 'overview3', value: 'training', label: 'In Training' },
        // Sidebar filters (same as school)
        { key: 'sidebar_gender', value: 'Gender.Male', label: 'Male' },
        { key: 'sidebar_gender', value: 'Gender.Female', label: 'Female' },
        { key: 'sidebar_payment', value: 'PaymentStatus.paid', label: 'Active Duty' },
        { key: 'sidebar_payment', value: 'PaymentStatus.unpaid', label: 'Reserves' },
        { key: 'sidebar_bmi', value: 'underweight', label: 'Underweight' },
        { key: 'sidebar_bmi', value: 'normal', label: 'Normal' },
        { key: 'sidebar_bmi', value: 'overweight', label: 'Overweight' },
        { key: 'sidebar_bmi', value: 'obese_class_1', label: 'Obese (Class 1)' },
        { key: 'sidebar_bmi', value: 'obese_class_2', label: 'Obese (Class 2)' },
        { key: 'sidebar_bmi', value: 'obese_class_3', label: 'Obese (Class 3)' },
      ]
    },
    tableConfig: {
      columns: [
        { key: 'rowNumber', label: '#', enabled: true, sortable: false, width: 'w-16' },
        { key: 'name', label: 'Service Member Name', enabled: true, sortable: true, width: 'w-40' },
        { key: 'paymentStatus', label: 'Status', enabled: true, sortable: true, width: 'w-32' },
        { key: 'gender', label: 'Gender', enabled: true, sortable: true, width: 'w-24' },
        { key: 'age', label: 'Age', enabled: true, sortable: true, width: 'w-20' },
        { key: 'classSection', label: 'Unit/Deployment', enabled: true, sortable: true, width: 'w-32' },
        { key: 'bmi', label: 'Fitness Index', enabled: true, sortable: true, width: 'w-24' },
        { key: 'overallScore', label: 'Mission Readiness Score', enabled: true, sortable: true, width: 'w-32' },
        { key: 'pushup', label: 'Pushup (30s)', enabled: true, sortable: true, width: 'w-32' },
        { key: 'plank', label: '60s Plank (secs)', enabled: true, sortable: true, width: 'w-36' },
        { key: 'memory', label: 'Tactical Memory', enabled: true, sortable: true, width: 'w-28' },
        { key: 'concentration', label: 'Situational Awareness', enabled: true, sortable: true, width: 'w-32' },
        { key: 'speed', label: 'Reaction Speed', enabled: true, sortable: true, width: 'w-24' },
        { key: 'coreBalance', label: 'Stability', enabled: true, sortable: true, width: 'w-32' },
        { key: 'bodyControl', label: 'Agility', enabled: true, sortable: true, width: 'w-32' },
      ]
    }
  },
  academy: {
    type: 'academy',
    theme: {
      primary_500: '#1E90FF', // Dodger Blue
      secondary_400: '#ADFF2F', // GreenYellow
      neutral_40: '#D3D3D3',
      neutral_10: '#F0F8FF',
      background: '#ffffff',
      foreground: '#171717',
      neutral_80: '#808080',
      neutral_30: '#D0D0D0',
      background_hover: '#f2f2f2',
      neutral_800: '#101010',
      error_500: '#F53D3D',
      primary_600: '#4682B4',
      neutral_200: '#505050',
      neutral_20: '#E0E0E0',
      neutral_500: '#2a2a2a',
      neutral_600: '#202020',
      neutral_400: '#303030',
      neutral_700: '#1A1A1A',
      neutral_100: '#606060',
      primary_100: '#ADD8E6',
      primary_400: '#6495ED',
    },
    terminology: {
      dashboard: 'Training Academy Dashboard',
      schools: 'Departments',
      home: 'Academy Hub',
      institution: 'Department',
      students: 'Trainees',
      maleStudents: 'Male Trainees',
      femaleStudents: 'Female Trainees',
      paidStudents: 'Certified Trainees',
      unpaidStudents: 'Pending Certification',
      totalCount: 'Total Trainees',
      tablePrimaryFilter: 'Course',
      tableSecondaryFilter: 'Batch',
      tableTitle: 'Trainees',
      overviewTitle: 'Training Overview',
    },
    filters: {
      filters: [
        { key: 'overview1', value: 'Std.one', label: 'Foundation Course' },
        { key: 'overview1', value: 'Std.two', label: 'Advanced Course' },
        { key: 'overview1', value: 'Std.three', label: 'Specialization Course A' },
        { key: 'overview1', value: 'Std.four', label: 'Specialization Course B' },
        { key: 'overview1', value: 'Std.five', label: 'Specialization Course C' },
        { key: 'overview1', value: 'Std.six', label: 'Leadership Training' },
        { key: 'overview1', value: 'Std.seven', label: 'Practical Skills' },
        { key: 'overview1', value: 'Std.eight', label: 'Theoretical Studies' },
        { key: 'overview1', value: 'Std.nine', label: 'Project Work' },
        { key: 'overview1', value: 'Std.ten', label: 'Module 101' },
        { key: 'overview1', value: 'Std.eleven', label: 'Module 102' },
        { key: 'overview1', value: 'Std.twelve', label: 'Module 103' },
        { key: 'overview2', value: 'Section.a', label: 'Batch 2023A' },
        { key: 'overview2', value: 'Section.b', label: 'Batch 2023B' },
        { key: 'overview2', value: 'Section.c', label: 'Batch 2024A' },
        { key: 'overview2', value: 'Section.d', label: 'Batch 2024B' },
      ]
    },
    tableConfig: {
      columns: [
        { key: 'rowNumber', label: '#', enabled: true, sortable: false, width: 'w-16' },
        { key: 'name', label: 'Trainee Name', enabled: true, sortable: true, width: 'w-40' },
        { key: 'paymentStatus', label: 'Certification Status', enabled: true, sortable: true, width: 'w-32' },
        { key: 'gender', label: 'Gender', enabled: true, sortable: true, width: 'w-24' },
        { key: 'age', label: 'Age', enabled: true, sortable: true, width: 'w-20' },
        { key: 'classSection', label: 'Course/Batch', enabled: true, sortable: true, width: 'w-32' },
        { key: 'bmi', label: 'Health Index', enabled: false, sortable: true, width: 'w-24' },
        { key: 'overallScore', label: 'Training Score', enabled: true, sortable: true, width: 'w-32' },
        { key: 'pushup', label: 'Practical Exam (1)', enabled: false, sortable: true, width: 'w-32' },
        { key: 'plank', label: 'Practical Exam (2)', enabled: false, sortable: true, width: 'w-36' },
        { key: 'memory', label: 'Cognitive Ability', enabled: true, sortable: true, width: 'w-28' },
        { key: 'concentration', label: 'Focus & Attention', enabled: true, sortable: true, width: 'w-32' },
        { key: 'speed', label: 'Processing Speed', enabled: true, sortable: true, width: 'w-24' },
        { key: 'coreBalance', label: 'Problem Solving', enabled: true, sortable: true, width: 'w-32' },
        { key: 'bodyControl', label: 'Adaptability', enabled: true, sortable: true, width: 'w-32' },
      ]
    }
  },
};

export function getDashboardConfig(userType: DashboardType): DashboardConfig {
  const config = DASHBOARD_CONFIGS[userType];
  return config;
} 