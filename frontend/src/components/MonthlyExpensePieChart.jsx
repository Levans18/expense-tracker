import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#a4de6c'];

const MonthlyExpensePieChart = () => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/expenses/month-category-summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        const transformed = Object.entries(res.data).map(([category, amount]) => ({
          name: category,
          value: amount
        }));
        setData(transformed);
      })
      .catch(err => {
        console.error('Failed to load chart data', err);
      });
  }, [token]);

  if (data.length === 0) return null;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h3 className="text-xl font-semibold mb-4 text-center">📊 Monthly Spending by Category</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            innerRadius="50%"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            wrapperStyle={{ zIndex: 1000 }}
            contentStyle={{ backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 0.75rem' }}
            itemStyle={{ color: '#000' }}
            formatter={(value) => [`$${value.toFixed(2)}`, 'Spent']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyExpensePieChart;
