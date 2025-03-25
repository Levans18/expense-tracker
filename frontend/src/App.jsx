import { Routes, Route } from 'react-router-dom';
import { useEffect } from "react";
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ExpensesPage from './pages/ExpensesPage';
import VerifiedPage from './pages/VerifiedPage';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  useEffect(() => {
    document.title = "Expense Tracker";
  }, []);

  const emojiFavicon = document.createElement("link");
  emojiFavicon.rel = "icon";
  emojiFavicon.href =
    "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%"

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
      <Route path="/verify" element={<VerifiedPage />} />
    </Routes>
  );
}

export default App;