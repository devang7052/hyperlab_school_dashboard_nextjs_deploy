// Raw survey response interface that matches the actual Firebase data structure

export interface SurveyAnswer {
  questionId: string;
  answer: string[];
}

export interface FirebaseTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export interface RawSurveyResponse {
  formId: string;
  submittedBy: string;
  answers: SurveyAnswer[];
  language?: string;
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
  firestore_id: string;
}

// Mapping constants for converting raw survey responses to normalized data
export const SCHOOL_BOARD_MAPPING: Record<string, string> = {
  "State Board govt funded": "SchoolType.government",
  "State Board self funded": "SchoolType.private",
  ICSE: "SchoolType.private",
  CBSE: "SchoolType.private",
  IB: "SchoolType.private",
  IGCSE: "SchoolType.private",
};

export const CASTE_MAPPING: Record<string, string> = {
  "Scheduled Tribe": "CasteCommunity.st",
  "Scheduled Caste": "CasteCommunity.sc",
  General: "CasteCommunity.general",
  "Don't know": "CasteCommunity.general",
  "Other:": "CasteCommunity.general",
};

export const RELIGION_MAPPING: Record<string, string> = {
  Hindu: "Religion.hindu",
  Muslim: "Religion.muslim",
  Christian: "Religion.christian",
  Sikh: "Religion.other",
  Jain: "Religion.other",
  Buddhist: "Religion.other",
  "Don't know": "Religion.other",
  "Other:": "Religion.other",
};

export const OCCUPATION_MAPPING: Record<string, string> = {
  "Government Service": "ParentalOccupation.formal",
  "Private Job": "ParentalOccupation.formal",
  Business: "ParentalOccupation.formal",
  "Daily Wage / Labor": "ParentalOccupation.informal",
  Farmer: "ParentalOccupation.informal",
  Homemaker: "ParentalOccupation.unemployed",
  Unemployed: "ParentalOccupation.unemployed",
  "Don't Know": "ParentalOccupation.unemployed",
  Other: "ParentalOccupation.informal",
};

export const SPORTS_FREQUENCY_MAPPING: Record<string, string> = {
  Daily: "SportsFrequency.daily",
  "Few times a week": "SportsFrequency.weekly",
  "Once a week": "SportsFrequency.weekly",
  Rarely: "SportsFrequency.monthly",
  "": "SportsFrequency.none",
};

// Helper function to extract answer from survey responses
export const getAnswerByQuestionId = (
  answers: SurveyAnswer[],
  questionId: string
): string | undefined => {
  const answer = answers.find((a) => a.questionId === questionId);
  return answer?.answer?.[0] || undefined;
};

// Get multi-select answers as string array
export const getAnswersByQuestionId = (
  answers: SurveyAnswer[],
  questionId: string
): string[] => {
  const answer = answers.find((a) => a.questionId === questionId);
  return answer?.answer || [];
};

// Helper function to convert Firebase timestamp to Date
export const convertFirebaseTimestamp = (
  timestamp: FirebaseTimestamp
): Date => {
  return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
};
