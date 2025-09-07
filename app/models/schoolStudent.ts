// app/models/student.ts
export enum Gender {
    MALE = "Gender.male",
    FEMALE = "Gender.female",
  }
  
  export enum PaymentStatus {
    PAID = "PaymentStatus.paid",
    UNPAID = "PaymentStatus.unpaid",
  }
  
  export enum GradeLevel {
    GRADE1TO5 = "GradeLevel.grade1to5",
    GRADE6TO8 = "GradeLevel.grade6to8",
    GRADE9TO10 = "GradeLevel.grade9to10",
    GRADE11TO12 = "GradeLevel.grade11to12"
  }
  
  export enum Section {
    A = "Section.a",
    B = "Section.b",
    C = "Section.c",
    D = "Section.d"

  }
  
  export enum Std {
    one = "Std.one",
    TWO = "Std.two",
    THREE = "Std.three",
    FOUR = "Std.four",
    FIVE = "Std.five",
    SIX = "Std.six",
    SEVEN = "Std.seven",
    EIGHT = "Std.eight",
    NINE = "Std.nine",
    TEN = "Std.ten",
    ELEVEN = "Std.eleven",
    TWELVE = "Std.twelve"
  }
  
  export interface SchoolStudent {
    id?: string;
    name: string;
    email: string;
    gender: Gender;
    dateOfBirth: Date;
    grade: GradeLevel;
    instituteId: string;
    isOnBoarded: boolean;
    paymentStatus: PaymentStatus;
    qrCode: string; // This is our UUID
    rfid: string;
    sId: string; // Student ID
    section: Section;
    std: Std;
    createdAt: Date;
    updatedAt: Date;
  }