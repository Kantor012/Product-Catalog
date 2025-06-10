# Product Catalog Application - Backend

This is the Node.js and Express-based backend that serves the API for the product catalog application. It works with a MongoDB database.

**Note: For complete setup instructions, including database setup with Docker, please see the main `README.md` file in the project's root directory.**

---

## 🚀 Core Technologies

-   **Runtime Environment**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB
-   **Authentication**: JSON Web Tokens (JWT)
-   **Environment Variables**: `dotenv`
-   **Password Hashing**: `bcryptjs`
-   **Email Service**: MailerSend

---

## 🛠️ Setup and Launch

### Prerequisites

-   **Node.js** (version >= 22.x)
-   **npm**

### Step 1: Install Dependencies

Navigate to the `backend` directory and install the required packages:

```sh
cd backend
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend` directory. Fill it with the required values. The `DB_URI` should point to your MongoDB instance. If you are using the Docker setup from the main README, the default value will work correctly.

```env
# Port on which the server will run
PORT=5000

# Base URL of the front-end application (for generating links in emails)
BASE_URL=http://localhost:5173

# Connection string for the MongoDB database
DB_URI=mongodb://localhost:27017/katalog_produktow

# Secret key for signing JWT tokens
JWT_SECRET=your_secret_jwt_key

# JWT token expiration time (e.g., 30d, 1h)
JWT_EXPIRATION=30d

# API Key from the MailerSend service (for sending verification emails)
MAILERSEND_API_KEY=your_mailersend_api_key

# Sender email address configured in MailerSend
MAILERSEND_SENDER_EMAIL=your_sender@email.com
```

### Step 3: Run the Backend Server

After completing the database setup (as described in the main README) and configuring your `.env` file, you can start the server.

#### Development mode (with auto-reloading):
```sh
npm run dev
```

#### Production mode:
```sh
npm start
```
The server will listen on the port defined in your `.env` file (defaults to `5000`).

---

## 🔌 API Endpoints

The server exposes the following main groups of endpoints:
-   `/api/products` - Operations on products
-   `/api/users` - Registration, login, and user management
-   `/api/categories` - Operations on product categories
-   `/api/recently-added` - Fetching recently added products