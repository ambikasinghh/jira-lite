import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LocaleIntlProvider } from './contexts/LocaleContext';
import { Header } from './components/Layout/Header';
import { LoginForm } from './components/Auth/LoginForm';
import { UserDashboard } from './components/Dashboard/UserDashboard';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <>
      <Header />
      <Routes>
        <Route 
          path="/dashboard" 
          element={
            user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LocaleIntlProvider>
        <AuthProvider>
          <AppProvider>
            <Router>
              <AppContent />
            </Router>
          </AppProvider>
        </AuthProvider>
      </LocaleIntlProvider>
    </ThemeProvider>
  );
};

export default App;