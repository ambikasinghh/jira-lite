import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { useApp } from '../../contexts/AppContext';

export const AdminPanel: React.FC = () => {
  const { sprints, createSprint, setActiveSprint } = useApp();
  const [showSprintForm, setShowSprintForm] = useState(false);
  const [sprintData, setSprintData] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });

  const handleCreateSprint = () => {
    const startDate = new Date(sprintData.startDate);
    const endDate = new Date(sprintData.endDate);
    
    createSprint(sprintData.name, startDate, endDate);
    setSprintData({ name: '', startDate: '', endDate: '' });
    setShowSprintForm(false);
  };

  const handleActivateSprint = (sprintId: string) => {
    setActiveSprint(sprintId);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Admin Panel
      </Typography>
      
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            User management features would be implemented here in a real application.
            This could include creating new users, managing roles, and user permissions.
          </Typography>
          <Button variant="outlined" disabled>
            Manage Users (Demo)
          </Button>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Sprint Management
            </Typography>
            <Button
              variant="contained"
              onClick={() => setShowSprintForm(true)}
            >
              Create Sprint
            </Button>
          </Box>
          
          <List>
            {sprints.map((sprint) => (
              <ListItem key={sprint.id}>
                <ListItemText
                  primary={sprint.name}
                  secondary={`${sprint.startDate.toLocaleDateString()} - ${sprint.endDate.toLocaleDateString()} ${sprint.isActive ? '(Active)' : ''}`}
                />
                <ListItemSecondaryAction>
                  {!sprint.isActive && (
                    <Button
                      size="small"
                      onClick={() => handleActivateSprint(sprint.id)}
                      sx={{ mr: 1 }}
                    >
                      Activate
                    </Button>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Global Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Global application settings would be managed here.
          </Typography>
          <Button variant="outlined" disabled>
            Configure Settings (Demo)
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showSprintForm} onClose={() => setShowSprintForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Sprint</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Sprint Name"
              value={sprintData.name}
              onChange={(e) => setSprintData(prev => ({ ...prev, name: e.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="Start Date"
              type="date"
              value={sprintData.startDate}
              onChange={(e) => setSprintData(prev => ({ ...prev, startDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />
            <TextField
              label="End Date"
              type="date"
              value={sprintData.endDate}
              onChange={(e) => setSprintData(prev => ({ ...prev, endDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSprintForm(false)}>Cancel</Button>
          <Button onClick={handleCreateSprint} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};