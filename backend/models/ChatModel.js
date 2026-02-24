const mongoose = require("mongoose"); //? ODM library used to interact with MongoDB using schemas

//* ============================================
//* MESSAGE SCHEMA DEFINITION
//* ============================================
//? Defines the structure of a message document stored in MongoDB
const messageSchema = new mongoose.Schema({

    //* Sender of the message
    sender: {
        type: mongoose.Schema.Types.ObjectId, //! Stores MongoDB ObjectId reference
        ref: "User", //? Links this field to the User collection
        required: true, //! Message must have a sender
    },

    //* Actual message content
    content: {
        type: String, //? Message text
        required: true, //! Message cannot be empty
    },

    //* Optional group reference
    //? Used when message belongs to a group chat
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group", //! References Group collection
    },

}, {
    timestamps: true, //! Automatically adds createdAt and updatedAt
});


//* ============================================
//* MODEL CREATION
//* ============================================
//? Creates a MongoDB collection called "messages"
const Message = mongoose.model("Message", messageSchema);


module.exports = Message; //? Allows other files (controllers/routes) to use this model