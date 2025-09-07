import { DashboardConfig } from '@/app/utils/dashboardConfig';
import React from 'react';

interface StudentStats {
  totalStudents: number;
  boys: number;
  girls: number;
  paidStudents: number;
  unpaidStudents: number;
  schoolName: string;
  userType: string;
}

interface StudentStatisticsCardsProps {
  studentStats: StudentStats;
  config: DashboardConfig;
}

const StudentStatisticsCards: React.FC<StudentStatisticsCardsProps> = ({ studentStats, config }) => {
  return (
    <div className="flex items-center justify-around bg-[var(--neutral-10)] p-6 rounded-2xl shadow mb-8 mt-12 ">
      <div className="text-left px-4 py-2">
        <h3 className="text-md font-['MADE_Outer_Sans_Light'] text-[var(--neutral-500)] mb-4">{config.terminology.totalCount}</h3>
        <p className="text-4xl font-['MADE_Outer_Sans_Light'] text-[var(--primary-500)]">{studentStats.totalStudents}</p>
      </div>
      <div className="h-16 w-px bg-[var(--neutral-30)] mx-4"></div>
      <div className="text-left px-4 py-2">
        <h3 className="text-md font-['MADE_Outer_Sans_Light'] text-[var(--neutral-500)] mb-4">{config.terminology.maleStudents}</h3>
        <p className="text-4xl font-['MADE_Outer_Sans_Light'] text-[var(--neutral-400)] ">{studentStats.boys}</p>
      </div>
      <div className="h-16 w-px bg-[var(--neutral-30)] mx-4"></div>
      <div className="text-left px-4 py-2">
        <h3 className="text-md font-['MADE_Outer_Sans_Light'] text-[var(--neutral-500)] mb-4">{config.terminology.femaleStudents}</h3>
        <p className="text-4xl font-['MADE_Outer_Sans_Light'] text-[var(--neutral-400)]">{studentStats.girls}</p>
      </div>
      <div className="h-16 w-px bg-[var(--neutral-30)] mx-4"></div>
      <div className="text-left px-4 py-2">
        <h3 className="text-md font-['MADE_Outer_Sans_Light'] text-[var(--neutral-500)] mb-4">{config.terminology.paidStudents}</h3>
        <p className="text-4xl font-['MADE_Outer_Sans_Light'] text-[var(--neutral-400)]">{studentStats.paidStudents}</p>
      </div>
      <div className="h-16 w-px bg-[var(--neutral-30)] mx-4"></div>
      <div className="text-left px-4 py-2">
        <h3 className="text-md font-['MADE_Outer_Sans_Light'] text-[var(--neutral-500)] mb-4">{config.terminology.unpaidStudents}</h3>
        <p className="text-4xl font-['MADE_Outer_Sans_Light'] text-[var(--neutral-400)]">{studentStats.unpaidStudents}</p>
      </div>
    </div>
  );
};

export default StudentStatisticsCards; 