import { collection, getDocs, query, where, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "../lib/firebase";
import { StudentLatestTest } from "../models/studentLatestTest";
import { COLLECTION_NAMES, TEST_NAMES } from "../utils/formatters";

export class StudentLatestTestRepository {
  private readonly collectionName = COLLECTION_NAMES.STUDENT_LATEST_TESTS;

  private convertToStudentLatestTest(doc: QueryDocumentSnapshot<DocumentData>): StudentLatestTest {
    const data = doc.data();
    console.log(data);
    return {
      score: {
        bmi: data.score['Tests.bmi'] || 0,
        bodyControl: data.score[TEST_NAMES.BODY_CONTROL] || 0,
        chimpTest: data.score[TEST_NAMES.CHIMP_TEST] || 0,
        concentration: data.score[TEST_NAMES.CONCENTRATION] || 0,
        coreBalance: data.score[TEST_NAMES.CORE_BALANCE] || 0,
        fatigue: data.score[TEST_NAMES.FATIGUE] || 0,
        plank: data.score[TEST_NAMES.PLANK] || 0,
        pushup: data.score[TEST_NAMES.PUSHUP] || 0,
        overallScore: data.score[TEST_NAMES.OVERALL_SCORE] || 0
      },
      studentId: data.studentId,
      updatedAt: data.updatedAt,
    };
  }

  async getStudentLatestTestByStudentId(studentId: string): Promise<StudentLatestTest | null> {
    try {
      const studentLatestTestRef = collection(db, this.collectionName);
      const q = query(
        studentLatestTestRef,
        where("studentId", "==", studentId)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      return this.convertToStudentLatestTest(querySnapshot.docs[0]);
    } catch (error) {
      console.error("Error fetching student latest test:", error);
      throw error;
    }
  }
} 