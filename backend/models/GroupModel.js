const mongoose = require("mongoose");//* Importing mongoose to create schema and interact with MongoDB


//* Defining the structure of a Group document in MongoDB
const groupSchema = new mongoose.Schema({

    //? Name of the group
    name: {
        type: String, // Data type is String
        required: true, //! This field is mandatory
        trim: true, // Removes extra spaces from beginning and end
    },

    //? Short description about the group
    description: {
        type: String,
        required: true, //! Description must be provided
    },

    //? List of members in this group
    //! Stores multiple User IDs
    members: [
        { 
            type: mongoose.Schema.Types.ObjectId, // Reference ID from MongoDB
            ref: "User" // Links this field to the User collection
        }
    ],

    //? Admin of the group
    //! Usually the creator or manager of the group
    admin: {
        type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId
        ref: "User", // Reference to User model
    }

},{
    timestamps: true, //! Automatically adds createdAt and updatedAt fields
});


const Group = mongoose.model("Group", groupSchema);//* Creating the Group model based on the schema (MongoDB collection name will become "groups")

module.exports = Group; //* Exporting the model so it can be used in other files (controllers, routes, etc.)