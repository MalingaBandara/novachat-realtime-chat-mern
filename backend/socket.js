
//* ============================================
//* SOCKET.IO INITIALIZATION FUNCTION
//* ============================================
//! This function is responsible for configuring
//! and handling all Socket.IO real-time logic
//? It receives the already created `io` instance from server.js
//? This keeps socket logic modular and separated from HTTP setup
const socketIo = (io) => {

    //* Socket logic (connection, events, broadcasting)
    //* will be written inside this function

};


//* ============================================
//* EXPORTING FUNCTION
//* ============================================
//? Exporting so it can be used inside server.js
//? Example in server.js:
//? const socketIo = require("./socket");
//? socketIo(io);
module.exports = socketIo;