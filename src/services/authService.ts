import apiClient from "../api/apiClient";
import type { User } from "../models/types";

export interface LoginResponse {
  token: string;
  data: {
    user: User;
  };
}

const getErrorMessage = (
  error: unknown,
  fallbackMessage = "An unknown error occurred",
): string => {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null) {
    const maybeError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    if (maybeError.response?.data?.message)
      return maybeError.response.data.message;
    if (maybeError.message) return maybeError.message;
  }

  return fallbackMessage;
};

export const authService = {
  /**
   * Login with username and password
   */
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post("/auth/login", {
        username,
        password,
      });
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err, "Login failed"), { cause: err });
    }
  },

  /**
   * Register a new user
   */
  register: async (userData: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await apiClient.post("/auth/register", userData);
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err, "Registration failed"), {
        cause: err,
      });
    }
  },

  /**
   * Logout the current user
   */
  logout: async () => {
    try {
      const response = await apiClient.post("/auth/logout");
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err, "Logout failed"), { cause: err });
    }
  },

  /**
   * Get current user info
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err, "Failed to fetch current user"), {
        cause: err,
      });
    }
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async () => {
    try {
      const response = await apiClient.post("/auth/refresh");
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err, "Token refresh failed"), {
        cause: err,
      });
    }
  },
};
