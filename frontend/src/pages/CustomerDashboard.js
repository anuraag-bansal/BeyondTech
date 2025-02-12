import OrderForm from "../components/OrderForm";
import OrdersList from "../components/OrdersList";

const CustomerDashboard = () => {
    return (
        <div>
            <h2>Customer Dashboard</h2>
            <OrderForm />
            <OrdersList />
        </div>
    );
};

export default CustomerDashboard;
