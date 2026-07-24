import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <LoginPage onLogin={(userData) => setUser(userData)} />;
  }

  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}

export default App;
