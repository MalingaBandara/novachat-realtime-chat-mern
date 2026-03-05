
//* ============================================
//* SOCKET.IO INITIALIZATION FUNCTION
//* ============================================
//! This function will be responsible for configuring
//! and handling all Socket.IO real-time logic
//? It can receive the server instance as a parameter later
//? Example: const socketIo = (server) => { ... }
const socketIo = () => {

    //* Socket logic (connection, events, broadcasting)
    //* will be written inside this function

};



//* ============================================
//* EXPORTING FUNCTION
//* ============================================
//? Exporting so it can be imported and used in server.js
//? Example usage:
//? const socketIo = require("./socket");
//? socketIo(server);
module.exports = socketIo;