import { SurveyResponseRepository } from "../repository/surveyResponseRepository";
import { SchoolStudentRepository } from "../repository/schoolStudentRepository";
import { 
  RawSurveyResponse, 
  getAnswerByQuestionId, 
  convertFirebaseTimestamp,
  // SCHOOL_BOARD_MAPPING, // Unused for now
  // CASTE_MAPPING, // Unused for now  
  // RELIGION_MAPPING, // Unused for now
  // OCCUPATION_MAPPING, // Unused for now
  SPORTS_FREQUENCY_MAPPING
} from "../models/surveyResponse";
import { KhelegySurveyResponse, SchoolType, Religion, CasteCommunity, ParentalEducation, ParentalOccupation, SportsParticipationStatus, MenarcheStatus, MenstrualProductUse, AgeGroup, SportsFrequency, ClassGradeLevel } from "../models/khelegySurvey";
import { SchoolStudent } from "../models/schoolStudent";

export interface KhelegiSurveyData {
  surveys: KhelegySurveyResponse[];
  totalCount: number;
}

export class KhelegiService {
  private surveyResponseRepository: SurveyResponseRepository;
  private schoolStudentRepository: SchoolStudentRepository;

  constructor() {
    this.surveyResponseRepository = new SurveyResponseRepository();
    this.schoolStudentRepository = new SchoolStudentRepository();
  }

