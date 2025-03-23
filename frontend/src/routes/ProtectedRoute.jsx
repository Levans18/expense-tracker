import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/auth/me", {
          credentials: "include", // if your token is in a cookie
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // if in localStorage
          },
        });

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error(err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : null;
};

export default ProtectedRoute;