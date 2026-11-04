
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";
import Welcome from "./Welcome.jsx";
import Login from "./Login.jsx";

function Main() {
  const [page, setPage] = useState("welcome");

  function handleLogin() {
  setPage("dashboard");
}

function handleLogout() {
  setPage("login");
}

  return (
    <>
      {page === "welcome" && (
        <Welcome onGetStarted={() => setPage("login")} />
      )}

      {page === "login" && (
        <Login
          onLogin={handleLogin}
          onBack={() => setPage("welcome")}
        />
      )}

      {page === "dashboard" && <App onLogout={handleLogout} />}
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
