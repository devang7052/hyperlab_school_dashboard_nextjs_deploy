// app/models/khelegySurvey.ts

export enum AgeGroup {
  EIGHT_TO_TWELVE = "AgeGroup.8to12",
  TWELVE_TO_SEVENTEEN = "AgeGroup.12to17", 
  EIGHTEEN_TO_TWENTYSEVEN = "AgeGroup.18to27",
  PARENT = "AgeGroup.parent"
}

// School types are now stored as raw survey values instead of enums
export type SchoolType = 
  | "State Board govt funded"
  | "State Board self funded" 
  | "ICSE"
  | "CBSE"
  | "IB"
  | "IGCSE";

export enum ClassGradeLevel {
  PRIMARY = "ClassGradeLevel.primary",
  MIDDLE = "ClassGradeLevel.middle",
  SECONDARY = "ClassGradeLevel.secondary",
  BOARD_YEARS = "ClassGradeLevel.boardYears",
}

// Religion types are now stored as raw survey values instead of enums
export type Religion = 
  | "Hindu"
  | "Muslim"
  | "Christian"
  | "Sikh"
  | "Jain"
  | "Buddhist"
  | "Don't know"
  | "Other:";

// Caste/Community types are now stored as raw survey values instead of enums
export type CasteCommunity = 
  | "Scheduled Tribe"
  | "Scheduled Caste"
  | "General"
  | "Don't know"
  | "Other:";

// Parental education types are now stored as raw survey values instead of enums
export type ParentalEducation = 
  | "No formal education"
  | "Primary (1st-5th)"
  | "Secondary (6th–10th)"
  | "Higher secondary (11th–12th)"
  | "Graduate"
  | "Postgraduate";

// Parental occupation types are now stored as raw survey values instead of enums
export type ParentalOccupation = 
  | "Government Service"
  | "Private Job"
  | "Daily Wage / Labor"
  | "Business"
  | "Farmer"
  | "Homemaker"
  | "Unemployed"
  | "Don't Know"
  | "Other";

// Sports participation status types are now stored as raw descriptive values
export type SportsParticipationStatus = 
  | "Active/Regular"
  | "Active/Irregular"
  | "Dropout"
  | "Returnee"
  | "Never played"
  | "Cannot determine";

export enum SportsFrequency {
  DAILY = "SportsFrequency.daily",
  WEEKLY = "SportsFrequency.weekly",
  MONTHLY = "SportsFrequency.monthly",
  NONE = "SportsFrequency.none",
}

// Menarche status types are now stored as raw descriptive values
export type MenarcheStatus = 
  | "Pre-menarche"
  | "Post-menarche"
  | "None";

// Menstrual product types are now stored as raw survey values
export type MenstrualProductUse = 
  | "Sanitary Pads"
  | "Cloth"
  | "Menstrual Cup"
  | "Tampon"
  | "Period Panties"
  | "Nothing"
  | "Other:";

export enum YesNo {
  YES = "YesNo.yes",
  NO = "YesNo.no",
}

export enum Quartile {
  Q1 = "Quartile.q1",
  Q2 = "Quartile.q2",
  Q3 = "Quartile.q3",
  Q4 = "Quartile.q4",
}

export enum FatigueSlope {
  IMPROVING = "FatigueSlope.improving",
  STABLE = "FatigueSlope.stable",
  DECLINING = "FatigueSlope.declining",
}

export interface KhelegySurveyResponse {
  id?: string;
  respondentId: string;
  name: string;
  email?: string;

  // Demographics
  ageGroup: AgeGroup;
  schoolType: SchoolType;
  classGradeLevel: ClassGradeLevel;
  religion: Religion;
  casteCommunity?: CasteCommunity; // Optional for ethical reasons
  parentalEducation: ParentalEducation;
  parentalOccupation: ParentalOccupation;

  // Sports Participation
  sportsParticipationStatus: SportsParticipationStatus;
  sportsFrequency: SportsFrequency;

  // Menstrual Health (for female respondents)
  menarcheStatus?: MenarcheStatus;
  menstrualProductUse?: MenstrualProductUse;
  // Metadata
  surveyCompletedAt: Date;
  instituteId: string;
  createdAt: Date;
  updatedAt: Date;
}
