export interface ClassFee {
  id: number;
  studentId: number;
  studentName: string;
  subject: string;
  grade: string;
  amount: number;
  month: number;
  year: number;
  dueDate: string;
  status: string;
  paidOn?: string;
  paymentMethod?: string;
  notes?: string;
}
