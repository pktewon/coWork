import apiClient from './client';
import type { ApiResponse, Task, TaskCreateRequest, TaskUpdateRequest, Comment, CommentCreateRequest } from '../types';

export const taskApi = {
  createTask: async (teamId: number, data: TaskCreateRequest): Promise<Task> => {
    const response = await apiClient.post<ApiResponse<Task>>(`/teams/${teamId}/tasks`, data);
    return response.data.data;
  },

  getTeamTasks: async (teamId: number): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>(`/teams/${teamId}/tasks`);
    return response.data.data;
  },

  getMyTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>('/tasks/my');
    return response.data.data;
  },

  getTask: async (taskId: number): Promise<Task> => {
    const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${taskId}`);
    return response.data.data;
  },

  updateTask: async (taskId: number, data: TaskUpdateRequest): Promise<Task> => {
    const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${taskId}`, data);
    return response.data.data;
  },

  deleteTask: async (taskId: number): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/tasks/${taskId}`);
  },

  getComments: async (taskId: number): Promise<Comment[]> => {
    const response = await apiClient.get<ApiResponse<Comment[]>>(`/tasks/${taskId}/comments`);
    return response.data.data;
  },

  addComment: async (taskId: number, data: CommentCreateRequest): Promise<Comment> => {
    const response = await apiClient.post<ApiResponse<Comment>>(`/tasks/${taskId}/comments`, data);
    return response.data.data;
  },
};
