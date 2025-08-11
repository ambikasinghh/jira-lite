import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useIntl } from 'react-intl';
import { UserAvatar } from '../common/UserAvatar';

export const SettingsPanel: React.FC = () => {
  const { user, logout, updateUserPhoto } = useAuth();
  const { formatMessage } = useIntl();

  const handlePhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const photoUrl = e.target?.result as string;
      updateUserPhoto(photoUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
        {formatMessage({ id: 'settings' })}
      </Typography>
      
      <Card sx={{ 
        mb: 2,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
            {formatMessage({ id: 'userProfile' })}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <UserAvatar 
              user={user!} 
              size="large" 
              showUploadButton 
              onPhotoUpload={handlePhotoUpload}
            />
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body1">
              <strong>{formatMessage({ id: 'name' })}:</strong> {user?.name}
            </Typography>
            <Typography variant="body1">
              <strong>{formatMessage({ id: 'email' })}:</strong> {user?.email}
            </Typography>
            <Typography variant="body1">
              <strong>{formatMessage({ id: 'role' })}:</strong> {user?.role}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
            {formatMessage({ id: 'accountActions' })}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Button
            variant="outlined"
            color="error"
            onClick={logout}
            sx={{ 
              mt: 1,
              '&:hover': {
                background: 'linear-gradient(135deg, #ff6b6b, #ff5252)',
                color: 'white',
              }
            }}
          >
            {formatMessage({ id: 'logout' })}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};