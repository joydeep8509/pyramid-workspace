# Pyramid Workspace - Task Management System

Pyramid Workspace is a modern, full-stack Task Management System designed to help teams and individuals organize projects, track tasks, and collaborate efficiently. Built with a Next.js frontend and a NestJS backend, it offers a highly responsive, customizable, and secure environment.

## 🚀 Key Features

### 1. Secure Authentication & Access
*   **Google OAuth:** Integrated NextAuth provides secure, seamless login capabilities using Google accounts.
*   **Guest Mode:** Offers a one-click "Continue as Guest" option for immediate, frictionless access to the workspace.

### 2. Advanced Task Management
*   **Dual Layout Modes:** Users can seamlessly toggle their workspace between a visually organized Kanban Board View and a highly structured List View.
*   **Dynamic Field Visibility:** Users can customize their data grids by toggling the visibility of specific columns, including Priority, Members, Due Date, and Tags.
*   **Deep Filtering & Live Search:** Features a powerful filtering engine allowing users to filter tasks by Status, Priority, Members, Due Date, Teams, Labels, and Reporter, alongside a real-time text search.
*   **Comprehensive Task Modals:** Includes a detailed creation and editing modal supporting task titles, statuses, priority levels, due dates, customizable tags, and member assignments.
*   **Task Details & Inline Editing:** Dedicated task pages feature inline editing for titles, labels, and due dates via a custom calendar dropdown.
*   **Subtasks & Updates:** Task detail pages support the creation of nested subtasks and include a feed for comments and status updates.

### 3. Project Tracking
*   **Project Dashboard:** A dedicated section to view and manage active high-level projects.
*   **Project Metadata:** Track essential project information including project names, urgency priorities, assigned leads, and deadlines.
*   **Project-Level Filtering:** Features mirror the task section, including live search, field customization toggles, and multi-category filtering to easily find specific projects.

### 4. Personalization & Settings
*   **Theme Engine:** Users can instantly toggle the application interface between Light and Dark modes.
*   **Custom Color Modes:** The workspace accent color can be deeply personalized with built-in UI themes including Amber, Blue, Pink, Rose, Emerald, and Black.
*   **Profile Management:** A dedicated settings area allows users to update personal details such as full name, email, job title, and username.
*   **Workspace Control:** Includes a secure "Danger Zone" where users can actively remove themselves and leave the current workspace.

### 5. Responsive & Accessible UI
*   **Mobile-First Design:** Built entirely with Tailwind CSS utility classes to ensure a flawless experience across all device sizes.
*   **Adaptive Navigation:** The main sidebar transforms into a slide-out hamburger drawer menu on mobile devices to preserve screen real estate.
*   **Transforming Data Tables:** Complex list views automatically collapse into swipeable horizontal containers or stacked cards on smaller screens to prevent layout breakage.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework:** Next.js (React)
*   **Styling:** Tailwind CSS for highly responsive, utility-first styling.
*   **Icons:** Lucide React for consistent, lightweight UI iconography.
*   **State Management:** Zustand for lightweight global state handling (e.g., Theme and Color Mode preferences).
*   **Authentication:** NextAuth.js for secure Google OAuth handling.

### Backend
*   **Framework:** NestJS
*   **Database ORM:** TypeORM
*   **Database Driver:** MySQL2 configured with TLSv1.2 SSL requirements for secure cloud database connections (e.g., TiDB).
*   **Architecture:** Modular architecture separated into `TasksModule`, `ProjectsModule`, and `UsersModule`.

---

## 💻 Getting Started

### Prerequisites
*   Node.js (v18+)
*   npm (for Backend package management)
*   A MySQL or TiDB Cloud Database

### Environment Variables
You will need to configure `.env` files in both the frontend and backend directories.

**Frontend (`frontend/my-app/.env`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secure_random_string
```

**Backend (`backend/.env`)**
```env
PORT=3001
NODE_ENV=development
DB_HOST=your_database_host
DB_PORT=4000
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_DATABASE=test
```

### Installation & Running Locally

1.  **Start the Backend:**
    ```bash
    cd backend
    npm install
    npm run start:dev
    ```
2.  **Start the Frontend:**
    ```bash
    cd frontend/my-app
    npm install
    npm run dev
    ```
3.  Open `http://localhost:3000` in your browser.
