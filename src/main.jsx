import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import JuicyPage from "./pages/JuicyPage.jsx";
import "./index.css";

const isJuicyRoute =
  typeof window !== "undefined" &&
  (window.location.pathname.toLowerCase().startsWith("/juicy") ||
    window.location.hash.toLowerCase().startsWith("#/juicy"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/juicy" element={<JuicyPage />} />
        <Route path="/juicy/*" element={<JuicyPage />} />
        <Route path="/*" element={isJuicyRoute ? <JuicyPage /> : <App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
