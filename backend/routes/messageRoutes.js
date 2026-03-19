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

        res.status(201).json({ populatedMessage });//* Send created message as response

    } catch (error) {
        res.status(500).json({ error: error.message }); //! Handle server or database errors
    }
});


module.exports = messageRouter; //* Exporting the messageRouter