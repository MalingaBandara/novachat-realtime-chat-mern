# NovaChat 💬

A real-time **group chat application** built on the MERN stack with Socket.IO. Admins create chat groups, registered users can browse and join any group, chat live with other members, and leave whenever they want — all behind JWT-protected API routes.

## Features

- **User authentication** — register/login with JWT-based session handling and `bcrypt`/`bcryptjs` password hashing
- **Admin-managed groups** — admins create chat groups that users can discover and join
- **Join / leave groups** — users can join any available group and leave at any time
- **Real-time messaging** — instant message delivery via Socket.IO, scoped to each group
- **Protected API endpoints** — all routes require a valid JWT; unauthorized requests are rejected
- **Persistent chat history** — messages, groups, and users are stored in MongoDB via Mongoose

## Tech Stack

**Frontend:** React 18, Vite, React Router, Chakra UI, Tailwind CSS, Axios, Socket.IO Client, Framer Motion

**Backend:** Node.js, Express 5, Socket.IO, MongoDB, Mongoose, JWT, bcrypt

## Project Structure

```
novachat-realtime-chat-mern/
├── backend/
│   ├── middlewares/        # JWT auth middleware
│   ├── models/              # ChatModel, GroupModel, UserModel (Mongoose schemas)
│   ├── routes/               # groupRoutes, messageRoutes, userRoutes
│   ├── server.js            # Express app entry point
│   └── socket.js             # Socket.IO server logic
└── frontend/
    ├── public/
    └── src/
        ├── components/
        ├── pages/
        ├── App.jsx
        └── main.jsx
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a connection URI

### 1. Clone the repo
```bash
git clone https://github.com/MalingaBandara/novachat-realtime-chat-mern.git
cd novachat-realtime-chat-mern
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```dotenv
JWT_SECRET=your_jwt_secret
MONGO_URL=mongodb://localhost:27017/mernChatDB?appName=mern-chat
```

Start the server:
```bash
npm start
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
npm run dev
```

The frontend will run on Vite's default dev server (typically `http://localhost:5173`), and the backend will serve the API and Socket.IO connection.

## How It Works

1. Users register and log in; the server issues a JWT used to authenticate all subsequent requests.
2. Admins create groups, which are stored in MongoDB via `GroupModel`.
3. Logged-in users can view all available groups and join any group they're interested in.
4. Once in a group, users send and receive messages in real time through a Socket.IO connection scoped to that group.
5. Users can leave a group at any time, removing themselves from its member list.
6. Every backend route — groups, messages, and user actions — is protected by JWT middleware, so only authenticated users can interact with the API.

## What I Learned

Building NovaChat helped me get hands-on experience with real-time architecture using WebSockets, designing a role-based system (admin vs. regular users), structuring a MERN app with clean separation between routes/models/middleware, and securing REST APIs with JWT authentication.

## Author

**Malinga Bandara**
[GitHub](https://github.com/MalingaBandara)
