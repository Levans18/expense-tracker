const isLocalhost =
  typeof window !== "undefined" && window.location.hostname === "localhost";

    export const API_BASE_URL = isLocalhost
    ? "http://localhost:8080"
    : "/prod"; // This gets rewritten by vercel.json in prod