import { useEffect, useState } from "react";

const GlobalErrorBanner = () => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const error = window.localStorage.getItem("globalError");
    if (error) {
      setMessage(error);
    }
  }, []);

  if (!message) return null;

  return (
    <div className="bg-red-600 text-white p-4 text-center shadow-md z-50">
      <h2 className="text-lg font-semibold">😅 Heads up!</h2>
      <p>{message}</p>
      <p className="text-sm mt-1">Try again at the start of next month or set up the project locally.</p>
    </div>
  );
};

export default GlobalErrorBanner;