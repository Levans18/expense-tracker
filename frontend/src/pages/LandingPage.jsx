import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-center p-6">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">💸 Expense Tracker</h1>
      <p className="text-lg md:text-xl mb-8 max-w-xl">
        Track your spending, manage your budget, and take control of your finances.
        Secure and simple to use.
      </p>
      <div className="space-x-4">
        <Link to="/register">
          <button className="bg-white text-indigo-600 font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition">
            Register
          </button>
        </Link>
        <Link to="/login">
          <button className="bg-indigo-700 text-white font-semibold px-6 py-2 rounded-full hover:bg-indigo-800 transition">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}