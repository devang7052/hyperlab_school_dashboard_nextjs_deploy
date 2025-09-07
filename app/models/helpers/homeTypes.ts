import { DashboardType } from "../schoolInstitute";

export interface ConnectedSchool {
    id: string;
    name: string;
    email: string;
}
export interface ClassStats {
class_male_avg_score: number;
class_female_avg_score: number;
class_total_avg_score: number;
class_male_max_score: number;
class_female_max_score: number;
class_total_max_score: number;
class_male_count: number;
class_female_count: number;
}

export interface TestData {
[className: string]: ClassStats;
}

export interface HomeTestData {
[testName: string]: TestData;
}

export interface StudentStats {
totalStudents: number;
boys: number;
girls: number;
paidStudents: number;
unpaidStudents: number;
schoolName: string;
userType: DashboardType;
instituteId: string;
}
