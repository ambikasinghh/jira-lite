import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider, useApp } from '../AppContext';
import { TicketType, TicketStatus } from '../../types';

const TestComponent = () => {
  const { 
    tickets, 
    createTicket, 
    updateTicket, 
    deleteTicket,
    sprints,
    createSprint,
    activeSprint 
  } = useApp();
  
  const handleCreateTicket = () => {
    createTicket({
      title: 'Test Ticket',
      description: 'Test Description',
      storyPoints: 3,
      type: 'Story' as TicketType,
      status: 'To Do' as TicketStatus,
      createdBy: '1',
    });
  };

  const handleUpdateTicket = () => {
    if (tickets.length > 0) {
      updateTicket(tickets[0].id, { status: 'Done' as TicketStatus });
    }
  };

  const handleDeleteTicket = () => {
    if (tickets.length > 0) {
      deleteTicket(tickets[0].id);
    }
  };

  const handleCreateSprint = () => {
    createSprint('Test Sprint', new Date(), new Date());
  };
  
  return (
    <div>
      <div data-testid="ticket-count">{tickets.length}</div>
      <div data-testid="sprint-count">{sprints.length}</div>
      <div data-testid="active-sprint">{activeSprint?.name || 'no active sprint'}</div>
      {tickets.map(ticket => (
        <div key={ticket.id} data-testid={`ticket-${ticket.id}`}>
          {ticket.title} - {ticket.status}
        </div>
      ))}
      <button onClick={handleCreateTicket}>Create Ticket</button>
      <button onClick={handleUpdateTicket}>Update Ticket</button>
      <button onClick={handleDeleteTicket}>Delete Ticket</button>
      <button onClick={handleCreateSprint}>Create Sprint</button>
    </div>
  );
};

describe('AppContext', () => {
  test('should start with mock data', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('ticket-count')).toHaveTextContent('2');
    expect(screen.getByTestId('sprint-count')).toHaveTextContent('1');
    expect(screen.getByTestId('active-sprint')).toHaveTextContent('Sprint 1');
  });

  test('should create new ticket', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const initialCount = screen.getByTestId('ticket-count').textContent;
    
    fireEvent.click(screen.getByText('Create Ticket'));

    expect(screen.getByTestId('ticket-count')).toHaveTextContent(
      String(Number(initialCount) + 1)
    );
    expect(screen.getByText('Test Ticket - To Do')).toBeInTheDocument();
  });

  test('should update ticket status', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    fireEvent.click(screen.getByText('Update Ticket'));

    expect(screen.getByText(/Done/)).toBeInTheDocument();
  });

  test('should delete ticket', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const initialCount = Number(screen.getByTestId('ticket-count').textContent);
    
    fireEvent.click(screen.getByText('Delete Ticket'));

    expect(screen.getByTestId('ticket-count')).toHaveTextContent(
      String(initialCount - 1)
    );
  });

  test('should create new sprint', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    const initialCount = Number(screen.getByTestId('sprint-count').textContent);
    
    fireEvent.click(screen.getByText('Create Sprint'));

    expect(screen.getByTestId('sprint-count')).toHaveTextContent(
      String(initialCount + 1)
    );
  });
});