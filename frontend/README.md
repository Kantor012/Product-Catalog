# Product Catalog App - Frontend

This is the frontend for the product catalog application, built with Vue 3, Vite, and TypeScript. It provides a rich user interface for Browse products and a comprehensive set of tools for administrators.

---

## 🚀 Core Technologies

-   **Framework**: Vue 3 (Composition API)
-   **Bundler**: Vite
-   **Language**: TypeScript
-   **State Management**: Pinia
-   **Routing**: Vue Router
-   **HTTP Client**: Axios

---

## ✨ Key Features

-   **User Authentication**: Full auth system including registration with email verification, login, and user profile management.
-   **Product Catalog**: Advanced product Browse with features like search, filtering by category and price, and sorting.
-   **Detailed Product View**: A comprehensive view for each product, displaying all details, paginated user reviews, and recommended products.
-   **Admin Panel**: A centralized dashboard for administrators to perform CRUD (Create, Read, Update, Delete) operations on products and users.
-   **Advanced In-Page Admin Controls**:
    -   **Inline Editing**: Admins can edit the product name, description, price, and all specific attributes directly on the product detail page without navigating away.
    -   **Complex Price Management**: The UI supports advanced business logic for price updates, such as automatically starting a promotion if the price is lowered.
    -   **Review Management**: Admins have full control over reviews, with the ability to delete single reviews or all reviews for a product.
    -   **Product Deletion**: A product can be deleted directly from its detail page, with a redirect back to the product list.

---

## 📂 Project Structure

The `src` directory is organized to ensure scalability and maintainability:

-   `src/assets/`: Global CSS styles and static assets.
-   `src/components/`: Reusable Vue components, divided into subdirectories (`common`, `admin`, `home`, `product`).
-   `src/router/`: Application route configuration using Vue Router.
-   `src/services/`: API client (Axios) configuration.
-   `src/store/`: Pinia state management modules (`authStore`, `productStore`, `adminStore`, etc.).
-   `src/views/`: View components, representing individual pages in the application.

---

## 🛠️ Setup and Configuration

### Prerequisites

-   Node.js (version >= 22.x recommended)
-   npm

### API Connection Setup

The frontend application needs to connect to the backend API. The API server URL is set via an environment variable. Create a `.env` file in the `/frontend` root directory with the following content:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Installation

Install the project dependencies using npm:

```sh
npm install
```

---

## 📜 Available Scripts

The `package.json` file defines the following scripts:

### Run in Development Mode

Starts the Vite development server with Hot-Reload. The application will be available at `http://localhost:5173`.

```sh
npm run dev
```

### Compile for Production

Checks TypeScript types, then compiles and minifies the project into the `dist` directory.

```sh
npm run build
```

### Preview Production Build

Starts a local server to preview the compiled application from the `dist` directory.

```sh
npm run preview
```

### Type Checking

Performs TypeScript type checking across the entire project without generating build files.

```sh
npm run type-check
```