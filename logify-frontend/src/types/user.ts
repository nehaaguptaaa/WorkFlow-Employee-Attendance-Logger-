export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  department: string;
}