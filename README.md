# 💬 Real-Time Chat Application

A modern full-stack real-time chat application built using the MERN stack. This platform allows users to create accounts, send and receive messages instantly, and communicate in real time through a responsive and interactive chat interface.

The project is divided into separate frontend and backend folders where the frontend is built using React and the backend is developed using Express.js and MongoDB.

---

# 🚀 Features

## 👤 User Features

- User authentication
- Real-time messaging
- One-to-one chat system
- Online/offline user status
- Responsive chat UI
- Message timestamps
- Instant message updates
- Secure backend APIs

---

# 🛠️ Backend Features

- REST API with Express.js
- MongoDB database integration
- JWT Authentication
- Socket.IO real-time communication
- Protected routes
- User & message management

---

# 🧰 Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Real-Time Communication
- Socket.IO

## Authentication
- JWT Authentication

---

# 📂 Project Structure

```bash
project-root/
│
├── frontend/       # React Frontend
├── backend/        # Express Backend
│
└── README.md
```

---

# ⚙️ Environment Variables

## Frontend `.env`

Create a `.env` file inside the `frontend` folder and add:

```env
VITE_BACKEND_URL= backend runnig url
```

---

## Backend `.env`

Create a `.env` file inside the `backend` folder and add:

```env
PORT=

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

NODE_ENV=

```

---

# 🔧 Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/ahemad02/CHAT-APP.git
```

---

## 2️⃣ Move Into Project Folder

```bash
cd your-repo-name
```

---

# ▶️ Frontend Setup

## Go to frontend folder

```bash
cd frontend
```

## Install dependencies

```bash
npm install
```

## Start frontend server

```bash
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

# ▶️ Backend Setup

## Open new terminal

## Go to backend folder

```bash
cd backend
```

## Install dependencies

```bash
npm install
```

## Start backend server

```bash
npm run server
```

or

```bash
nodemon server.js
```

Backend will run on:

```bash
http://localhost:5000
```

---

# 🔐 Authentication

Authentication is implemented using JWT tokens.

Features include:
- User Registration
- User Login
- Protected Routes
- Secure API Access

---

# ⚡ Real-Time Messaging

This project uses Socket.IO for:
- Instant messaging
- Live chat updates
- Real-time communication
- Online user tracking

---

# 📸 Main Functionalities

- User Authentication
- Real-Time Chat
- User Management
- Socket Connections
- Protected APIs
- Responsive UI

---

# 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop
- Tablet
- Mobile Devices

# 🤝 Contributing

Contributions are welcome.

## Steps to Contribute

1. Fork the repository

2. Create feature branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push branch

```bash
git push origin feature-name
```

5. Create Pull Request

---

# 📄 License

This project is created for learning and portfolio purposes.

---

# ⭐ Support

If you liked this project:
- Star the repository
- Fork the project
- Share feedback
