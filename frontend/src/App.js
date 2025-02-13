import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {ThemeProvider} from "@mui/material/styles";
import theme from "./theme";
import Home from "./pages/Home";
import Login from "./components/Login";
import Register from "./components/Register";  // Import Register Component
import CustomerDashboard from "./pages/CustomerDashboard";
import DeliveryDashboard from "./pages/DeliveryDashboard";

const App = () => {
    return (
        <ThemeProvider theme={theme}>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/customer-dashboard" element={<CustomerDashboard />} />
                <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
            </Routes>
        </Router>
        </ThemeProvider>
    );
};

export default App;
