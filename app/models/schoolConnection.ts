import { Timestamp } from "firebase/firestore";

export interface SchoolConnection {
  createdAt: Timestamp;
  parentId: string;
  schoolIds: string[];
  updatedAt: Timestamp;
} 