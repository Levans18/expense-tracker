import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MuiButton from '@mui/material/Button'; // MUI Button

const VerifiedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const status = new URLSearchParams(location.search).get('status');

  const getMessage = () => {
    switch (status) {
      case 'success':
        return '✅ Your email has been verified successfully!';
      case 'already':
        return '🔁 This account has already been verified.';
      case 'invalid':
        return '❌ The verification link is invalid or expired.';
      default:
        return 'ℹ️ Verification status unknown.';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="bg-zinc-900 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-semibold mb-4">Email Verification</h1>
        <p className="text-base mb-6">{getMessage()}</p>
        <MuiButton
          variant="contained"
          fullWidth
          onClick={() => navigate('/login')}
          sx={{ backgroundColor: '#22c55e', '&:hover': { backgroundColor: '#16a34a' } }}
        >
          Go to Login
        </MuiButton>
      </div>
    </div>
  );
};

export default VerifiedPage;