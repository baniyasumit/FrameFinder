
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import useAuthStore from './stateManagement/useAuthStore';
import { setupInterceptors } from './services/ApiInstance';
import { useEffect } from 'react';
import { refreshUser } from './services/AuthServices';
import RoleRoute from './routes/RoleRoute';
import { Toaster } from 'sonner';
import Dashboard from './pages/Dashboard/Dashboard';
import OTP from './pages/Auth/OTP';
import Login from './pages/Auth/Login';
import ResetPassword from './pages/Auth/ResetPassword';
import RegisterClient from './pages/Auth/RegisterClient';
import RegisterPhotographer from './pages/Auth/RegisterPhotographer';

function App() {
  const { setUser } = useAuthStore();
  const { logout } = useAuthStore();

  useEffect(() => {
    setupInterceptors(logout);
  }, [logout]);


  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await refreshUser();
        setUser(userData);
      } catch (error) {
        console.error("Load User Error: ", error)
        setUser(null);
      }
    };

    loadUser();

  }, [setUser]);

  return (
    <Router>
      <Toaster position="bottom-center" richColors />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<RegisterClient />} />
        <Route path='/otp-verification-email' element={<OTP />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='/register-photographer' element={<RegisterPhotographer />} />

        <Route element={<RoleRoute allowedRoles={['photographer']} />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<RoleRoute allowedRoles={['client']} />}>
          <Route path='/checkout' element={<Dashboard />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
