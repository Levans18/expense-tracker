import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function CategorySelect({ value, onChange, token }) {
  const [categories, setCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setCategories(res.data))
    .catch(err => console.error('Failed to fetch categories:', err));
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCategory = categories.find(cat => cat.id === value);

  const handleDeleteCategory = (catId) => {
    axios.delete(`${API_BASE_URL}/api/categories/${catId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      setCategories((prev) => prev.filter(cat => cat.id !== catId));
      if (value === catId) onChange(null);
    })
    .catch((err) => {
      console.error('Failed to delete category:', err);
      alert('Failed to delete. This category may be in use.');
    });
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;

    axios.post(`${API_BASE_URL}/api/categories`, { name: newCategoryName }, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      const newCat = res.data;
      setCategories([...categories, newCat]);
      onChange(newCat.id);
      setNewCategoryName('');
      setShowModal(false);
    })
    .catch(err => {
      console.error('Failed to create category:', err);
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="w-full bg-[#1a1a1a] text-left p-2 border border-[#333] rounded flex justify-between items-center"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {selectedCategory ? selectedCategory.name : 'Select category'}
        <ArrowDropDownIcon />
      </button>

      {dropdownOpen && (
        <div className="absolute z-50 bg-[#111] border border-[#333] rounded mt-1 w-full max-h-60 overflow-y-auto shadow-lg">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex justify-between items-center px-3 py-2 hover:bg-[#222] cursor-pointer"
              onClick={() => {
                onChange(cat.id);
                setDropdownOpen(false);
              }}
            >
              <span>{cat.name}</span>
              {!cat.global && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(cat.id);
                  }}
                  className="text-red-400 hover:text-red-500"
                >
                  <DeleteIcon fontSize="small" />
                </button>
              )}
            </div>
          ))}

          <div
            className="px-3 py-2 hover:bg-[#222] text-[#00ff94] cursor-pointer"
            onClick={() => {
              setShowModal(true);
              setDropdownOpen(false);
            }}
          >
            ➕ Add New Category
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-2xl w-full max-w-md shadow-lg text-white relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold text-[#00ff94] mb-4">New Category</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateCategory();
              }}
            >
              <input
                type="text"
                placeholder="Category name"
                className="w-full p-2 rounded bg-[#1a1a1a] border border-[#333] focus:outline-none mb-4"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="w-full bg-[#00ff94] text-black font-semibold py-2 rounded-xl hover:brightness-110 transition"
              >
                Add Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
