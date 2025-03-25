import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../services/api'
import Alert from '@mui/material/Alert';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        identifier,
        password,
      });

      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);

      const errorMessage =
        err.response?.data && typeof err.response.data === 'string'
          ? err.response.data
          : 'Login Failed: Check Logs';

          setErrorMessage(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-md">
        <Link to="/" className="absolute top-6 left-6 text-white hover:text-green-400 transition">
          <ArrowBackIcon fontSize="large" />
        </Link>
        <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">Login</h2>
                {errorMessage && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {errorMessage}
                  </Alert>
                )}
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Username or Email"
            className="bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="bg-green-500 hover:bg-green-600 rounded-md py-2 font-semibold transition">
            Sign In
          </button>
        </form>
        <p className="text-sm text-center text-gray-400 mt-4">
          Don't have an account yet?{' '}
          <a href="/Register" className="text-green-400 hover:underline">
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}