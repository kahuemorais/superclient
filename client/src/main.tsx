import React from "react";
import ReactDOM from "react-dom/client";
import { Router } from "wouter";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import App from "./App.tsx";
import "./index.css";

const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router base={base === "" ? "/" : base}>
      <App />
    </Router>
  </React.StrictMode>,
)
