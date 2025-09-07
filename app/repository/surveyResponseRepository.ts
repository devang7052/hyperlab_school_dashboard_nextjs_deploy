import { collection, getDocs, query, where, limit, orderBy, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "../lib/firebase";
import { RawSurveyResponse } from "../models/surveyResponse";
import { COLLECTION_NAMES } from "../utils/formatters";

export class SurveyResponseRepository {
  private readonly collectionName = COLLECTION_NAMES.SURVEY_RESPONSES;

  private convertToSurveyResponse(doc: QueryDocumentSnapshot<DocumentData>): RawSurveyResponse {
    const data = doc.data();
    
    return {
      formId: data.formId || '',
      submittedBy: data.submittedBy || '',
      answers: data.answers || [],
      language: data.language,
      createdAt: data.createdAt || { _seconds: 0, _nanoseconds: 0 },
      updatedAt: data.updatedAt || { _seconds: 0, _nanoseconds: 0 },
      firestore_id: doc.id
    };
  }

  async getAllSurveyResponses(limitCount?: number): Promise<RawSurveyResponse[]> {
    try {
      const surveyResponsesRef = collection(db, this.collectionName);
      const q = limitCount 
        ? query(surveyResponsesRef, orderBy("createdAt", "desc"), limit(limitCount))
        : query(surveyResponsesRef, orderBy("createdAt", "desc"));
        
      const querySnapshot = await getDocs(q);

      console.log('getAllSurveyResponses - Found docs:', querySnapshot.docs.length);

      if (querySnapshot.empty) return [];

      return querySnapshot.docs.map(doc => this.convertToSurveyResponse(doc));
    } catch (error) {
      console.error('Error fetching survey responses:', error);
      throw new Error(`Failed to fetch survey responses: ${error}`);
    }
  }

  async getSurveyResponsesByFormId(formId: string, limitCount?: number): Promise<RawSurveyResponse[]> {
    try {
      const surveyResponsesRef = collection(db, this.collectionName);
      // Temporarily removed orderBy to avoid index requirement
      // TODO: Re-add orderBy("createdAt", "desc") after creating the composite index
      const q = limitCount
        ? query(
            surveyResponsesRef,
            where("formId", "==", formId),
            limit(limitCount)
          )
        : query(
            surveyResponsesRef,
            where("formId", "==", formId)
          );
        
      const querySnapshot = await getDocs(q);

      console.log('getSurveyResponsesByFormId - Found docs:', querySnapshot.docs.length);
      console.log('Filtering by formId:', formId);
      
      // Log filtered document IDs and formIds for debugging
      querySnapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log(`Filtered Doc ${index + 1}:`, {
          id: doc.id,
          formId: data.formId,
          submittedBy: data.submittedBy
        });
      });

      if (querySnapshot.empty) return [];

      return querySnapshot.docs.map(doc => this.convertToSurveyResponse(doc));
    } catch (error) {
      console.error('Error fetching survey responses by form ID:', error);
      throw new Error(`Failed to fetch survey responses for form ${formId}: ${error}`);
    }
  }
}
