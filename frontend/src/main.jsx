import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";

import { AuthProvider } from "./contexts/AuthContext";
import { StudentProvider } from "./contexts/StudentContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <StudentProvider>
                    <App />
                    <Toaster
                        position="top-right"
                    />
                </StudentProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);