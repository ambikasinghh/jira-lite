import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Container,
  Typography,
  Fab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Add, ExpandMore, FilterList } from '@mui/icons-material';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { useIntl } from 'react-intl';
import { TicketCard } from '../Tickets/TicketCard';
import { TicketForm } from '../Tickets/TicketForm';
import { SettingsPanel } from './SettingsPanel';
import { UserAvatar } from '../common/UserAvatar';
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

export const UserDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [editTicket, setEditTicket] = useState<Ticket | undefined>();
  const [nameFilter, setNameFilter] = useState('');
  const [epicFilter, setEpicFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  
  const { tickets, activeSprint, epics, updateTicket, createTicket, deleteTicket, moveTicketToSprint } = useApp();
  const { user, users } = useAuth();
  const { formatMessage } = useIntl();

  const sprintTickets = tickets.filter(ticket => ticket.sprintId === activeSprint?.id);
  const allBacklogTickets = tickets.filter(ticket => !ticket.sprintId);
  const filteredBacklogTickets = allBacklogTickets.filter(ticket => {
    const nameMatch = !nameFilter || ticket.title.toLowerCase().includes(nameFilter.toLowerCase());
    const epicMatch = !epicFilter || ticket.epicId === epicFilter;
    const assigneeMatch = !assigneeFilter || 
      (assigneeFilter === 'unassigned' ? !ticket.assigneeId : ticket.assigneeId === assigneeFilter);
    return nameMatch && epicMatch && assigneeMatch;
  });
  
  const backlogTickets = filteredBacklogTickets;
  const mySprintTickets = sprintTickets.filter(ticket => ticket.assigneeId === user?.id);
  const otherUsersSprintTickets = users
    .filter(u => u.id !== user?.id)
    .map(u => ({
      user: u,
      tickets: sprintTickets.filter(ticket => ticket.assigneeId === u.id)
    }))
    .filter(group => group.tickets.length > 0);
  const myBacklogTickets = backlogTickets.filter(ticket => ticket.createdBy === user?.id || ticket.assigneeId === user?.id);
  const otherBacklogTickets = backlogTickets.filter(ticket => ticket.createdBy !== user?.id && ticket.assigneeId !== user?.id);

  const handleStatusChange = (ticketId: string, status: TicketStatus) => {
    updateTicket(ticketId, { status });
  };

  const handleEditTicket = (ticket: Ticket) => {
    setEditTicket(ticket);
    setShowTicketForm(true);
  };

  const handleDeleteTicket = (ticketId: string) => {
    if (window.confirm(formatMessage({ id: 'confirmDelete' }))) {
      deleteTicket(ticketId);
    }
  };

  const handleMoveToSprint = (ticketId: string) => {
    if (activeSprint) {
      moveTicketToSprint(ticketId, activeSprint.id);
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
    <Container maxWidth="lg" sx={{ 
      mt: 2,
      backgroundColor: '#1976d2',
      minHeight: '100vh',
      pt: 4,
      borderRadius: '8px 8px 0 0',
    }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
        {formatMessage({ id: 'dashboard' })}
      </Typography>

      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'rgba(255,255,255,0.3)',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '8px 8px 0 0',
      }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(255,255,255,0.8)',
              '&.Mui-selected': {
                color: 'white',
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'white',
            }
          }}
        >
          <Tab label={formatMessage({ id: 'currentSprint' })} />
          <Tab label={formatMessage({ id: 'backlog' })} />
          <Tab label={formatMessage({ id: 'settings' })} />
        </Tabs>
      </Box>

      <Box sx={{ 
        backgroundColor: 'white', 
        borderRadius: '0 0 8px 8px',
        minHeight: '70vh',
      }}>
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            {activeSprint ? activeSprint.name : formatMessage({ id: 'noActiveSprint' })}
          </Typography>
          
          {/* My Tickets Section */}
          {mySprintTickets.length > 0 && (
            <Accordion defaultExpanded sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <UserAvatar user={user!} size="small" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formatMessage({ id: 'myTickets' })}
                  </Typography>
                  <Badge badgeContent={mySprintTickets.length} color="primary" />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {mySprintTickets.map(ticket => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onStatusChange={handleStatusChange}
                    onEdit={handleEditTicket}
                    onDelete={handleDeleteTicket}
                  />
                ))}
              </AccordionDetails>
            </Accordion>
          )}

          {/* Other Users Sections */}
          {otherUsersSprintTickets.map(({ user: teamUser, tickets: userTickets }) => (
            <Accordion key={teamUser.id} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <UserAvatar user={teamUser} size="small" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {teamUser.name}
                  </Typography>
                  <Badge badgeContent={userTickets.length} color="secondary" />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {userTickets.map(ticket => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onStatusChange={handleStatusChange}
                    onEdit={handleEditTicket}
                    onDelete={handleDeleteTicket}
                  />
                ))}
              </AccordionDetails>
            </Accordion>
          ))}

          {sprintTickets.length === 0 && (
            <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
              {formatMessage({ id: 'noTicketsInSprint' })}
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            {formatMessage({ id: 'backlog' })}
          </Typography>
          
          {/* Filter Section */}
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            backgroundColor: 'background.paper', 
            borderRadius: 2, 
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <FilterList />
              <Typography variant="h6">Filters</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Search by title"
                variant="outlined"
                size="small"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                sx={{ minWidth: 200 }}
              />
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Epic</InputLabel>
                <Select
                  value={epicFilter}
                  onChange={(e) => setEpicFilter(e.target.value)}
                  label="Filter by Epic"
                >
                  <MenuItem value="">All Epics</MenuItem>
                  {epics.map((epic) => (
                    <MenuItem key={epic.id} value={epic.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box 
                          sx={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%', 
                            backgroundColor: epic.color 
                          }} 
                        />
                        {epic.title}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Assignee</InputLabel>
                <Select
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  label="Filter by Assignee"
                >
                  <MenuItem value="">All Assignees</MenuItem>
                  <MenuItem value="unassigned">Unassigned</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <UserAvatar user={user} size="small" />
                        {user.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {(nameFilter || epicFilter || assigneeFilter) && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {backlogTickets.length} of {allBacklogTickets.length} tickets
                  </Typography>
                  <Chip
                    label="Clear Filters"
                    size="small"
                    onClick={() => {
                      setNameFilter('');
                      setEpicFilter('');
                      setAssigneeFilter('');
                    }}
                    onDelete={() => {
                      setNameFilter('');
                      setEpicFilter('');
                      setAssigneeFilter('');
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
          
          {/* My Backlog Tickets */}
          {myBacklogTickets.length > 0 && (
            <Accordion defaultExpanded sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <UserAvatar user={user!} size="small" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formatMessage({ id: 'myTickets' })}
                  </Typography>
                  <Badge badgeContent={myBacklogTickets.length} color="primary" />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {myBacklogTickets.map(ticket => (
                  <Box key={ticket.id} sx={{ position: 'relative' }}>
                    <TicketCard
                      ticket={ticket}
                      onStatusChange={handleStatusChange}
                      onEdit={handleEditTicket}
                      onDelete={handleDeleteTicket}
                    />
                    {activeSprint && (
                      <Fab
                        size="small"
                        color="primary"
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                        onClick={() => handleMoveToSprint(ticket.id)}
                      >
                        <Add />
                      </Fab>
                    )}
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          )}

          {/* Other Backlog Tickets */}
          {otherBacklogTickets.length > 0 && (
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {formatMessage({ id: 'otherTickets' })}
                  </Typography>
                  <Badge badgeContent={otherBacklogTickets.length} color="secondary" />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {otherBacklogTickets.map(ticket => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onStatusChange={handleStatusChange}
                    onEdit={handleEditTicket}
                    onDelete={handleDeleteTicket}
                  />
                ))}
              </AccordionDetails>
            </Accordion>
          )}

          {backlogTickets.length === 0 && (
            <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
              {formatMessage({ id: 'noTicketsInBacklog' })}
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <SettingsPanel />
        </TabPanel>
      </Box>

      {tabValue !== 2 && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{ 
            position: 'fixed', 
            bottom: 16, 
            right: 16,
          }}
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