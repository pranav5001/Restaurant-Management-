import React, { useState } from 'react';
import { RestaurantProvider } from './context/RestaurantContext';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

function AppContent() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <LoginPage onLogin={(userData) => setUser(userData)} />;
  }

  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}

export default function App() {
  return (
    <RestaurantProvider>
      <AppContent />
    </RestaurantProvider>
  );
}
