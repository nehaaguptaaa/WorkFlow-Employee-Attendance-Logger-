import axiosInstance from "./axiosInstance";
import type { UserResponse } from "../types/user";
import type { AttendanceResponse } from "../types/attendance";
import type { LeaveResponse, LeaveStatus } from "../types/leave";
import type { EmployeeAttendanceSummary } from "../types/report";

export const getAllEmployees = async (): Promise<UserResponse[]> => {
  const res = await axiosInstance.get<UserResponse[]>("/admin/employees");
  return res.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/admin/employees/${id}`);
};

export const promoteToAdmin = async (id: number): Promise<UserResponse> => {
  const res = await axiosInstance.put<UserResponse>(`/admin/employees/${id}/promote`);
  return res.data;
};

export const getAllAttendance = async (): Promise<AttendanceResponse[]> => {
  const res = await axiosInstance.get<AttendanceResponse[]>("/admin/attendance");
  return res.data;
};

export const getAttendanceByUser = async (userId: number): Promise<AttendanceResponse[]> => {
  const res = await axiosInstance.get<AttendanceResponse[]>(`/admin/attendance/user/${userId}`);
  return res.data;
};

export const updateAttendance = async (
  id: number,
  data: { checkInTime?: string; checkOutTime?: string; status?: string }
): Promise<AttendanceResponse> => {
  const res = await axiosInstance.put<AttendanceResponse>(`/admin/attendance/${id}`, data);
  return res.data;
};

export const getLeaves = async (status?: LeaveStatus): Promise<LeaveResponse[]> => {
  const res = await axiosInstance.get<LeaveResponse[]>("/admin/leave", {
    params: status ? { status } : {},
  });
  return res.data;
};

export const updateLeaveStatus = async (id: number, status: LeaveStatus): Promise<LeaveResponse> => {
  const res = await axiosInstance.put<LeaveResponse>(`/admin/leave/${id}/status`, null, {
    params: { status },
  });
  return res.data;
};

export const getMonthlySummary = async (
  month: number,
  year: number
): Promise<EmployeeAttendanceSummary[]> => {
  const res = await axiosInstance.get<EmployeeAttendanceSummary[]>("/admin/reports/summary", {
    params: { month, year },
  });
  return res.data;
};