
//* ============================================
//* SOCKET.IO INITIALIZATION FUNCTION
//* ============================================
//! This function is responsible for configuring
//! and handling all Socket.IO real-time logic
//? It receives the already created `io` instance from server.js
//? This keeps socket logic modular and separated from HTTP setup
const socketIo = (io) => {

    // Store connected users with their room info using socket.id as their key
    const connectedUsers = new Map(); //? Map key → socket.id, value → { user, room } 
    
    //* Listen for new client connections
    io.on( 'connection', (socket) => {

        const user = socket.handshake.auth.user; //? Extract user info sent from client during handshake

        console.log( "User Connected", user?.username ); //? Logs username of connected user


        //! ============================================
        //! JOIN ROOM HANDLER
        //! ============================================
        //? Triggered when a client requests to join a room (group chat)
        socket.on('join room', (groupId) => {

            socket.join(groupId); //? Adds the current socket to the specified room

            connectedUsers.set(socket.id, { user, room: groupId }); //? Store the user's info and the room they joined

            //? Create a list of all users currently in the same room
            const usersInRoom = Array.from(connectedUsers.values())
                .filter((u) => u.room === groupId) //? Only include users in this room
                .map((u) => u.user);              //? Extract just the user object

            io.in(groupId).emit("users in room", usersInRoom); //? Send updated list of users to everyone in the room

            //? Notify everyone else in the room that a new user has joined
            socket.to(groupId).emit("notification", {
                type: "USER_JOINED",                        //? Type of notification
                message: `${user?.username} has joined`,   //? Informative message
                user: user,                                 //? Include user info of the new member
            });

        });
        //! END: JOIN ROOM HANDLER

        //! START: Leave room Handler
        //! END: Leave room Handler
        
        //! START: New Message Handler
        //! END: New Message Handler
        
        //! START: Disconnect Handler
        //! END: Disconnect Handler
        
        //! START: Typing Indicator
        //! END: Typing Indicator

    } );
};


module.exports = socketIo;//? Exporting so it can be used inside server.js