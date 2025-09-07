import { collection, getDocs, query, where, updateDoc, doc, setDoc, arrayUnion, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "../lib/firebase";
import { SchoolConnection } from "../models/schoolConnection";
import { COLLECTION_NAMES } from "../utils/formatters";

export class SchoolConnectionRepository {
  private readonly collectionName = COLLECTION_NAMES.SCHOOL_CONNECTION;

  private convertToSchoolConnection(doc: QueryDocumentSnapshot<DocumentData>): SchoolConnection {
    const data = doc.data();

    return {
      createdAt: data.createdAt,
      parentId: data.parentId || '',
      schoolIds: data.schoolIds || [],
      updatedAt: data.updatedAt,
    };
  }

  async getSchoolConnectionByParentId(parentId: string): Promise<SchoolConnection | null> {
    try {
      const schoolConnectionRef = collection(db, this.collectionName);
      const q = query(
        schoolConnectionRef,
        where("parentId", "==", parentId)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return null;

      return this.convertToSchoolConnection(querySnapshot.docs[0]);
    } catch (error) {
      console.error("Error fetching school connection:", error);
      throw error;
    }
  }

  async isSchoolAlreadyConnected(parentId: string, schoolId: string): Promise<boolean> {
    try {
      const schoolConnection = await this.getSchoolConnectionByParentId(parentId);
      
      if (!schoolConnection) {
        return false;
      }
      
      return schoolConnection.schoolIds.includes(schoolId);
    } catch (error) {
      console.error("Error checking if school is already connected:", error);
      throw error;
    }
  }

  async addOrUpdateSchoolConnection(parentId: string, connectedSchoolId: string): Promise<void> {
    try {
      const schoolConnectionRef = collection(db, this.collectionName);
      const q = query(
        schoolConnectionRef,
        where("parentId", "==", parentId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Document exists, update it
        const docRef = doc(db, this.collectionName, querySnapshot.docs[0].id);
        await updateDoc(docRef, {
          schoolIds: arrayUnion(connectedSchoolId),
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Document does not exist, create a new one
        const newDocRef = doc(schoolConnectionRef); // Firestore will auto-generate an ID
        await setDoc(newDocRef, {
          parentId: parentId,
          schoolIds: [connectedSchoolId],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error adding or updating school connection:", error);
      throw error;
    }
  }
} 