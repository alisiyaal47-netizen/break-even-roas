import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * main.tsx
 *
 * The very first file that runs.
 * It finds the <div id="root"> in index.html,
 * creates a React root, and renders the App component.
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
