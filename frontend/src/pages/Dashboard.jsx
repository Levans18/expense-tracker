import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('/backend/auth/me', {
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
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Top Nav */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
        <h1 className="text-2xl font-bold text-[#00ff94]">
          Expense Tracker
        </h1>
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

      {/* Content */}
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-4">Welcome back 👋</h2>
        <p className="text-gray-400 mb-8">
          Let’s get started tracking those expenses.
        </p>
        <Link
          to="/expenses"
          className="bg-[#00ff94] text-black px-6 py-3 rounded-2xl font-semibold transition hover:brightness-110"
        >
          Go to Expense Tracker
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;