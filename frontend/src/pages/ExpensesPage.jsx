import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Fab, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { API_BASE_URL } from '../services/api';

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', amount: '', date: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/expenses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setExpenses(res.data);
        setShowHint(res.data.length === 0);
      })
      .catch((err) => {
        console.error('Failed to fetch expenses:', err);
        navigate('/dashboard');
      });
  }, [navigate, token]);

  const handleAddExpense = () => {
    if (!token) return;
    const newExpense = {
      name: form.name,
      category: form.category,
      amount: parseFloat(form.amount),
      date: form.date,
    };

    axios
      .post(`${API_BASE_URL}/api/expenses`, newExpense, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setExpenses([res.data, ...expenses]);
        setForm({ name: '', category: '', amount: '', date: '' });
        setShowModal(false);
        setShowHint(false);
      })
      .catch((err) => console.error('Failed to add expense:', err));
  };

  const handleDeleteExpense = (id) => {
    axios
      .delete(`${API_BASE_URL}/api/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        const updatedExpenses = expenses.filter((expense) => expense.id !== id);
        setExpenses(updatedExpenses);
        if (updatedExpenses.length === 0) setShowHint(true);
      })
      .catch((err) => console.error('Failed to delete expense:', err));
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      {/* Back to Dashboard */}
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-4 flex items-center text-sm text-gray-300 hover:text-[#00ff94] transition"
      >
        <ArrowBackIcon fontSize="small" className="mr-1" />
        Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold text-[#00ff94] mb-6">Expenses</h1>

      <div className="bg-[#111] rounded-2xl p-4 shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-sm">
              <th className="py-2 pl-4">Name</th> {/* <-- Added left padding */}
              <th className="py-2">Category</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Date</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-6">
                  No expenses found.
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense.id} className="border-t border-[#222] hover:bg-[#1a1a1a]">
                  <td className="py-3 pl-4 font-medium">{expense.name}</td> {/* <-- Padding here too */}
                  <td className="py-3">{expense.category}</td>
                  <td className="py-3 text-[#00ff94]">${expense.amount.toFixed(2)}</td>
                  <td className="py-3 text-sm text-gray-400">{expense.date}</td>
                  <td className="py-3">
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDeleteExpense(expense.id)} sx={{ color: '#f87171' }}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Add Button */}
      <Fab
        color="primary"
        onClick={() => setShowModal(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: '#00ff94',
          color: 'black',
          '&:hover': { backgroundColor: '#00e283' },
        }}
      >
        <AddIcon />
      </Fab>

      {/* Bounce Animation to Hint */}
      {showHint && (
        <div className="fixed bottom-8 right-28 animate-bounce-x z-50 ease-in-out bg-zinc-800 text-white px-4 py-2 rounded-xl shadow-lg border border-zinc-700 text-sm">
          Click the "+" to add your first expense 👉
        </div>
      )}

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-2xl w-full max-w-md shadow-lg text-white relative">
            <IconButton
              onClick={() => setShowModal(false)}
              sx={{ position: 'absolute', top: 16, right: 16, color: '#888' }}
            >
              <CloseIcon />
            </IconButton>
            <h2 className="text-2xl font-semibold text-[#00ff94] mb-4">Add Expense</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full p-2 rounded bg-[#1a1a1a] border border-[#333] focus:outline-none"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Category"
                className="w-full p-2 rounded bg-[#1a1a1a] border border-[#333] focus:outline-none"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <input
                type="number"
                placeholder="Amount"
                className="w-full p-2 rounded bg-[#1a1a1a] border border-[#333] focus:outline-none"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
              <input
                type="date"
                className="w-full p-2 rounded bg-[#1a1a1a] border border-[#333] focus:outline-none"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <button
                className="w-full bg-[#00ff94] text-black font-semibold py-2 rounded-xl hover:brightness-110 transition"
                onClick={handleAddExpense}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpensesPage;

