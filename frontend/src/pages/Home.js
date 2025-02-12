import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="home-container">
            <h1>🚀 Welcome to Quick Commerce</h1>
            <p>Track your orders and manage deliveries in real-time.</p>

            <div className="buttons">
                <Link to="/register">
                    <button>Register</button>
                </Link>
                <Link to="/login">
                    <button>Login</button>
                </Link>
            </div>
        </div>
    );
};

export default Home;
