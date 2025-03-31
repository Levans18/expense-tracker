import axios from "axios";

const isLocalhost =
  typeof window !== "undefined" && window.location.hostname === "localhost";

    export const API_BASE_URL = isLocalhost
    ? "http://localhost:8080"
    : "https://expense-tracker-github-hkcmdtbra4aacach.canadacentral-01.azurewebsites.net";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  withCredentials: true,
});

// Global error handling
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 503) {
      window.localStorage.setItem("globalError", err.response.data.message);
      window.location.reload(); // Force reload to show message on any route
    }
    return Promise.reject(err);
  }
);