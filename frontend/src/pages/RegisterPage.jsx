import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import { API_BASE_URL } from '../services/api'

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // clear previous errors
  
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
  
      if (res.ok) {
        navigate('/login');
      } else {
        const errorText = await res.text();
        setErrorMessage(errorText || 'Registration failed.');
      }
    } catch (err) {
      console.error('Error registering:', err);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-md">
        <Link to="/" className="absolute top-6 left-6 text-white hover:text-green-400 transition">
          <ArrowBackIcon fontSize="large" />
        </Link>
        <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">Create Account</h2>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input
            name="email"
            type="text"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="bg-green-500 hover:bg-green-600 rounded-md py-2 font-semibold transition">
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center text-gray-400 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-green-400 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}