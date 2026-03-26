
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

        
        //! ============================================
        //! LEAVE ROOM HANDLER
        //! ============================================
        //? Triggered when a user wants to leave a specific room (group chat)
        socket.on( 'leave room', (groupId) => {

            console.log(`${user?.username} leaving Group: `, groupId); //* Log user leaving action (for debugging/monitoring)

            //* Remove socket from the specified room
            socket.leave(groupId); //? After this, the socket will no longer receive events from this room

            //* Check if this socket exists in our connectedUsers map
            if (connectedUsers.has(socket.id)) {

                //* Remove user from connected users tracking
                connectedUsers.delete(socket.id); //? Ensures user is no longer counted in room presence

                //* Notify other users in the room that this user has left
                socket.to(groupId).emit("user left", user?._id); //? socket.to() → sends event to everyone EXCEPT the current socket
            }

        });
        //! END: LEAVE ROOM HANDLER
        

        //! ============================================
        //! NEW MESSAGE HANDLER
        //! ============================================
        //? Triggered when a user sends a new message to a group
        //? Responsible for broadcasting the message to other users in the same room
        socket.on( 'new message', (message) => {

            //* message object typically contains:
            //? message.content  → text of the message
            //? message.groupId → target group/room ID
            //? message.sender  → sender details (optional, based on frontend)

            //* Send the message to all other users in the same room
            socket.to(message.groupId).emit("message received", message); //? socket.to() → emits to everyone EXCEPT the sender

        });
        //! END: NEW MESSAGE HANDLER
        

        //! ============================================
        //! DISCONNECT HANDLER
        //! ============================================
        //? Triggered automatically when a user disconnects (closes tab, loses connection, etc.)
        //? Responsible for cleaning up user data and notifying others in the room
        socket.on('disconnect', () => {

            console.log(`${user?.username} disconnected`); //* Log disconnection event

            //* Check if this socket exists in connectedUsers map
            if (connectedUsers.has(socket.id)) {

                const userData = connectedUsers.get(socket.id); //* Retrieve stored user data (user info + room)

                //* Notify other users in the same room that this user has left
                socket.to(userData.room).emit("user left", user?._id); //? socket.to() → emits to everyone except the disconnected socket

                //* Remove user from connectedUsers map
                connectedUsers.delete(socket.id); //? Prevents memory leaks and keeps room state accurate

            }

        });
        //! END: DISCONNECT HANDLER

        
        //! ============================================
        //! TYPING INDICATOR
        //! ============================================
        //? Provides real-time feedback when a user is typing in a group chat

        //* Triggered when a user starts typing
        socket.on('typing', ({ groupId, username }) => {

            //* Notify all other users in the room that this user is typing
            socket.to(groupId).emit("user typing", { username }); //? socket.to() → sends to everyone EXCEPT the current user

        });


        //* Triggered when a user stops typing
        socket.on('stop typing', ({ groupId }) => {

            //* Notify all other users in the room to remove typing indicator
            socket.to(groupId).emit("user stop typing", { username: user?.username }); //? Uses server-side user info for consistency

        });
        //! END: TYPING INDICATOR


    } );
};


module.exports = socketIo;//? Exporting so it can be used inside server.js