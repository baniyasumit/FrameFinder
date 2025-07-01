
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import RegisterOverlay from './components/AuthOverlay/RegisterOverlay';
import LoginOverlay from './components/AuthOverlay/LoginOverlay';
import useAuthStore from './stateManagement/useAuthStore';
import { setupInterceptors } from './services/ApiInstance';
import { useEffect } from 'react';

function App() {
  const { showLogin, showRegister } = useAuthStore();
  const { logout } = useAuthStore();

  useEffect(() => {
    setupInterceptors(logout);
  }, [logout]);

  return (
    <Router>
      <Header />
      {showLogin && <LoginOverlay />}
      {showRegister && <RegisterOverlay />}
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
