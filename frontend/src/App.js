
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import RegisterOverlay from './components/AuthOverlay/RegisterOverlay';
import { useAuth } from './assets/contexts/AuthContext';
import LoginOverlay from './components/AuthOverlay/LoginOverlay';

function App() {
  const { showLogin, showRegister } = useAuth();

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
