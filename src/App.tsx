import { useState, useEffect } from 'react';
import Gatekeeper from './components/Gatekeeper';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('moshitech_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthenticate = () => {
    sessionStorage.setItem('moshitech_auth', 'true');
    setIsAuthenticated(true);
  };

  return isAuthenticated ? (
    <Dashboard />
  ) : (
    <Gatekeeper onAuthenticate={handleAuthenticate} />
  );
}

export default App;
