
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import DefaultLayout from './routes/DefaultLayout';
import PhotographerLayout from './routes/PhotographerLayout';
import NotFound from './pages/NotFound/NotFound';
import Profile from './pages/Profile/Profile';
import { DynamicLayout } from './routes/DynamicLayout';

const App = () => {
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
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<RegisterClient />} />
          <Route path='/otp-verification-email' element={<OTP />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          <Route path='/register-photographer' element={<RegisterPhotographer />} />

        </Route>

        <Route element={<RoleRoute allowedRoles={['photographer']} />}>
          <Route element={<PhotographerLayout />}>
            <Route path='/dashboard' element={<Dashboard />} />
          </Route>
        </Route>
        <Route element={<RoleRoute allowedRoles={['client']} />}>
          <Route element={<DefaultLayout />}>
            <Route path='/checkout' element={<Dashboard />} />
          </Route>
        </Route>
        <Route element={<RoleRoute allowedRoles={['client', 'photographer']} />}>
          <Route element={<DynamicLayout />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
