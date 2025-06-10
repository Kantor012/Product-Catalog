# Product Catalog App - Frontend

A frontend for the product catalog application, built with Vue 3, Vite, and TypeScript. It allows for Browse, searching, and managing products.

---

## 🚀 Core Technologies

- **Framework**: Vue 3 (Composition API)
- **Bundler**: Vite
- **Language**: TypeScript
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Developer Tools**: Vite Plugin Vue Devtools

---

## 📂 Project Structure

The `src` directory is structured to ensure scalability and maintainability.

-   `src/assets/`: Global CSS styles and static assets.
-   `src/components/`: Reusable Vue components, divided into subdirectories:
    -   `common/`: General-purpose components (e.g., sidebar, filters).
    -   `admin/`: Components for the admin panel (e.g., product form).
    -   `home/`: Components used on the homepage.
    -   `product/`: Product-related components (e.g., product card, reviews).
-   `src/router/`: Application route configuration using Vue Router.
-   `src/services/`: API client (Axios) configuration with interceptors.
-   `src/store/`: Pinia state management modules (e.g., for auth, products, UI).
-   `src/views/`: View components, representing individual pages in the application.

---

## 🛠️ Setup and Configuration

### Prerequisites

-   Node.js (version >= 22.x)
-   npm

### API Connection Setup

The frontend application connects to a backend. The API server URL is set via an environment variable in a `.env` file in the frontend's root directory.

Create a `.env` file and add the following variable:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Install Dependencies

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

Performs TypeScript type checking across the entire project without generating files.

```sh
npm run type-check
```