import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('http://localhost:8080/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      setUserData(res.data); // change as needed based on your API
    })
    .catch(err => {
      console.error('Unauthorized or error loading data:', err);
      navigate('/login');
    });
  }, [navigate, token]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>

        {userData ? (
          <div>
            <p className="mb-2">Hello, {userData.username || 'User'}!</p>
            {/* Replace/add more components here for expense summary, graphs, recent activity, etc. */}
          </div>
        ) : (
          <p>Loading your data...</p>
        )}
      </div>
    </div>
  );
}