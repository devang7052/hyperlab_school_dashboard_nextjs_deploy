// app/models/schoolInstitute.ts
export type DashboardType = 'school' | 'army' | 'academy';

export interface SchoolInstitute {
    id?: string;
    apiKey: string;
    code: string;
    email: string;
    femaleCount: number;
    maleCount: number;
    name: string;
    paymentCount: number;
    userType: DashboardType;
    createdAt: Date;
    updatedAt: Date;
  }