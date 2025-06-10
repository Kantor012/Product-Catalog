# Product Catalog Application

This repository contains the full source code for a full-stack product catalog application. It features a Vue.js frontend and a Node.js (Express) backend.

- **/frontend**: A modern frontend application built with Vue 3, Vite, and Pinia.
- **/backend**: A RESTful API backend powered by Node.js, Express, and MongoDB.

Please refer to the `README.md` files within each respective directory for more detailed information.

---

## 🚀 Full Application Quick Start

This guide explains how to set up the database, backend, and frontend to run the entire application locally.

### Prerequisites

-   **Node.js** (version >= 22.x recommended)
-   **npm**
-   **Docker** (for running the MongoDB database)

### Step 1: Run the MongoDB Database with Docker

Use Docker to start a MongoDB container. This command will download the official MongoDB image and run it in the background on the standard port `27017`.

```sh
docker run -d -p 27017:27017 --name mongo-catalog mongo
```

### Step 2: Seed the Database

The project includes a script to populate the database with initial categories, products, reviews, and a default admin user.

Run the following command from the **root directory of this project**:

```sh
docker exec -it mongo-catalog mongosh "mongodb://localhost:27017" --file seed.js
```

After the script runs, a default admin user will be created with the following credentials:
-   **Email**: `mail@example.com`
-   **Password**: `root`

### Step 3: Configure and Run the Backend

1.  **Navigate to the backend directory:**
    ```sh
    cd backend
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Create an environment file.** Create a `.env` file in the `/backend` directory and add the necessary configuration. See `backend/README.md` for a full list of variables. For this setup, ensure your `DB_URI` is correct:
    ```env
    DB_URI=mongodb://localhost:27017/mongo-catalog
    PORT=5000
    JWT_SECRET=your_super_secret_key
    # Add other variables like MailerSend keys if needed
    ```
4.  **Start the backend server:**
    ```sh
    npm run dev
    ```
    The API will be running at `http://localhost:5000`.

### Step 4: Configure and Run the Frontend

1.  **In a new terminal**, navigate to the frontend directory:
    ```sh
    cd frontend
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Create an environment file.** Create a `.env` file in the `/frontend` directory and point it to your running backend API:
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```
4.  **Start the frontend development server:**
    ```sh
    npm run dev
    ```
    The frontend application will be available at `http://localhost:5173`. You can now open this URL in your browser to use the application.