  private mapRawResponseToKhelegySurvey(rawResponse: RawSurveyResponse, student?: SchoolStudent | null): KhelegySurveyResponse | null {
    try {
      const answers = rawResponse.answers;
      
      // Extract basic info - use student data if available, otherwise survey data
      const schoolName = getAnswerByQuestionId(answers, "school_name") || "Unknown School";
      const respondentName = student ? student.name : 
        (rawResponse.submittedBy === "anonymous" ? "Anonymous Student" : `Student from ${schoolName}`);
      
      // Get school board directly (no mapping to simplified categories)
      const schoolBoard = getAnswerByQuestionId(answers, "school_board");
      const schoolType = schoolBoard || "State Board govt funded"; // Default to most common type
      
      // Determine age group based on formId
      let ageGroup = "AgeGroup.18to27"; // Default
      console.log(`Processing formId: ${rawResponse.formId}`);
      
      switch (rawResponse.formId) {
        case "Af4Q5nndk6EmIVmTNTBA":
          ageGroup = "AgeGroup.8to12"; // 8-12 years
          console.log(`Assigned age group: 8-12 years`);
          break;
        case "B5Rhj1fjJueeLfdhGSzi":
        case "gDzIfMh3tRx8SFk04lk1":
          ageGroup = "AgeGroup.12to17"; // 12-17 years
          console.log(`Assigned age group: 12-17 years`);
          break;
        case "mFoyJe1WWpU3qfzrBx7B":
          ageGroup = "AgeGroup.parent"; // Parent
          console.log(`Assigned age group: Parent`);
          break;
        default:
          ageGroup = "AgeGroup.18to27"; // 18-27 years (default for unknown formIds)
          console.log(`Assigned age group: 18-27 years (default)`);
          break;
      }
      
      // Determine class grade level based on age group
      let classGradeLevel = "ClassGradeLevel.middle"; // Default
      switch (ageGroup) {
        case "AgeGroup.8to12":
          classGradeLevel = "ClassGradeLevel.primary"; // Classes 1-5
          break;
        case "AgeGroup.12to17":
          classGradeLevel = "ClassGradeLevel.secondary"; // Classes 6-10
          break;
        case "AgeGroup.18to27":
          classGradeLevel = "ClassGradeLevel.boardYears"; // Classes 11-12
          break;
        case "AgeGroup.parent":
          classGradeLevel = "ClassGradeLevel.secondary"; // Default for parents
          break;
        default:
          classGradeLevel = "ClassGradeLevel.middle";
          break;
      }
      
      // Get religion directly (no mapping to simplified categories)
      const religion = getAnswerByQuestionId(answers, "personal_religion");
      const mappedReligion = religion || "Hindu"; // Default to most common
      
      // Get caste/community directly (no mapping to simplified categories)
      const caste = getAnswerByQuestionId(answers, "personal_caste");
      const mappedCaste = caste; // Store raw value or undefined
      
      // Get parental occupation directly (using father's occupation as primary, fall back to mother's)
      const fatherOccupation = getAnswerByQuestionId(answers, "father_occupation");
      const motherOccupation = getAnswerByQuestionId(answers, "mother_occupation");
      const primaryOccupation = fatherOccupation || motherOccupation || "Unemployed";
      const mappedOccupation = primaryOccupation; // Store raw value
      
      // Derive parental education from occupation (since no direct education questions in current survey)
      let parentalEducation = "Secondary (6th–10th)"; // Default assumption
      if (mappedOccupation === "Government Service") {
        parentalEducation = "Graduate";
      } else if (mappedOccupation === "Private Job") {
        parentalEducation = "Higher secondary (11th–12th)";
      } else if (mappedOccupation === "Business") {
        parentalEducation = "Higher secondary (11th–12th)";
      } else if (mappedOccupation === "Daily Wage / Labor") {
        parentalEducation = "Primary (1st-5th)";
      } else if (mappedOccupation === "Unemployed") {
        parentalEducation = "No formal education";
      } else if (mappedOccupation === "Farmer") {
        parentalEducation = "Primary (1st-5th)";
      } else if (mappedOccupation === "Homemaker") {
        parentalEducation = "Secondary (6th–10th)";
      } else if (mappedOccupation === "Don't Know") {
        parentalEducation = "Secondary (6th–10th)";
      }
      
      // Map sports participation using complex logic
      const currentlyPlays = getAnswerByQuestionId(answers, "sport_status_current");
      const everPlayed = getAnswerByQuestionId(answers, "sport_status_ever");
      const frequency = getAnswerByQuestionId(answers, "sport_activity_frequency");
      const discontinuationStatus = getAnswerByQuestionId(answers, "sport_discontinuation_status");
      
      // For boys' surveys (different question structure)
      const boysCurrentFrequency = getAnswerByQuestionId(answers, "boys_sport_current_frequency");
      const boysDiscontinuationExperience = getAnswerByQuestionId(answers, "boys_sport_discontinuation_experience");
      
      // Helper function to check if we can determine sports status for girls
      const cannotDetermineGirls = () => {
        // Condition 1: Missing sport_status_ever
        if (!everPlayed) {
          return "Missing sport_status_ever - cannot determine if ever played";
        }
        
        // Condition 2: If they ever played, but missing current status info
        if (everPlayed === "Yes") {
          // For Girls Under 12 form (Af4Q5nndk6EmIVmTNTBA)
          if (rawResponse.formId === "Af4Q5nndk6EmIVmTNTBA") {
            if (!currentlyPlays) {
              return "Missing sport_status_current - cannot determine if still playing";
            }
            if (currentlyPlays === "Yes" && !frequency) {
              return "Missing sport_activity_frequency - cannot determine regularity";
            }
          }
          
          // For Girls Menstruating form (B5Rhj1fjJueeLfdhGSzi)
          if (rawResponse.formId === "B5Rhj1fjJueeLfdhGSzi") {
            if (!frequency) {
              return "Missing sport_activity_frequency - cannot determine current participation level";
            }
          }
        }
        
        // Condition 3: Empty or invalid responses
        if (frequency === "" || frequency === null) {
          return "Empty sport_activity_frequency";
        }
        
        return false; // Can determine
      };
      
      // Helper function to check if we can determine sports status for boys
      const cannotDetermineBoys = () => {
        // Primary condition: Missing boys_sport_current_frequency
        if (!boysCurrentFrequency) {
          return "Missing boys_sport_current_frequency - primary classification field";
        }
        
        // Secondary: For returnee classification, need discontinuation data
        if (boysCurrentFrequency === "Yes, regularly" || 
            boysCurrentFrequency === "Yes, sometimes") {
          if (!boysDiscontinuationExperience) {
            return "Cannot determine if returnee - missing discontinuation experience";
          }
        }
        
        return false; // Can determine
      };
      
      let sportsParticipationStatus = "Never played"; // Default
      
      // Check if we have boys survey data
      const isBoysSurvey = !!boysCurrentFrequency;
      
      // Check for missing data conditions
      const cannotDetermineReason = isBoysSurvey ? cannotDetermineBoys() : cannotDetermineGirls();
      
      if (cannotDetermineReason) {
        console.warn(`Cannot determine sports status for ${rawResponse.firestore_id}: ${cannotDetermineReason}`);
        sportsParticipationStatus = "Cannot determine";
      } else {
        // Only classify if we have sufficient data
        
        // Never played: sport_status_ever = "No" OR boys_sport_current_frequency = "I never played sport"
        if (everPlayed === "No" || boysCurrentFrequency === "I never played sport") {
          sportsParticipationStatus = "Never played";
        }
        // Active/Regular: sport_status_current = "Yes" AND frequency = "Daily" or "Few times a week" OR boys_sport_current_frequency = "Yes, regularly"
        else if ((currentlyPlays === "Yes" && (frequency === "Daily" || frequency === "Few times a week")) || 
                 boysCurrentFrequency === "Yes, regularly") {
          sportsParticipationStatus = "Active/Regular";
        }
        // Active/Irregular: sport_status_current = "Yes" AND frequency = "Once a week" or "Rarely" OR boys_sport_current_frequency = "Yes, sometimes"
        else if ((currentlyPlays === "Yes" && (frequency === "Once a week" || frequency === "Rarely")) || 
                 boysCurrentFrequency === "Yes, sometimes") {
          sportsParticipationStatus = "Active/Irregular";
        }
        // Returnee: boys_sport_discontinuation_experience = "Yes" AND boys_sport_current_frequency = "Yes, regularly/sometimes"
        else if (boysDiscontinuationExperience === "Yes" && 
                 (boysCurrentFrequency === "Yes, regularly" || boysCurrentFrequency === "Yes, sometimes")) {
          sportsParticipationStatus = "Returnee";
        }
        // Dropout: sport_discontinuation_status = "Yes" OR boys_sport_current_frequency = "No, not anymore"
        else if (discontinuationStatus === "Yes" || boysCurrentFrequency === "No, not anymore") {
          sportsParticipationStatus = "Dropout";
        }
        // Fallback for other cases where currently plays but no clear frequency
        else if (currentlyPlays === "Yes") {
          sportsParticipationStatus = "Active/Regular"; // Default for active players
        }
      }
      
      // Map sports frequency (reuse frequency variable from above)
      const mappedFrequency = frequency ? SPORTS_FREQUENCY_MAPPING[frequency] || "SportsFrequency.none" : "SportsFrequency.none";
      
      // Determine menarche status based on form ID
      let menarcheStatus = "None";
      if (rawResponse.formId === "B5Rhj1fjJueeLfdhGSzi") {
        menarcheStatus = "Post-menarche";
      } else if (rawResponse.formId === "Af4Q5nndk6EmIVmTNTBA") {
        menarcheStatus = "Pre-menarche";
      }
      
      // Get menstrual product use from survey
      const menstrualProductUse = getAnswerByQuestionId(answers, "menstruation_products_used");
      
      // Absenteeism due to menstruation is being removed as requested
      
      // Performance indices removed as requested

      return {
        id: rawResponse.firestore_id,
        respondentId: rawResponse.submittedBy,
        name: respondentName,
        email: student?.email || undefined,
        ageGroup: ageGroup as AgeGroup,
        schoolType: schoolType as SchoolType,
        classGradeLevel: classGradeLevel as ClassGradeLevel,
        religion: mappedReligion as Religion,
        casteCommunity: mappedCaste as CasteCommunity | undefined,
        parentalEducation: parentalEducation as ParentalEducation,
        parentalOccupation: mappedOccupation as ParentalOccupation,
        sportsParticipationStatus: sportsParticipationStatus as SportsParticipationStatus,
        sportsFrequency: mappedFrequency as SportsFrequency,
        menarcheStatus: menarcheStatus as MenarcheStatus | undefined,
        menstrualProductUse: menstrualProductUse as MenstrualProductUse | undefined,
        surveyCompletedAt: convertFirebaseTimestamp(rawResponse.createdAt),
        instituteId: "khelegi_survey", // Could be extracted from school name if needed
        createdAt: convertFirebaseTimestamp(rawResponse.createdAt),
        updatedAt: convertFirebaseTimestamp(rawResponse.updatedAt)
      };

    } catch (error) {
      console.error('Error mapping raw survey response:', error);
      return null;
    }
  }

