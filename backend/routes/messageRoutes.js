const express = require('express'); //? Express framework for handling HTTP requests
const Message = require("../models/ChatModel"); //? Message model used to interact with chat/messages collection
const { protect } = require('../middlewares/authMiddleware'); //? Middleware to ensure user is authenticated

const messageRouter = express.Router(); //? Creating router instance for message-related routes


//* ============================================
//* SEND MESSAGE ROUTE
//* ============================================
//! POST /api/messages
//? Allows an authenticated user to send a message to a group
//? Requires: content (message text), groupId (target group)
messageRouter.post("/", protect, async (req, res) => {

    try {
       
        const { content, groupId } = req.body; //* Extract message data from request body

        //* Create new message document in database
        const message = await Message.create({
            sender: req.user._id, //? Logged-in user becomes the sender
            content,              //? Message text
            group: groupId        //? ID of the group where message is sent
        });

        //* Fetch created message and populate sender details
        //? populate() replaces sender ObjectId with actual user info
        const populatedMessage = await Message.findById(message._id)
            .populate("sender", "username email");

        res.status(201).json(populatedMessage);//* Send created message as response

    } catch (error) {
        res.status(500).json({ error: error.message }); //! Handle server or database errors
    }
});



//* ============================================
//* GET GROUP MESSAGES ROUTE
//* ============================================
//! GET /api/messages/:groupId
//? Retrieves all messages for a specific group
//? Route is protected → only authenticated users can access
messageRouter.get("/:groupId", protect, async (req, res) => {

    try {

        //* Fetch messages that belong to the given groupId
        const messages = await Message.find({ group: req.params.groupId })
                .populate("sender", "username email") //? Replace sender ObjectId with full user details (username & email) using populate
                .sort({ createdAt: 1 }); //? Sort messages by createdAt ascending (1) to return oldest messages first in chat order

        res.status(200).json(messages); //* Send messages array as JSON response

    } catch (error) {
        res.status(500).json({ error: error.message }); //! Handle server/database errors
    }
});


module.exports = messageRouter; //* Exporting the messageRouter