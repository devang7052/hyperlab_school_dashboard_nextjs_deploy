import { collection, getDocs, query, where, limit, startAfter, doc, getDoc, updateDoc, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

import { db } from "../lib/firebase";
import { SchoolStudent, PaymentStatus } from "../models/schoolStudent";
import { COLLECTION_NAMES } from "../utils/formatters";

export class SchoolStudentRepository {
    private readonly collectionName = COLLECTION_NAMES.SCHOOL_STUDENTS;

    private convertToStudent(doc: QueryDocumentSnapshot<DocumentData> | DocumentData): SchoolStudent {
      const data = 'data' in doc ? doc.data() : doc;
      const id = 'id' in doc ? doc.id : '';
      
      return {
        id,
        name: data.name || '',
        email: data.email || '',
        gender: data.gender || '',
        dateOfBirth: data.dateOfBirth?.toDate() || '',
        grade: data.grade || '',
        instituteId: data.instituteId || '',
        isOnBoarded: Boolean(data.isOnBoarded),
        paymentStatus: data.paymentStatus || '',
        qrCode: data.qrCode || '',
        rfid: data.rfid || '',
        sId: data.sId || '',
        section: data.section || null,
        std: data.std || null,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      };
    }



  async getSchoolStudentsByInstituteIdAndStdWithLimit(
    instituteId: string,
    std: string,
    limitCount: number
  ): Promise<SchoolStudent[]> {
    try {
      const schoolStudentsRef = collection(db, this.collectionName);
      const q = query(
        schoolStudentsRef,
        where("instituteId", "==", instituteId),
        where("std", "==", std),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return [];

      return querySnapshot.docs.map(doc => this.convertToStudent(doc));
    } catch (error) {
      console.error("Error fetching school students with limit:", error);
      throw error;
    }
  }

  async getSchoolStudentsByInstituteIdAndStdPaginated(
    instituteId: string,
    std: string,
    limitCount: number,
    lastStudentId: string
  ): Promise<SchoolStudent[]> {
    try {
      const schoolStudentsRef = collection(db, this.collectionName);
      // First, get the document corresponding to lastStudentId to use as a cursor
      const lastDocQuery = query(
        schoolStudentsRef,
        where("sId", "==", lastStudentId),
        where("instituteId", "==", instituteId),
        where("std", "==", std)
      );
      const lastDocSnapshot = await getDocs(lastDocQuery);

      if (lastDocSnapshot.empty) {
        console.warn(`Last student with sId ${lastStudentId} not found. Fetching from start.`);
        // Fallback to fetching from the beginning if cursor is invalid
        return this.getSchoolStudentsByInstituteIdAndStdWithLimit(instituteId, std, limitCount);
      }

      const lastVisible = lastDocSnapshot.docs[0];

      const q = query(
        schoolStudentsRef,
        where("instituteId", "==", instituteId),
        where("std", "==", std),
        startAfter(lastVisible),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return [];

      return querySnapshot.docs.map(doc => this.convertToStudent(doc));
    } catch (error) {
      console.error("Error fetching paginated school students:", error);
      throw error;
    }
  }

  async getStudentById(studentId: string): Promise<SchoolStudent | null> {
    try {
      const studentDocRef = doc(db, this.collectionName, studentId);
      const docSnapshot = await getDoc(studentDocRef);
      
      if (!docSnapshot.exists()) {
        return null;
      }
      
      return this.convertToStudent(docSnapshot);
    } catch (error) {
      console.error("Error fetching student by ID:", error);
      throw error;
    }
  }

  async updatePaymentStatus(
    studentId: string,
    paymentStatus: PaymentStatus
  ): Promise<void> {
    try {
      const studentDocRef = doc(db, this.collectionName, studentId);
      await updateDoc(studentDocRef, {
        paymentStatus: paymentStatus,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw error;
    }
  }
}