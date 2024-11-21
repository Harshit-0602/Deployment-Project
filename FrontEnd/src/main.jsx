import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App"; // Import App.js

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Wrap the entire application with Router */}
    <Router>
      <App />
    </Router>
  </StrictMode>
);