  async getKhelegiSurveyData(formId?: string, limit?: number): Promise<KhelegiSurveyData> {
    try {      
      // Fetch ALL survey responses without form ID filtering
      console.log('Fetching ALL survey responses (no form ID filter)');
      const rawResponses = await this.surveyResponseRepository.getAllSurveyResponses(limit);

      console.log('Raw responses from repository:', rawResponses.length);

      // Transform raw responses to KhelegySurveyResponse with student data
      const mappedSurveys = await Promise.all(
        rawResponses.map(async (raw, index) => {
          try {
            let student: SchoolStudent | null = null;
            
            // Fetch student data for non-anonymous submissions
            if (raw.submittedBy !== "anonymous") {
              console.log(`Fetching student data for ID: ${raw.submittedBy}`);
              try {
                student = await this.schoolStudentRepository.getStudentById(raw.submittedBy);
                if (student) {
                  console.log(`Found student: ${student.name} (${student.email})`);
                } else {
                  console.warn(`No student found for ID: ${raw.submittedBy}`);
                }
              } catch (error) {
                console.error(`Error fetching student ${raw.submittedBy}:`, error);
              }
            }
            
            const mapped = this.mapRawResponseToKhelegySurvey(raw, student);
            if (!mapped) {
              console.warn(`Failed to map survey ${index + 1} (ID: ${raw.firestore_id})`);
            }
            return mapped;
          } catch (error) {
            console.error(`Error processing survey ${index + 1}:`, error);
            return null;
          }
        })
      );

      const validSurveys = mappedSurveys.filter((survey): survey is KhelegySurveyResponse => survey !== null);

      console.log('Successfully mapped surveys:', validSurveys.length);
      console.log('Filtered out surveys:', rawResponses.length - validSurveys.length);

      return {
        surveys: validSurveys,
        totalCount: validSurveys.length
      };

    } catch (error) {
      console.error('Error fetching Khelegi survey data:', error);
      throw new Error(`Failed to fetch Khelegi survey data: ${error}`);
    }
  }
}

export const khelegiService = new KhelegiService();
