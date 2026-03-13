
const express = require("express"); //? Express framework for handling HTTP requests
const Group = require("../models/GroupModel"); //? Group model used to interact with groups collection in MongoDB

const groupRouter = express.Router(); //? Creating a router instance for group-related routes

const protect = require("../middlewares/authMiddleware"); //? Authentication middleware to protect routes


//* ============================================
//* CREATE NEW GROUP ROUTE
//* ============================================
//! Handles POST request to create a new group
//? Route is protected → user must send valid JWT token
groupRouter.post("/", protect, async (req, res) => {

    try {

        const { name, description } = req.body; //* Extract group data from request body

        //* Create new group document in database
        const group = await Group.create({
            name,
            description,
            // admin: req.user._id, //! Future: set logged-in user as group admin
            // members: [req.user.id], //! Future: automatically add creator as first member
        });

        //* Fetch the created group and populate referenced fields
        const populatedGroup = await Group.findById(group._id)
            .populate("admin", "username email") //? Replace admin ID with user details
            .populate("members", "username email"); //? Replace member IDs with user details

        res.status(201).json({ populatedGroup }); //* Send created group as response

    } catch (error) {
        res.status(400).json({ message: error.message }); //! Handle errors during group creation
    }
});



module.exports = groupRouter; //* Exporting the groupRouter