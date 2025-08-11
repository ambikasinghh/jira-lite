import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { Ticket, TicketType, TicketStatus } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { UserAvatar } from '../common/UserAvatar';

interface TicketFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editTicket?: Ticket;
}

export const TicketForm: React.FC<TicketFormProps> = ({
  open,
  onClose,
  onSubmit,
  editTicket,
}) => {
  const { user, users } = useAuth();
  const { epics } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    storyPoints: 1,
    type: 'Story' as TicketType,
    status: 'To Do' as TicketStatus,
    epicId: '',
    assigneeId: '',
  });

  useEffect(() => {
    if (editTicket) {
      setFormData({
        title: editTicket.title,
        description: editTicket.description,
        storyPoints: editTicket.storyPoints,
        type: editTicket.type,
        status: editTicket.status,
        epicId: editTicket.epicId || '',
        assigneeId: editTicket.assigneeId || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        storyPoints: 1,
        type: 'Story',
        status: 'To Do',
        epicId: '',
        assigneeId: '',
      });
    }
  }, [editTicket, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    onSubmit({
      ...formData,
      epicId: formData.epicId || undefined,
      assigneeId: formData.assigneeId || undefined,
      createdBy: editTicket ? editTicket.createdBy : user.id,
      sprintId: editTicket?.sprintId,
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {editTicket ? 'Edit Ticket' : 'Create New Ticket'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              label="Story Points"
              type="number"
              value={formData.storyPoints}
              onChange={(e) => handleChange('storyPoints', Number(e.target.value))}
              inputProps={{ min: 1, max: 21 }}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                label="Type"
              >
                <MenuItem value="Story">Story</MenuItem>
                <MenuItem value="Technical Story">Technical Story</MenuItem>
                <MenuItem value="Bug">Bug</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                label="Status"
              >
                <MenuItem value="To Do">To Do</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Ready to Merge">Ready to Merge</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Epic</InputLabel>
              <Select
                value={formData.epicId}
                onChange={(e) => handleChange('epicId', e.target.value)}
                label="Epic"
              >
                <MenuItem value="">No Epic</MenuItem>
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
            <FormControl fullWidth>
              <InputLabel>Assignee</InputLabel>
              <Select
                value={formData.assigneeId}
                onChange={(e) => handleChange('assigneeId', e.target.value)}
                label="Assignee"
              >
                <MenuItem value="">Unassigned</MenuItem>
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {editTicket ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};