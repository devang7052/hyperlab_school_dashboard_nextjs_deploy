import { collection, getDocs, query, where, documentId, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { SchoolInstitute, DashboardType } from "../models/schoolInstitute";
import { COLLECTION_NAMES } from "../utils/formatters";
import { db } from "../lib/firebase";

export class SchoolInstituteRepository {
  private readonly collectionName = COLLECTION_NAMES.SCHOOL_INSTITUTES;

  private convertToSchoolInstitute(doc: QueryDocumentSnapshot<DocumentData>): SchoolInstitute {
    const data = doc.data();
    
    return {
      id: doc.id,
      apiKey: data.apiKey || '',
      code: data.code || '',
      email: data.email || '',
      femaleCount: data.femaleCount || 0,
      maleCount: data.maleCount || 0,
      name: data.name || '',
      paymentCount: data.paymentCount || 0,
      userType: (data.userType as DashboardType) || 'school', // Default to school if not set
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    };
  }

  async getByEmail(email: string): Promise<SchoolInstitute | null> {
    try {
      const institutesRef = collection(db, this.collectionName);
      const q = query(institutesRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return null;
      
      return this.convertToSchoolInstitute(querySnapshot.docs[0]);
    } catch (error) {
      console.error('Error fetching school institute:', error);
      throw error;
    }
  }

  async getByIds(schoolIds: string[]): Promise<SchoolInstitute[]> {
    try {
      if (schoolIds.length === 0) return [];
      
      const institutesRef = collection(db, this.collectionName);
      const q = query(institutesRef, where(documentId(), 'in', schoolIds));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => this.convertToSchoolInstitute(doc));
    } catch (error) {
      console.error('Error fetching school institutes by IDs:', error);
      throw error;
    }
  }
} 