const isLocalhost =
  typeof window !== "undefined" && window.location.hostname === "localhost";

    export const API_BASE_URL = isLocalhost
    ? "http://localhost:8080"
    : "https://expense-tracker-github.azurewebsites.net";