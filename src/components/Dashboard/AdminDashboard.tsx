import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Container,
  Typography,
  Fab,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useApp } from '../../contexts/AppContext';
import { TicketCard } from '../Tickets/TicketCard';
import { TicketForm } from '../Tickets/TicketForm';
import { SettingsPanel } from './SettingsPanel';
import { AdminPanel } from './AdminPanel';
import { Ticket, TicketStatus } from '../../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

export const AdminDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [editTicket, setEditTicket] = useState<Ticket | undefined>();
  
  const { tickets, activeSprint, updateTicket, createTicket, deleteTicket } = useApp();

  const sprintTickets = tickets.filter(ticket => ticket.sprintId === activeSprint?.id);
  const backlogTickets = tickets.filter(ticket => !ticket.sprintId);

  const handleStatusChange = (ticketId: string, status: TicketStatus) => {
    updateTicket(ticketId, { status });
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditTicket(ticket);
    setShowTicketForm(true);
  };

  const handleDeleteTicket = (ticketId: string) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      deleteTicket(ticketId);
    }
  };

  const handleSubmitTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editTicket) {
      updateTicket(editTicket.id, ticketData);
    } else {
      createTicket(ticketData);
    }
    setTimeout(() => {
      setShowTicketForm(false);
      setEditTicket(undefined);
    }, 0);
  };

  const handleCloseForm = () => {
    setShowTicketForm(false);
    setEditTicket(undefined);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Current Sprint" />
          <Tab label="Backlog" />
          <Tab label="Admin Panel" />
          <Tab label="Settings" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h5" gutterBottom>
          {activeSprint ? activeSprint.name : 'No Active Sprint'}
        </Typography>
        {sprintTickets.length > 0 ? (
          sprintTickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onStatusChange={handleStatusChange}
              onEdit={handleEditTicket}
              onDelete={handleDeleteTicket}
            />
          ))
        ) : (
          <Typography color="text.secondary">
            No tickets in current sprint
          </Typography>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h5" gutterBottom>
          Backlog
        </Typography>
        {backlogTickets.length > 0 ? (
          backlogTickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onStatusChange={handleStatusChange}
              onEdit={handleEditTicket}
              onDelete={handleDeleteTicket}
            />
          ))
        ) : (
          <Typography color="text.secondary">
            No tickets in backlog
          </Typography>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <AdminPanel />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <SettingsPanel />
      </TabPanel>

      {(tabValue === 0 || tabValue === 1) && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setShowTicketForm(true)}
        >
          <Add />
        </Fab>
      )}

      <TicketForm
        key={editTicket ? `edit-${editTicket.id}` : 'create'}
        open={showTicketForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmitTicket}
        editTicket={editTicket}
      />
    </Container>
  );
};