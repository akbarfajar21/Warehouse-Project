import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import AuthProvider from "./auth/AuthProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <NextUIProvider>
        <App />
      </NextUIProvider>
    </AuthProvider>
  </React.StrictMode>
);
