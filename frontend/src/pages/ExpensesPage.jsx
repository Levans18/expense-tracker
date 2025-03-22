import { useState } from 'react';
import { Fab, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ description: '', amount: '', date: '' });

  const handleAddExpense = () => {
    const newExpense = {
      id: expenses.length + 1,
      description: form.description,
      amount: parseFloat(form.amount),
      date: form.date,
    };
    setExpenses([newExpense, ...expenses]);
    setForm({ description: '', amount: '', date: '' });
    setShowModal(false);
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      <h1 className="text-3xl font-bold text-[#00ff94] mb-6">Expenses</h1>

      <div className="bg-[#111] rounded-2xl p-4 shadow-md">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-sm">
              <th className="py-2">Description</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Date</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-t border-[#222] hover:bg-[#1a1a1a]">
                <td className="py-3 font-medium">{expense.description}</td>
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Floating Add Button */}
      <Fab
        color="primary"
        onClick={() => setShowModal(true)}
        sx={{ position: 'fixed', bottom: 24, right: 24, backgroundColor: '#00ff94', color: 'black', '&:hover': { backgroundColor: '#00e283' } }}
      >
        <AddIcon />
      </Fab>

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
                placeholder="Description"
                className="w-full p-2 rounded bg-[#1a1a1a] border border-[#333] focus:outline-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
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
