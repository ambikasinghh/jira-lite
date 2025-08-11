import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TicketForm } from '../TicketForm';
import { AuthProvider } from '../../../contexts/AuthContext';
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

const MockWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

const mockProps = {
  open: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
};

describe('TicketForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('user', JSON.stringify({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user'
    }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('should render create form when no edit ticket provided', () => {
    render(
      <MockWrapper>
        <TicketForm {...mockProps} />
      </MockWrapper>
    );

    expect(screen.getByText('Create New Ticket')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveValue('');
    expect(screen.getByLabelText('Description')).toHaveValue('');
  });

  test('should render edit form with ticket data when edit ticket provided', () => {
    render(
      <MockWrapper>
        <TicketForm {...mockProps} editTicket={mockTicket} />
      </MockWrapper>
    );

    expect(screen.getByText('Edit Ticket')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Ticket')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
  });

  test('should call onSubmit with form data when form is submitted', async () => {
    render(
      <MockWrapper>
        <TicketForm {...mockProps} />
      </MockWrapper>
    );

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New Ticket' }
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'New Description' }
    });
    fireEvent.change(screen.getByLabelText('Story Points'), {
      target: { value: '3' }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        title: 'New Ticket',
        description: 'New Description',
        storyPoints: 3,
        type: 'Story',
        status: 'To Do',
        createdBy: '1',
        assigneeId: undefined,
        sprintId: undefined,
      });
    });
  });

  test('should call onClose when cancel button is clicked', () => {
    render(
      <MockWrapper>
        <TicketForm {...mockProps} />
      </MockWrapper>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('should validate required fields', async () => {
    render(
      <MockWrapper>
        <TicketForm {...mockProps} />
      </MockWrapper>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(mockProps.onSubmit).not.toHaveBeenCalled();
    });
  });

  test('should allow selecting different ticket types', () => {
    render(
      <MockWrapper>
        <TicketForm {...mockProps} />
      </MockWrapper>
    );

    const typeSelect = screen.getByLabelText('Type');
    fireEvent.mouseDown(typeSelect);
    
    expect(screen.getByText('Story')).toBeInTheDocument();
    expect(screen.getByText('Technical Story')).toBeInTheDocument();
    expect(screen.getByText('Bug')).toBeInTheDocument();
  });

  test('should allow selecting different statuses', () => {
    render(
      <MockWrapper>
        <TicketForm {...mockProps} />
      </MockWrapper>
    );

    const statusSelect = screen.getByLabelText('Status');
    fireEvent.mouseDown(statusSelect);
    
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Ready to Merge')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });
});