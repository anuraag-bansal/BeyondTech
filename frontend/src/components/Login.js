import { useState, useContext } from "react";
import { loginUser } from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);  // ✅ Ensure `AuthContext` is available
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await loginUser({ email, password });
            login(res.data); // ✅ Call `login` function from AuthContext
            const role = res.data.user.role
            navigate(role === "customer" ? "/customer-dashboard" : "/delivery-dashboard");
        } catch (err) {
            alert("Invalid credentials");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
