// import { SchoolInstitute, DashboardType } from '../models/schoolInstitute'; // Unused imports
import { SchoolInstituteRepository } from '../repository/schoolInstituteRepository';
import { TestGradstatsRepository } from '../repository/testGradstatsRepository';
import { SchoolConnectionRepository } from '../repository/schoolConnectionRepository';
import { SchoolStudentRepository } from '../repository/schoolStudentRepository';
import { StudentLatestTestRepository } from '../repository/studentLatestTestRepository';
import { ConnectedSchool, HomeTestData, StudentStats } from '../models/helpers/homeTypes';
import { SchoolStudent, PaymentStatus } from '../models/schoolStudent';
import { StudentLatestTest } from '../models/studentLatestTest';
import { calculateHomeStats, organizeTestGradstatsData } from '../utils/helperFunctions';


export interface HomeData {
  studentStats: StudentStats;
  testGradstats: HomeTestData;
  connectedSchools: ConnectedSchool[];
}

export interface StudentWithTestData extends SchoolStudent {
  latestTest?: StudentLatestTest;
}

export interface HomeTableData {
  students: StudentWithTestData[];
  totalCount: number;
}

export class HomeService {
  private schoolInstituteRepository: SchoolInstituteRepository;
  private testGradstatsRepository: TestGradstatsRepository;
  private schoolConnectionRepository: SchoolConnectionRepository;
  private schoolStudentRepository: SchoolStudentRepository;
  private studentLatestTestRepository: StudentLatestTestRepository;

  constructor() {
    this.schoolInstituteRepository = new SchoolInstituteRepository();
    this.testGradstatsRepository = new TestGradstatsRepository();
    this.schoolConnectionRepository = new SchoolConnectionRepository();
    this.schoolStudentRepository = new SchoolStudentRepository();
    this.studentLatestTestRepository = new StudentLatestTestRepository();
  }

  async getHomeData(email: string): Promise<HomeData | null> {
    try {
      const schoolInstitute = await this.schoolInstituteRepository.getByEmail(email);
      if (!schoolInstitute) {
        return null;
        
      }
      const stats = calculateHomeStats(schoolInstitute);

      const instituteId = schoolInstitute.id;

      if (!instituteId) {
        console.error('School institute ID is undefined.');
        return null;
      }

      // Get test gradstats data
      const gradstatsData = await this.testGradstatsRepository.getByInstituteId(instituteId);
      const organizedGradstats = organizeTestGradstatsData(gradstatsData);

      // Get connected schools
      const schoolConnection = await this.schoolConnectionRepository.getSchoolConnectionByParentId(instituteId);
      let schoolConnections: ConnectedSchool[] = [];
      
      if (schoolConnection && schoolConnection.schoolIds.length > 0) {
        const schoolInstitutes = await this.schoolInstituteRepository.getByIds(schoolConnection.schoolIds);
        schoolConnections = schoolInstitutes.map(school => ({
          id: school.id || '',
          name: school.name,
          email: school.email
        }));
      }
    
      // Calculate statistics using formatter

      return {
        studentStats: stats,
        testGradstats: organizedGradstats,
        connectedSchools:schoolConnections
      };
    } catch (error) {
      console.error('Error fetching home data:', error);
      throw error;
    }
  }

  async getHomeTableData(
    instituteId: string,
    std: string,
    limit: number,
    lastStudentId?: string // Optional: sId of the last student for pagination
  ): Promise<HomeTableData | null> {
    try {
      let students: SchoolStudent[];

      if (lastStudentId) {
        // Fetch students starting after the lastStudentId
        students = await this.schoolStudentRepository.getSchoolStudentsByInstituteIdAndStdPaginated(
          instituteId,
          std,
          limit,
          lastStudentId
        );
      } else {
        // Fetch the first batch of students
        students = await this.schoolStudentRepository.getSchoolStudentsByInstituteIdAndStdWithLimit(
          instituteId,
          std,
          limit
        );
      }

      // Return empty result instead of null when no students found
      // This is not an error condition, just an empty data set
      if (!students || students.length === 0) {
        return {
          students: [],
          totalCount: 0
        };
      }

      // Fetch latest test data for each student in parallel for optimization
      const studentsWithTestData = await Promise.allSettled(
        students.map(async (student): Promise<StudentWithTestData> => {
          try {
            const latestTest = await this.studentLatestTestRepository.getStudentLatestTestByStudentId(student.id!);
            return {
              ...student,
              latestTest: latestTest || undefined
            };
          } catch (error) {
            console.error(`Error fetching test data for student ${student.sId}:`, error);
            // Return student without test data if there's an error
            return {
              ...student,
              latestTest: undefined
            };
          }
        })
      );

      // Process results and handle any rejected promises
      const processedStudents: StudentWithTestData[] = studentsWithTestData.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          console.error(`Failed to process student ${students[index].sId}:`, result.reason);
          // Return student without test data for failed requests
          return {
            ...students[index],
            latestTest: undefined
          };
        }
      });

      return {
        students: processedStudents,
        totalCount: processedStudents.length
      };

    } catch (error) {
      console.error('Error fetching home table data:', error);
      throw error; // Only throw for actual errors (network issues, permission errors, etc.)
    }
  }

  async updateStudentPaymentStatus(
    studentId: string,
    paymentStatus: PaymentStatus
  ): Promise<void> {
    try {
      await this.schoolStudentRepository.updatePaymentStatus(studentId, paymentStatus);
    } catch (error) {
      console.error('Error updating student payment status:', error);
      throw error;
    }
  }
}

// Export a default instance
export const homeService = new HomeService(); 