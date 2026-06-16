
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



//* ============================================
//* GET GROUP MEMBERS ROUTE
//* ============================================
//! GET /api/groups/:groupId/members
//? Returns the full member list for a specific group
//? Route is protected → only authenticated users can access
groupRouter.get("/:groupId/members", protect, async (req, res) => {

    try {

        const group = await Group.findById(req.params.groupId) //* Find group by ID from request parameters
            .populate("members", "username email"); //? Replace member IDs with user details

        //* If group does not exist, return 404 error
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        res.json(group.members); //* Send list of members as response

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message }); //! Handle errors during fetching
    }
});



//* ============================================
//* JOIN GROUP ROUTE
//* ============================================
//! POST /api/groups/:groupId/join
//? Allows an authenticated user to join a specific group
//? Route is protected → user must be logged in (valid JWT)
groupRouter.post("/:groupId/join", protect, async (req, res) => {

    try {

        const group = await Group.findById(req.params.groupId); //* Find group by ID from request parameters

        //* If group does not exist, return 404 error
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        //* Check if user is already a member of the group
        //? includes() checks if req.user._id exists in members array
        if (group.members.includes(req.user._id)) {
            return res.status(400).json({ message: "Already a member of the group" });
        }

        group.members.push(req.user._id); //* Add current user to group's members list
        await group.save(); //* Save updated group document to database

        res.status(200).json({ message: "Joined the group successfully" }); //* Send success response

    } catch (error) {
        res.status(400).json({ message: error.message }); //! Handle errors during join operation
    }
});



//* ============================================
//* LEAVE GROUP ROUTE
//* ============================================
//! POST /api/groups/:groupId/leave
//? Allows an authenticated user to leave a specific group
//? Route is protected → user must be logged in (valid JWT)
groupRouter.post("/:groupId/leave", protect, async (req, res) => {

  try {

    const group = await Group.findById(req.params.groupId); //* Find group by ID from request parameters

    //* If group does not exist, return 404 error
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    //* Check if user is NOT a member of the group
    if (!group.members.includes(req.user._id)) {
      return res.status(400).json({ message: "Not a member of this group" });
    }

    //* Remove current user from members array
    //? filter() creates a new array excluding the current user's ID
    //? Convert ObjectId to string for accurate comparison
    group.members = group.members.filter((memberId) => {
      return memberId.toString() !== req.user._id.toString();
    });

    await group.save(); //* Save updated group document to database

    res.json({ message: "Successfully left the group" });//* Send success response

  } catch (error) {
    res.status(400).json({ message: error.message }); //! Handle errors during leave operation
  }
});



module.exports = groupRouter; //* Exporting the groupRouter