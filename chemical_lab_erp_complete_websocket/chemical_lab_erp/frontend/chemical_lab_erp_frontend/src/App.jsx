import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import Login from './components/Login';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { login } from './api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [currentSection, setCurrentSection] = useState('dashboard');

  useEffect(() => {
    const savedUser = localStorage.getItem('labSystem_currentUser');
    const savedToken = localStorage.getItem('labSystem_token');
    if (savedUser && savedToken) {
      setCurrentUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const handleLogin = async (loginData) => {
    setCurrentUser(loginData.user);
    setToken(loginData.token);
    localStorage.setItem('labSystem_currentUser', JSON.stringify(loginData.user));
    localStorage.setItem('labSystem_token', loginData.token);
    setCurrentSection('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('labSystem_currentUser');
    localStorage.removeItem('labSystem_token');
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={`min-h-screen bg-gray-100 role-${currentUser.role}`}>
      <Header user={currentUser} onLogout={handleLogout} />
      <div className="flex">
        <Sidebar
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          userRole={currentUser.role}
        />
        <MainContent
          currentSection={currentSection}
          user={currentUser}
          token={token}
        />
      </div>
    </div>
  );
}

export default App;
