# Library Management System (MERN Stack)

A full-stack Library Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that helps manage library operations efficiently.

## 🚀 Features

- **User Authentication**
  - User registration and login
  - Role-based access control (Admin/Librarian, Members)
  - JWT-based authentication

- **Book Management**
  - Add, edit, and remove books
  - Book search and filtering
  - Track book availability

- **Member Management**
  - Member registration and profiles
  - Member activity tracking
  - Fine calculation for late returns

- **Issue/Return System**
  - Issue books to members
  - Track due dates
  - Handle book returns
  - Automatic fine calculation

- **Dashboard**
  - Admin dashboard with analytics
  - Member dashboard for personal activity
  - Real-time updates

## 🛠️ Tech Stack

- **Frontend**: React.js, Redux, Material-UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS Modules, Responsive Design

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (v4.4 or later)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/B-Rohit-1/MERN_Stack.git
   cd Library-Management-System-MERN
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   - Create a `.env` file in the backend directory with the following variables:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/auth/register | Register a new user |
| POST   | /api/auth/login | User login |
| GET    | /api/books | Get all books |
| POST   | /api/books | Add a new book |
| GET    | /api/books/:id | Get book by ID |
| PUT    | /api/books/:id | Update book details |
| DELETE | /api/books/:id | Delete a book |
| GET    | /api/members | Get all members |
| POST   | /api/issues | Issue a book |
| PUT    | /api/returns | Return a book |