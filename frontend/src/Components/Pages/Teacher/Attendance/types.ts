export interface Attendance {
  id: number | null;
  studentId: number;
  studentName: string;
  grade: string;
  subject: string;
  date: string;
  status: "NONE" | "PRESENT" | "ABSENT";
}
