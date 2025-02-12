import { useState } from "react";
import { registerUser } from "../api";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer"); // Default role
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await registerUser({ name, email, password, role });
            alert("Registration successful! Please login.");
            navigate("/login");
        } catch (err) {
            alert("Registration failed: " + err.response.data.message);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="customer">Customer</option>
                <option value="delivery">Delivery Partner</option>
            </select>

            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default Register;
