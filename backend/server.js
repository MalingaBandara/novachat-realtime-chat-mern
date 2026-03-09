
//* IMPORTING REQUIRED MODULES
const express = require('express'); //? Express framework for building APIs
const dotenv = require('dotenv'); //? Loads environment variables from .env file
const mongoose = require('mongoose'); //? MongoDB ODM for database interaction
const http = require('http'); //? Node.js HTTP module (needed for Socket.IO)
const socketio = require('socket.io'); //? Socket.IO for real-time communication
const cors = require('cors'); //? Middleware to enable Cross-Origin Resource Sharing

dotenv.config(); //? Initialize environment variables

const userRouter = require('./routes/userRoutes'); //? User authentication routes

//* IMPORTING SOCKET MODULE
const socketIo = require('./socket'); //? Custom socket configuration function

//* ============================================
//* INITIALIZING EXPRESS & HTTP SERVER
//* ============================================
const app = express(); //? Create Express application
const server = http.createServer(app); //! Create HTTP server (required for Socket.IO integration)


//* ============================================
//* INITIALIZING SOCKET.IO
//* ============================================
const io = socketio(server, {
    cors: {
        origin: ["http://localhost:3000"], //? Allow frontend origin
        methods: ["GET", "POST"], //? Allowed HTTP methods
        Credentials: true //? Allow credentials (cookies, auth headers)
    },
});


//* ============================================
//* MIDDLEWARE SETUP
//* ============================================
app.use(cors()); //? Enable CORS globally
app.use(express.json()); //? Parse incoming JSON request bodies


//* ============================================
//* DATABASE CONNECTION
//* ============================================
//! Connect to MongoDB database
mongoose.connect( process.env.MONGO_URL )
    .then(() => console.log('Connected to DB')) //? Success message
    .catch(err => console.log('Error connecting to DB', err)); //? Error handling


//* ============================================
//* INITIALIZE SOCKET LOGIC
//* ============================================
//? Pass io instance to separate socket configuration file
socketIo(io);


//* ============================================
//* API ROUTESS
//* ============================================
//? All user-related routes will start with /api/users
app.use('/api/users', userRouter);


//* ============================================
//* START SERVER
//* ============================================
const PORT = process.env.PORT || 5000; //? Use environment port or default 5000

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); //? Confirm server is running
});