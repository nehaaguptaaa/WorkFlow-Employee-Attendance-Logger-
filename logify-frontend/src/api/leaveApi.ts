import axiosInstance from "./axiosInstance";
import type { LeaveApplyRequest, LeaveResponse } from "../types/leave";

export const applyLeave = async (data: LeaveApplyRequest): Promise<LeaveResponse> => {
  const res = await axiosInstance.post<LeaveResponse>("/employee/leave/apply", data);
  return res.data;
};

export const getMyLeaves = async (): Promise<LeaveResponse[]> => {
  const res = await axiosInstance.get<LeaveResponse[]>("/employee/leave/my-requests");
  return res.data;
};