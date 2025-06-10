# Product Catalog Application - Backend

A Node.js and Express-based backend that serves as the API for the product catalog application. It works with a MongoDB database.

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

## 🛠️ Setup and Launch (from scratch)

### Prerequisites

-   **Node.js** (version >= 18.x)
-   **npm**
-   **Docker** (recommended for running the MongoDB database)

### Step 1: Install Dependencies

Navigate to the `backend` directory and install the required packages:

```sh
cd backend
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend` directory. You can fill it with the required values based on the `config/index.js` configuration file.

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
**Important:** Replace `JWT_SECRET`, `MAILERSEND_API_KEY`, and `MAILERSEND_SENDER_EMAIL` with your own values.

### Step 3: Run the MongoDB Database

The easiest way is to use Docker. Run a MongoDB container using the command below:

```sh
docker run -d -p 27017:27017 --name mongo-catalog mongo
```
This command will pull the `mongo` image, start a container named `mongo-catalog`, and map the database port `27017` to your host machine.

### Step 4: Seed the Database

The project includes a `seed.js` script that creates collections and populates them with initial data (categories, products, an admin user).

To copy the `seed.js` file to the MongoDB container, use the following command:

```sh
docker cp seed.js mongo-catalog:/seed.js
```

Then, execute the script inside the MongoDB container to initialize the database:

```sh
docker exec -it mongo-katalog mongosh "mongodb://localhost:27017" --file seed.js
```
After the script runs, a default admin user will be created with the following credentials:
-   **Email**: `mail@example.com`
-   **Password**: `root`

### Step 5: Run the Backend Server

After completing all the above steps, you can start the server.

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

The detailed route structure is defined in the files within the `routes` directory.
