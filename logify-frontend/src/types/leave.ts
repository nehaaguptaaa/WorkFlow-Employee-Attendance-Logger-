export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface LeaveResponse {
  id: number;
  employeeName: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  reviewedOn: string | null;
}

export interface LeaveApplyRequest {
  fromDate: string;
  toDate: string;
  reason: string;
}