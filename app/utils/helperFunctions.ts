import { HomeTestData, StudentStats } from "../models/helpers/homeTypes";
import { SchoolInstitute } from "../models/schoolInstitute";
import { TestGradstats } from "../models/testGradstats";
import { getClassNumber, formatTestName } from "../utils/formatters";

export const organizeTestGradstatsData = (gradstatsData: TestGradstats[]): HomeTestData => {
    const organizedData: HomeTestData = {};
  
    gradstatsData.forEach((item) => {
      const testName = formatTestName(item.test);
      const className = getClassNumber(item.std);
      const gender = item.gender;
      const count = item.count;
  
      if (!organizedData[testName]) {
        organizedData[testName] = {};
      }
  
      if (!organizedData[testName][className]) {
        organizedData[testName][className] = {
          class_male_avg_score: 0,
          class_female_avg_score: 0,
          class_total_avg_score: 0,
          class_male_max_score: 0,
          class_female_max_score: 0,
          class_total_max_score: 0,
          class_male_count: 0,
          class_female_count: 0,
        };
      }
  
      if (gender.toLowerCase().includes('male') && !gender.toLowerCase().includes('female')) {
        organizedData[testName][className].class_male_avg_score = item.avgScore;
        organizedData[testName][className].class_male_max_score = item.maxScore;
        organizedData[testName][className].class_male_count = count;
      } else if (gender.toLowerCase().includes('female')) {
        organizedData[testName][className].class_female_avg_score = item.avgScore;
        organizedData[testName][className].class_female_max_score = item.maxScore;
        organizedData[testName][className].class_female_count = count;
      }
    });
  
    Object.keys(organizedData).forEach((testName) => {
      Object.keys(organizedData[testName]).forEach((className) => {
        const classData = organizedData[testName][className];
        
        const maleAvgScore = classData.class_male_avg_score;
        const femaleAvgScore = classData.class_female_avg_score;
        const maleCount = classData.class_male_count;
        const femaleCount = classData.class_female_count;
  
        const totalCount = maleCount + femaleCount;
  
        if (totalCount > 0) {
          classData.class_total_avg_score = 
            (maleAvgScore * maleCount + femaleAvgScore * femaleCount) / totalCount;
        } else {
            classData.class_total_avg_score = 0;
        }
  
        classData.class_total_max_score = Math.max(
          classData.class_male_max_score,
          classData.class_female_max_score
        );
      });
    });
  
    return organizedData;
  };
  
  export const calculateHomeStats = (schoolInstitute: SchoolInstitute): StudentStats => {
    const totalStudents = schoolInstitute.maleCount + schoolInstitute.femaleCount;
    
    return {
      totalStudents,
      boys: schoolInstitute.maleCount,
      girls: schoolInstitute.femaleCount,
      paidStudents: schoolInstitute.paymentCount,
      unpaidStudents: totalStudents - schoolInstitute.paymentCount,
      schoolName: schoolInstitute.name,
      userType: schoolInstitute.userType,
      instituteId: schoolInstitute.id || '',
    };
  };

  


