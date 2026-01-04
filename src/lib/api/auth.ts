import {
  type LoginInput,
  type RegisterInput,
  type User,
  userSchema,
} from "@/lib/schemas/auth";
import { apiClient } from "./client";

export const authApi = {
  login: async (credentials: LoginInput): Promise<User> => {
    const { data } = await apiClient.post("/auth/sign_in", credentials);
    return userSchema.parse(data.user);
  },

  register: async (userData: RegisterInput): Promise<User> => {
    const { data } = await apiClient.post("/auth/sign_up", userData);
    return userSchema.parse(data.user);
  },

  logout: async (): Promise<void> => {
    await apiClient.delete("/auth/sign_out");
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get("/auth/me");
    return userSchema.parse(data.user);
  },
};
