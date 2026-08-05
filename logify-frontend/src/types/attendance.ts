export interface AttendanceResponse {
  id: number;
  employeeName: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: "PRESENT" | "ABSENT" | "LATE" | "ON_LEAVE";
  message?: string;
}