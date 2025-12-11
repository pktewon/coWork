import apiClient from './client';
import type { ApiResponse, Team, TeamCreateRequest, TeamMember, InviteRequest } from '../types';

export const teamApi = {
  createTeam: async (data: TeamCreateRequest): Promise<Team> => {
    const response = await apiClient.post<ApiResponse<Team>>('/teams', data);
    return response.data.data;
  },

  getMyTeams: async (): Promise<Team[]> => {
    const response = await apiClient.get<ApiResponse<Team[]>>('/teams');
    return response.data.data;
  },

  getTeam: async (teamId: number): Promise<Team> => {
    const response = await apiClient.get<ApiResponse<Team>>(`/teams/${teamId}`);
    return response.data.data;
  },

  getTeamMembers: async (teamId: number): Promise<TeamMember[]> => {
    const response = await apiClient.get<ApiResponse<TeamMember[]>>(`/teams/${teamId}/members`);
    return response.data.data;
  },

  inviteMember: async (teamId: number, data: InviteRequest): Promise<TeamMember> => {
    const response = await apiClient.post<ApiResponse<TeamMember>>(`/teams/${teamId}/invite`, data);
    return response.data.data;
  },
};
