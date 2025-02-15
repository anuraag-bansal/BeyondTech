# 🚀 E-Commerce Order & Delivery Tracking System

This is a **full-stack order and delivery tracking system** built using:
- **Frontend**: React.js with Material-UI
- **Backend**: Node.js, Express.js, MongoDB
- **Real-Time Communication**: WebSockets (`socket.io`)
- **AI Recommendations**: OpenAI API + LangChain
- **REST API**: Handles order creation, tracking, and user authentication

---

## 📌 Features

### 🛒 **Customer Features**
- Register/Login (JWT Authentication)
- Place an Order (Product, Quantity, Location)
- Track Order Status in **Real-Time** (`Pending → Accepted → Out for Delivery → Delivered`)
- Receive **AI-Based Product Recommendations**

### 🚚 **Delivery Partner Features**
- View All Pending Orders
- Accept Orders
- Update Order Status (`Out for Delivery`, `Delivered`)
- Send Live Order Updates via **WebSockets**

### 📡 **Real-Time Order Tracking**
- Customers see **live order status updates** without refreshing.
- **WebSockets (`socket.io`) ensure instant updates**.

### 🤖 **AI-Powered Order Recommendations**
- Uses **Gemini API** to fetch product recommendations.

---

## 📌 Tech Stack

| Technology  | Usage |
|-------------|----------------|
| **React.js** | Frontend (UI) |
| **Material-UI (MUI)** | Styling framework |
| **Node.js & Express.js** | Backend API |
| **MongoDB (Mongoose)** | Database |
| **WebSockets (`socket.io`)** | Real-time communication |
| **PM2** | Process manager for backend services |

---

## 📌 Setup Instructions

### 🔹 1. **Clone the Repository**
```sh
git clone https://github.com/anuraag-bansal/BeyondTech.git
cd BeyondTech
```

# Frontend (React.js)
```
cd frontend
npm install
```

# Backend (Node.js)
```
cd backend
npm install
```

### Set up env in backend
```
Create a .env file in the backend folder and add the following:
MONGO_URL=your_mongo_url
JWT_SECRET=your_jwt_secret
PORT=5001
ENVIRONEMT=dev
REACT_APP_SERVER_URL=yout_server_url
GEMINI_API_KEY=your_gemini_api_key
```

### Set up env in frontend
```
Create a .env file in the frontend folder and add the following:
REACT_APP_SERVER_URL=your_server_url
ENVIRONEMT=dev
```

### 🔹 2. **Start the Backend Server**
```sh
cd backend
npm start
```

### 🔹 3. **Start the Frontend Server**
```sh
cd frontend
npm start
```

The frontend will open up in your default browser at `http://localhost:3000`.

---

## API's:

### 1. POST /api/auth/register - 

This API is used to register a user. The request body should contain the following fields:

``````
- name: Name of the user
- email: Email of the user
- password: Password of the user
- role: Role of the user (customer or delivery)
``````

### 2. POST /api/auth/login 

This API is used to login a user. The request body should contain the following fields:
``````
- email: Email of the user
- password: Password of the user
``````

### 3. GET /api/auth/user

This API is used to get the details of the logged in user. The request should contain the JWT token in the Authorization header.

### 4. POST /api/orders

This API is used to create an order. The request body should contain the following fields:
``````
- product : Product name
- quantity : Quantity of the product
- location : Location of the delivery
``````

### 5. PUT /api/orders/:id/status

This API is used to update the status of an order. This API is only accessible to delivery partners.. The request body should contain the following fields:
``````
- status : Status of the order (Accepted, Out for Delivery, Delivered)
``````

### 6. GET /api/orders/pending

This API is used to get all pending orders.

### 7. GET /api/orders/customer

This API is used to get all orders of a customer.Or if the user is a delivery partner, it will return all orders assigned to the delivery partner.

### 8. GET /api/orders/history

This API is used to get all past orders of a customer which dont have the status as pending.

### 9. PUT /api/orders/accept/:id

This API is used to accept an order. This API is only accessible to delivery partners.

### 10. GET /api/recommendations 

This API is used to get product recommendations based on the user's past orders. The request should contain the JWT token in the Authorization header.


