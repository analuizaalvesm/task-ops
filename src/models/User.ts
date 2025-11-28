export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "manager";
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  role?: "admin" | "user" | "manager";
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: "admin" | "user" | "manager";
  isActive?: boolean;
}
