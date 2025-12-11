// User Types
export interface User {
  id: number;
  loginId: string;
  nickname: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface SignupRequest {
  loginId: string;
  password: string;
  nickname: string;
}

export interface LoginResponse {
  accessToken: string;
  loginId: string;
  nickname: string;
  role: string;
}

// Team Types
export interface Team {
  id: number;
  name: string;
  description: string;
  myRole: 'LEADER' | 'MEMBER';
  createdAt: string;
}

export interface TeamCreateRequest {
  name: string;
  description?: string;
}

export interface TeamMember {
  id: number;
  loginId: string;
  nickname: string;
  role: 'LEADER' | 'MEMBER';
  joinedAt: string;
}

export interface InviteRequest {
  loginId: string;
}

// Task Types
export interface Task {
  id: number;
  teamId: number;
  teamName: string;
  workerLoginId: string | null;
  workerNickname: string | null;
  parentId: number | null;
  title: string;
  content: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  deadline: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreateRequest {
  title: string;
  content?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  deadline?: string;
  workerLoginId?: string;
  parentId?: number;
}

export interface TaskUpdateRequest {
  title?: string;
  content?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  deadline?: string;
  workerLoginId?: string;
  version?: number;
}

// Comment Types
export interface Comment {
  id: number;
  content: string;
  taskId: number;
  writerLoginId: string;
  writerNickname: string;
  createdAt: string;
}

export interface CommentCreateRequest {
  content: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
