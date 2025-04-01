import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../services/api';
import MonthlyExpensePieChart from '../components/MonthlyExpensePieChart';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => setUserData(res.data))
      .catch(err => {
        console.error('Unauthorized or error loading user:', err);
        navigate('/login');
      });
  }, [navigate, token]);

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="h-screen bg-[#000000] text-white flex flex-col">
      {/* Top Nav */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
        <h1 className="text-2xl font-bold text-[#00ff94]">Expense Tracker</h1>
        {userData && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00ff94] text-black flex items-center justify-center font-bold">
              {getInitials(userData.username)}
            </div>
            <div className="text-sm">
              <p className="font-semibold">{userData.username}</p>
              <button onClick={handleLogout} className="text-[#00ff94] hover:underline">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 grid-rows-2 gap-6 flex-grow p-6 max-h-[calc(100vh-72px)]">
        {/* Welcome Block */}
        <div className="bg-[#111] rounded-2xl p-6 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-[#00ff9480] flex flex-col justify-center items-center text-center">
          <h2 className="text-2xl font-semibold mb-2">Welcome back 👋</h2>
          <p className="text-gray-400 mb-6">Let’s get started tracking those expenses.</p>
          <Link
            to="/expenses"
            className="bg-[#00ff94] text-black px-6 py-3 rounded-2xl font-semibold transition hover:brightness-110"
          >
            Go to Expense Tracker
          </Link>
        </div>

        {/* Pie Chart Block */}
        <div className="bg-[#111] rounded-2xl p-6 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-[#00ff9480] flex items-center justify-center">
          <MonthlyExpensePieChart />
        </div>

        {/* Add Expense Placeholder */}
        <div className="bg-[#111] rounded-2xl p-6 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-[#00ff9480] flex flex-col justify-center items-center text-center">
          <h3 className="text-xl font-semibold mb-2">➕ Add a New Expense</h3>
          <p className="text-gray-400 text-sm">
            Soon you'll be able to add expenses right from the dashboard.
          </p>
        </div>

        {/* Budget Placeholder */}
        <div className="bg-[#111] rounded-2xl p-6 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-[#00ff9480] flex flex-col justify-center items-center text-center">
          <h3 className="text-xl font-semibold mb-2">📅 Set Your Monthly Budget</h3>
          <p className="text-gray-400 text-sm">
            Coming soon — set limits for categories and get notified when you’re close to overspending.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
