# UpTask - MERN Project Management Application

UpTask is a full-stack MERN (MongoDB, Express.js, React, Node.js) application designed for project management. It enables users to create projects, manage tasks within those projects, assign tasks, track progress, and collaborate with team members.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: Version 18.x or later recommended. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm** (Node Package Manager) or **yarn**: These come bundled with Node.js or can be installed separately.
*   **MongoDB**: A running instance of MongoDB. You can use a local installation or a cloud-hosted service like MongoDB Atlas.
*   **Mailtrap.io Account (or other SMTP service)**: For email functionalities like account confirmation and password resets. Mailtrap is excellent for development and testing.

## Setup Instructions

Follow these steps to get the application running locally:

### 1. Clone the Repository

```bash
git clone https://github.com/jcardosorios/11_uptask.git
cd 11_uptask
```

### 2. Backend Setup

The backend is built with Node.js, Express, and MongoDB.

*   Navigate to the backend directory:
    ```bash
    cd backend
    ```
*   Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
*   **Configure Environment Variables**:
    Create a `.env` file in the `backend` directory by copying the template:
    ```bash
    cp .env.template .env
    ```
    Then, open the `backend/.env` file and update it with your specific configurations. See the **Backend Environment Variables** section below for details on each variable.

*   **(Optional) Seed the Database**:
    The backend includes a script to populate the database with initial sample data (users, projects, tasks). This is useful for quickly getting started with a populated environment.
    *Warning: This script will clear existing data in the User, Project, and Task collections.*
    ```bash
    npm run seed
    ```

*   **Start the Backend Server**:
    ```bash
    npm run dev
    ```
    The backend server will typically start on `http://localhost:4000`. You should see a confirmation message in your console.

### 3. Frontend Setup

The frontend is built with React, Vite, and Tailwind CSS.

*   Navigate to the frontend directory (from the project root):
    ```bash
    cd ../frontend
    # or if you are in the root: cd frontend
    ```
*   Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
*   **Configure Environment Variables**:
    Create a `.env` file in the `frontend` directory:
    ```bash
    touch .env
    ```
    Add the following line to your `frontend/.env` file, pointing to your backend API:
    ```
    VITE_API_URL=http://localhost:4000/api
    ```
    Ensure this URL matches where your backend server is running.

*   **Start the Frontend Development Server**:
    ```bash
    npm run dev
    ```
    The frontend application will typically be accessible at `http://localhost:5173`.

## Environment Variables

### Backend (`backend/.env`)

This file is crucial for the backend's operation.

*   `DATABASE_URL`:
    *   **Description**: Your MongoDB connection string.
    *   **Example**: `mongodb+srv://<user>:<password>@<cluster-url>/<database_name>?retryWrites=true&w=majority` (for MongoDB Atlas) or `mongodb://localhost:27017/uptask_mern` (for a local instance).
    *   **Action**: Replace the placeholder with your actual MongoDB connection string.

*   `FRONTEND_URL`:
    *   **Description**: The base URL of your running frontend application. This is used for Cross-Origin Resource Sharing (CORS) and for constructing links in emails (e.g., account confirmation, password reset).
    *   **Example**: `http://localhost:5173`
    *   **Action**: Ensure this matches the URL where your frontend is accessible.

*   `SMTP_HOST`:
    *   **Description**: The hostname of your SMTP server (e.g., Mailtrap).
    *   **Example (Mailtrap)**: `sandbox.smtp.mailtrap.io`
    *   **Action**: Update with your SMTP provider's host.

*   `SMTP_PORT`:
    *   **Description**: The port number for your SMTP server.
    *   **Example (Mailtrap)**: `2525`
    *   **Action**: Update with your SMTP provider's port.

*   `SMTP_USER`:
    *   **Description**: The username for authenticating with your SMTP server.
    *   **Example (Mailtrap)**: `your_mailtrap_username` (from your Mailtrap inbox credentials)
    *   **Action**: Update with your SMTP username.

*   `SMTP_PASS`:
    *   **Description**: The password for authenticating with your SMTP server.
    *   **Example (Mailtrap)**: `your_mailtrap_password` (from your Mailtrap inbox credentials)
    *   **Action**: Update with your SMTP password.

*   `JWT_SECRET`:
    *   **Description**: A secret key used to sign and verify JSON Web Tokens (JWTs) for user authentication. This should be a long, random, and strong string.
    *   **Example**: `a_very_strong_and_random_secret_key_123!`
    *   **Action**: Replace with a strong, unique secret key. **Do not use a weak or default secret in production.**

### Frontend (`frontend/.env`)

*   `VITE_API_URL`:
    *   **Description**: The base URL for your backend API.
    *   **Example**: `http://localhost:4000/api`
    *   **Action**: Ensure this points to your running backend API.

## Available Scripts

### Backend

*   `npm run dev`: Starts the backend server in development mode with `nodemon` for automatic restarts on file changes.
*   `npm run seed`: Connects to the database, clears existing User, Project, and Task collections, and then seeds them with new sample data.
*   `npm start`: (If configured in `package.json` for production) Starts the backend server, typically after a build step.

### Frontend

*   `npm run dev`: Starts the frontend development server using Vite with Hot Module Replacement (HMR).
*   `npm run build`: Builds the frontend application for production. The output is typically in the `dist` folder.
*   `npm run lint`: Lints the frontend code using ESLint.
*   `npm run preview`: Serves the production build locally for testing.

## Using the Application

Once both the backend and frontend servers are running:

1.  **Access the Frontend**: Open your web browser and navigate to the frontend URL (e.g., `http://localhost:5173`).
2.  **Register**:
    *   Click on "Create Account".
    *   Fill in your name, email, password, and password confirmation.
    *   Submit the form. An email will be sent to your provided email address (check Mailtrap if you're using it for development).
3.  **Confirm Account**:
    *   Open the confirmation email and click the link or use the provided token on the confirmation page.
4.  **Login**:
    *   Once your account is confirmed, go to the login page.
    *   Enter your email and password.
5.  **Dashboard**:
    *   After logging in, you'll be taken to your dashboard.
    *   Here you can create new projects or view existing ones.
6.  **Project Management**:
    *   Click on a project to view its details.
    *   **Tasks**: Add new tasks, view task details, update task status (drag-and-drop), edit, or delete tasks.
    *   **Team**: If you are the project manager, you can add or remove team members by their email.
    *   **Notes**: Add notes to specific tasks.
7.  **Profile**:
    *   Access your profile via the navigation menu.
    *   Update your name and email.
    *   Change your password.

---

Happy task managing!