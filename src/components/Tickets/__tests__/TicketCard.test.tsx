import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TicketCard } from '../TicketCard';
import { Ticket } from '../../../types';

const mockTicket: Ticket = {
  id: '1',
  title: 'Test Ticket',
  description: 'Test Description',
  storyPoints: 5,
  type: 'Story',
  status: 'To Do',
  createdBy: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProps = {
  ticket: mockTicket,
  onStatusChange: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe('TicketCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should display ticket information', () => {
    render(<TicketCard {...mockProps} />);

    expect(screen.getByText('Test Ticket')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('Story')).toBeInTheDocument();
    expect(screen.getByText('5 pts')).toBeInTheDocument();
  });

  test('should call onEdit when edit is clicked', () => {
    render(<TicketCard {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: /more/i }));
    fireEvent.click(screen.getByText('Edit'));

    expect(mockProps.onEdit).toHaveBeenCalledWith(mockTicket);
  });

  test('should call onDelete when delete is clicked', () => {
    render(<TicketCard {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: /more/i }));
    fireEvent.click(screen.getByText('Delete'));

    expect(mockProps.onDelete).toHaveBeenCalledWith('1');
  });

  test('should call onStatusChange when status menu item is clicked', () => {
    render(<TicketCard {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: /more/i }));
    fireEvent.click(screen.getByText('Move to In Progress'));

    expect(mockProps.onStatusChange).toHaveBeenCalledWith('1', 'In Progress');
  });

  test('should display correct chip colors for different ticket types', () => {
    const bugTicket = { ...mockTicket, type: 'Bug' as const };
    const { rerender } = render(<TicketCard {...mockProps} ticket={bugTicket} />);

    expect(screen.getByText('Bug')).toBeInTheDocument();

    const technicalStoryTicket = { ...mockTicket, type: 'Technical Story' as const };
    rerender(<TicketCard {...mockProps} ticket={technicalStoryTicket} />);

    expect(screen.getByText('Technical Story')).toBeInTheDocument();
  });

  test('should display correct chip colors for different statuses', () => {
    const inProgressTicket = { ...mockTicket, status: 'In Progress' as const };
    const { rerender } = render(<TicketCard {...mockProps} ticket={inProgressTicket} />);

    expect(screen.getByText('In Progress')).toBeInTheDocument();

    const doneTicket = { ...mockTicket, status: 'Done' as const };
    rerender(<TicketCard {...mockProps} ticket={doneTicket} />);

    expect(screen.getByText('Done')).toBeInTheDocument();
  });
});