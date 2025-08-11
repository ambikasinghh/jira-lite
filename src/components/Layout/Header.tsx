import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useIntl } from 'react-intl';
import { UserAvatar } from '../common/UserAvatar';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { formatMessage } = useIntl();
  const { colors } = useTheme();

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: colors.primary.main,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ 
          flexGrow: 1, 
          fontWeight: 'bold',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}>
          {formatMessage({ id: 'appTitle' })}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <UserAvatar user={user!} size="small" />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {formatMessage({ id: 'welcomeMessage' }, { name: user?.name || '' })}
          </Typography>
          <Button 
            color="inherit" 
            onClick={logout}
            sx={{ 
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            {formatMessage({ id: 'logout' })}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};