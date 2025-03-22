import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('/backend/api/expenses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setExpenses(response.data);
      } catch (err) {
        console.error('Failed to fetch expenses:', err);
        setError('Could not load expenses');
      }
    };

    fetchExpenses();
  }, [token]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-bold mb-4">Your Expenses</h1>

        {error && <p className="text-red-500">{error}</p>}

        {expenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border-b">Name</th>
                <th className="p-2 border-b">Category</th>
                <th className="p-2 border-b">Amount</th>
                <th className="p-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="p-2 border-b">{expense.name}</td>
                  <td className="p-2 border-b">{expense.category}</td>
                  <td className="p-2 border-b">${expense.amount}</td>
                  <td className="p-2 border-b">
                    <button className="text-red-600 hover:underline text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Add expense form */}
      </div>
    </div>
  );
}
