import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Ticket, Sprint, Epic } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AppContextType {
  tickets: Ticket[];
  sprints: Sprint[];
  epics: Epic[];
  activeSprint: Sprint | null;
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
  moveTicketToSprint: (ticketId: string, sprintId: string | null) => void;
  createSprint: (name: string, startDate: Date, endDate: Date) => void;
  setActiveSprint: (sprintId: string) => void;
  createEpic: (epic: Omit<Epic, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEpic: (id: string, updates: Partial<Epic>) => void;
  deleteEpic: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

const mockEpics: Epic[] = [
  {
    id: '1',
    title: 'User Management',
    description: 'Complete user authentication and profile management system',
    color: '#1976d2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Dashboard Enhancement',
    description: 'Improve dashboard functionality and user experience',
    color: '#2e7d32',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Performance Optimization',
    description: 'Optimize application performance and loading times',
    color: '#ed6c02',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockSprints: Sprint[] = [
  {
    id: '1',
    name: 'Sprint 1',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-14'),
    isActive: true,
    createdAt: new Date(),
  },
];

const mockTickets: Ticket[] = [
  {
    id: '1',
    title: 'Create user authentication',
    description: 'Implement Google OAuth login',
    storyPoints: 5,
    type: 'Story',
    status: 'In Progress',
    createdBy: '2',
    assigneeId: '2',
    createdAt: new Date(),
    updatedAt: new Date(),
    sprintId: '1',
    epicId: '1',
  },
  {
    id: '2',
    title: 'Fix login bug',
    description: 'Users cannot login with special characters in email',
    storyPoints: 3,
    type: 'Bug',
    status: 'To Do',
    createdBy: '1',
    assigneeId: '3',
    createdAt: new Date(),
    updatedAt: new Date(),
    epicId: '1',
  },
  {
    id: '3',
    title: 'Design user dashboard',
    description: 'Create wireframes and mockups for the main user dashboard',
    storyPoints: 8,
    type: 'Story',
    status: 'Done',
    createdBy: '3',
    assigneeId: '3',
    createdAt: new Date(),
    updatedAt: new Date(),
    sprintId: '1',
    epicId: '2',
  },
  {
    id: '4',
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment pipeline',
    storyPoints: 13,
    type: 'Technical Story',
    status: 'In Progress',
    createdBy: '4',
    assigneeId: '4',
    createdAt: new Date(),
    updatedAt: new Date(),
    sprintId: '1',
    epicId: '3',
  },
  {
    id: '5',
    title: 'Add dark mode support',
    description: 'Implement dark theme across the application',
    storyPoints: 5,
    type: 'Story',
    status: 'Ready to Merge',
    createdBy: '5',
    assigneeId: '5',
    createdAt: new Date(),
    updatedAt: new Date(),
    sprintId: '1',
    epicId: '2',
  },
  {
    id: '6',
    title: 'Performance optimization',
    description: 'Optimize application loading time and responsiveness',
    storyPoints: 8,
    type: 'Technical Story',
    status: 'To Do',
    createdBy: '2',
    assigneeId: '2',
    createdAt: new Date(),
    updatedAt: new Date(),
    epicId: '3',
  },
  {
    id: '7',
    title: 'Mobile responsiveness',
    description: 'Ensure app works properly on mobile devices',
    storyPoints: 5,
    type: 'Story',
    status: 'To Do',
    createdBy: '3',
    assigneeId: '4',
    createdAt: new Date(),
    updatedAt: new Date(),
    epicId: '2',
  },
];

const loadTicketsFromLocalStorage = (): Ticket[] => {
  try {
    const saved = localStorage.getItem('tickets');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt)
      }));
    }
  } catch (error) {
    console.warn('Could not load tickets from localStorage:', error);
  }
  return mockTickets;
};

const saveTicketsToLocalStorage = (tickets: Ticket[]) => {
  try {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  } catch (error) {
    console.warn('Could not save tickets to localStorage:', error);
  }
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>(mockSprints);
  const [epics, setEpics] = useState<Epic[]>(mockEpics);
  const [activeSprint, setActiveSprintState] = useState<Sprint | null>(
    mockSprints.find(s => s.isActive) || null
  );

  useEffect(() => {
    const loadedTickets = loadTicketsFromLocalStorage();
    setTickets(loadedTickets);
  }, []);

  const createTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTickets(prev => {
      const updated = [...prev, newTicket];
      saveTicketsToLocalStorage(updated);
      return updated;
    });
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets(prev => {
      const updated = prev.map(ticket =>
        ticket.id === id
          ? { ...ticket, ...updates, updatedAt: new Date() }
          : ticket
      );
      saveTicketsToLocalStorage(updated);
      return updated;
    });
  };

  const deleteTicket = (id: string) => {
    setTickets(prev => {
      const updated = prev.filter(ticket => ticket.id !== id);
      saveTicketsToLocalStorage(updated);
      return updated;
    });
  };

  const moveTicketToSprint = (ticketId: string, sprintId: string | null) => {
    updateTicket(ticketId, { sprintId: sprintId || undefined });
  };

  const createSprint = (name: string, startDate: Date, endDate: Date) => {
    const newSprint: Sprint = {
      id: uuidv4(),
      name,
      startDate,
      endDate,
      isActive: false,
      createdAt: new Date(),
    };
    setSprints(prev => [...prev, newSprint]);
  };

  const setActiveSprint = (sprintId: string) => {
    setSprints(prev => {
      const updatedSprints = prev.map(sprint => ({
        ...sprint,
        isActive: sprint.id === sprintId,
      }));
      const newActiveSprint = updatedSprints.find(s => s.id === sprintId) || null;
      setActiveSprintState(newActiveSprint);
      return updatedSprints;
    });
  };

  const createEpic = (epicData: Omit<Epic, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEpic: Epic = {
      ...epicData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setEpics(prev => [...prev, newEpic]);
  };

  const updateEpic = (id: string, updates: Partial<Epic>) => {
    setEpics(prev =>
      prev.map(epic =>
        epic.id === id
          ? { ...epic, ...updates, updatedAt: new Date() }
          : epic
      )
    );
  };

  const deleteEpic = (id: string) => {
    setEpics(prev => prev.filter(epic => epic.id !== id));
    setTickets(prev => prev.map(ticket => 
      ticket.epicId === id ? { ...ticket, epicId: undefined } : ticket
    ));
  };

  const value: AppContextType = {
    tickets,
    sprints,
    epics,
    activeSprint,
    createTicket,
    updateTicket,
    deleteTicket,
    moveTicketToSprint,
    createSprint,
    setActiveSprint,
    createEpic,
    updateEpic,
    deleteEpic,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};