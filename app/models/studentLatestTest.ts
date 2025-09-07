export interface StudentLatestTest {
  score: {
    bmi: number;
    bodyControl: number;
    chimpTest: number;
    concentration: number;
    coreBalance: number;
    fatigue: number;
    plank: number;
    pushup: number;
    overallScore: number;
  };
  studentId: string;
  updatedAt: string; // Assuming updatedAt is stored as an ISO string
} 