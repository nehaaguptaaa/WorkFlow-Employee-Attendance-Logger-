import axiosInstance from "./axiosInstance";
import type { AttendanceResponse } from "../types/attendance";

export const checkIn = async (): Promise<AttendanceResponse> => {
  const res = await axiosInstance.post<AttendanceResponse>("/employee/attendance/checkin");
  return res.data;
};

export const checkOut = async (): Promise<AttendanceResponse> => {
  const res = await axiosInstance.post<AttendanceResponse>("/employee/attendance/checkout");
  return res.data;
};

export const getMyAttendanceHistory = async (): Promise<AttendanceResponse[]> => {
  const res = await axiosInstance.get<AttendanceResponse[]>("/employee/attendance/history");
  return res.data;
};