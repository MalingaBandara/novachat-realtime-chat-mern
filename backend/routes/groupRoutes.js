
const express = require("express"); //? Express framework for handling HTTP requests
const Group = require("../models/GroupModel"); //? Group model used to interact with groups collection in MongoDB

const groupRouter = express.Router(); //? Creating a router instance for group-related routes

//* Import authentication middlewares
//? protect → verifies JWT and attaches logged-in user to req.user
//? isAdmin → ensures the logged-in user has admin privileges
const { protect, isAdmin } = require("../middlewares/authMiddleware"); 


//* ============================================
//* CREATE NEW GROUP ROUTE
//* ============================================
//! POST /api/groups
//? Creates a new group in the system
//? Route security:
//? 1. protect → user must be authenticated (valid JWT token)
//? 2. isAdmin → only admin users can create groups
groupRouter.post("/", protect, isAdmin, async (req, res) => {

    try {

        const { name, description } = req.body; //* Extract group data from request body

        //* Create new group document in database
        const group = await Group.create({
            name,
            description,
            admin: req.user._id,  //! Logged-in user becomes the group admin
            members: [req.user.id], //! Add creator as the first member of the group
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



//* ============================================
//* GET ALL GROUPS ROUTE
//* ============================================
//! GET /api/groups
//? Returns all groups in the system
//? Route is protected → only authenticated users can access
groupRouter.get("/", protect, async (req, res) => {

    try {

        //* Fetch all groups from database
        //? populate() replaces ObjectIds with actual user data
        const groups = await Group.find()
            .populate("admin", "username email")   //? Include admin details
            .populate("members", "username email"); //? Include members details

        //* Send list of groups as response
        res.json(groups);

    } catch (error) {
        res.status(400).json({ message: error.message }); //! Handle errors during fetching groups
    }
});


module.exports = groupRouter; //* Exporting the groupRouter