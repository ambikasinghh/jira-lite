import { User } from '../types';
import { generateInitials, generateAvatarColor } from '../utils/userUtils';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@test.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date(),
    initials: generateInitials('Admin User'),
    avatarColor: generateAvatarColor('1'),
  },
  {
    id: '2',
    email: 'user@test.com',
    name: 'John Doe',
    role: 'user',
    createdAt: new Date(),
    initials: generateInitials('John Doe'),
    avatarColor: generateAvatarColor('2'),
  },
  {
    id: '3',
    email: 'alice@test.com',
    name: 'Alice Smith',
    role: 'user',
    createdAt: new Date(),
    initials: generateInitials('Alice Smith'),
    avatarColor: generateAvatarColor('3'),
  },
  {
    id: '4',
    email: 'bob@test.com',
    name: 'Bob Johnson',
    role: 'user',
    createdAt: new Date(),
    initials: generateInitials('Bob Johnson'),
    avatarColor: generateAvatarColor('4'),
  },
  {
    id: '5',
    email: 'sarah@test.com',
    name: 'Sarah Wilson',
    role: 'user',
    createdAt: new Date(),
    initials: generateInitials('Sarah Wilson'),
    avatarColor: generateAvatarColor('5'),
  },
];