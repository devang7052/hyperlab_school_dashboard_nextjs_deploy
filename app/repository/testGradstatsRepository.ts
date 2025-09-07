import { collection, query, where, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { TestGradstats } from '../models/testGradstats';
import { db } from '../lib/firebase';
import { COLLECTION_NAMES } from '../utils/formatters';

export class TestGradstatsRepository {
  private readonly collectionName = COLLECTION_NAMES.TEST_GRADSTATS; // Changed to match actual collection name

  private convertToTestGradstats(doc: QueryDocumentSnapshot<DocumentData>): TestGradstats {
    const data = doc.data();
    return {
      avgScore: data.avgScore || 0,
      count: data.count || 0,
      gender: data.gender || '',
      instituteId: data.instituteId || '',
      maxScore: data.maxScore || 0,
      std: data.std || '',
      test: data.test || '',
      updatedAt: data.updatedAt?.toDate(),
    };
  }

  async getByInstituteId(instituteId: string): Promise<TestGradstats[]> {
    try {
      const gradstatsRef = collection(db, this.collectionName);
      const q = query(gradstatsRef, where('instituteId', '==', instituteId));
      const querySnapshot = await getDocs(q);
      
      const gradstats: TestGradstats[] = [];
      querySnapshot.forEach((doc) => {
        gradstats.push(this.convertToTestGradstats(doc));
      });
      return gradstats;
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error; // Re-throw to allow calling context to handle
    }
  }
} 