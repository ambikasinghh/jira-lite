import { UserRole, TicketType, TicketStatus } from './enums';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  photo?: string;
  initials: string;
  avatarColor: string;
}

export interface Epic {
  id: string;
  title: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  storyPoints: number;
  type: TicketType;
  status: TicketStatus;
  assigneeId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  sprintId?: string;
  epicId?: string;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}