import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.render(
    <AuthProvider>  {/* ✅ Wrap App inside AuthProvider */}
        <App />
    </AuthProvider>,
    document.getElementById("root")
);
