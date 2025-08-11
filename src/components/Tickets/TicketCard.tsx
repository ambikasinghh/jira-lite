import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { MoreVert, Person } from '@mui/icons-material';
import { Ticket, TicketStatus } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { useIntl } from 'react-intl';
import { useTheme } from '../../contexts/ThemeContext';
import { UserAvatar } from '../common/UserAvatar';

interface TicketCardProps {
  ticket: Ticket;
  onStatusChange: (ticketId: string, status: TicketStatus) => void;
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticketId: string) => void;
}

const statusColors = {
  'To Do': 'default' as const,
  'In Progress': 'primary' as const,
  'Ready to Merge': 'warning' as const,
  'Done': 'success' as const,
};

const typeColors = {
  'Story': 'success' as const,
  'Technical Story': 'info' as const,
  'Bug': 'error' as const,
};

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onStatusChange,
  onEdit,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { user, users } = useAuth();
  const { epics } = useApp();
  const { formatMessage } = useIntl();
  const { colors } = useTheme();
  
  const assignee = users.find(u => u.id === ticket.assigneeId);
  const creator = users.find(u => u.id === ticket.createdBy);
  const epic = epics.find(e => e.id === ticket.epicId);
  const canEdit = true;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (status: TicketStatus) => {
    onStatusChange(ticket.id, status);
    handleMenuClose();
  };

  return (
    <Card sx={{ 
      mb: 2, 
      cursor: 'pointer',
      background: colors.card.background,
      boxShadow: colors.card.shadow,
      '&:hover': {
        boxShadow: colors.card.hoverShadow,
        transform: 'translateY(-2px)',
      },
      transition: 'all 0.2s ease-in-out',
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
              {ticket.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {ticket.description}
            </Typography>
            
            {/* User info section */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
              {assignee && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <UserAvatar user={assignee} size="small" />
                  <Typography variant="caption" color="text.secondary">
                    {formatMessage({ id: 'assignedTo' }, { name: assignee.name })}
                  </Typography>
                </Box>
              )}
              {creator && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {formatMessage({ id: 'createdBy' }, { name: creator.name })}
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={formatMessage({ id: ticket.status.toLowerCase().replace(/ /g, '') as any })}
                color={statusColors[ticket.status]}
                size="small"
                sx={{ fontWeight: 500 }}
              />
              <Chip
                label={formatMessage({ id: ticket.type.toLowerCase().replace(' ', '') as any })}
                color={typeColors[ticket.type]}
                variant="outlined"
                size="small"
              />
              <Chip
                label={formatMessage({ id: 'points' }, { points: ticket.storyPoints })}
                variant="outlined"
                size="small"
              />
              {epic && (
                <Chip
                  label={epic.title}
                  size="small"
                  sx={{ 
                    backgroundColor: epic.color,
                    color: 'white',
                    fontWeight: 500,
                    '& .MuiChip-label': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }
                  }}
                  icon={
                    <Box 
                      sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        ml: 0.5
                      }} 
                    />
                  }
                />
              )}
            </Box>
          </Box>
          {canEdit && (
            <IconButton onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
          )}
        </Box>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => onEdit(ticket)}>{formatMessage({ id: 'edit' })}</MenuItem>
          <MenuItem onClick={() => handleStatusChange('To Do')}>{formatMessage({ id: 'moveToToDo' })}</MenuItem>
          <MenuItem onClick={() => handleStatusChange('In Progress')}>{formatMessage({ id: 'moveToInProgress' })}</MenuItem>
          <MenuItem onClick={() => handleStatusChange('Ready to Merge')}>{formatMessage({ id: 'moveToReadyToMerge' })}</MenuItem>
          <MenuItem onClick={() => handleStatusChange('Done')}>{formatMessage({ id: 'moveToDone' })}</MenuItem>
          <MenuItem onClick={() => onDelete(ticket.id)} sx={{ color: 'error.main' }}>
            {formatMessage({ id: 'delete' })}
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};