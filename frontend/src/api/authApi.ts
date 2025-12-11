import apiClient from './client';
import type { ApiResponse, LoginRequest, LoginResponse, SignupRequest, User } from '../types';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data);
    return response.data.data;
  },

  signup: async (data: SignupRequest): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('/auth/signup', data);
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/users/me');
    return response.data.data;
  },
};
