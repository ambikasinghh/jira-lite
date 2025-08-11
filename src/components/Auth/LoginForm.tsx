import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useIntl } from 'react-intl';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { formatMessage } = useIntl();
  const { colors } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email);
    } catch (err) {
      setError(formatMessage({ id: 'loginFailed' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
      }}
    >
      <Paper sx={{ 
        p: 4, 
        minWidth: 400,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        borderRadius: '16px',
      }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{
          fontWeight: 'bold',
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {formatMessage({ id: 'appTitle' })}
        </Typography>
        <Typography variant="body1" gutterBottom align="center" color="text.secondary" sx={{ mb: 3 }}>
          {formatMessage({ id: 'signInToContinue' })}
        </Typography>
        
        <Box sx={{ mt: 3, mb: 2, p: 2, backgroundColor: 'rgba(102, 126, 234, 0.1)', borderRadius: '8px' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
            {formatMessage({ id: 'demoAccounts' })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • {formatMessage({ id: 'adminAccount' })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • {formatMessage({ id: 'userAccount' })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • alice@example.com (Alice Smith)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • bob@example.com (Bob Johnson)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • sarah@example.com (Sarah Wilson)
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={formatMessage({ id: 'email' })}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#667eea',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                },
              }
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 3, 
              mb: 2,
              background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #68519a 100%)',
              },
              fontWeight: 'bold',
              py: 1.5,
            }}
            disabled={loading}
          >
            {loading ? formatMessage({ id: 'signingIn' }) : formatMessage({ id: 'signIn' })}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};