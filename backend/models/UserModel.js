//* Importing required libraries
const mongoose = require("mongoose"); //? ODM library used to interact with MongoDB using schemas
const bcrypt = require("bcrypt"); //? Library used to hash passwords securely


//* Creating a Mongoose Schema for Users
//? Schema defines structure of documents stored in MongoDB collection
const userSchema = new mongoose.Schema({
    
    username: {
        type: String,      //! Data type must be string
        required: true,    //? Username is mandatory
        unique: true,      //! No two users can have the same username
        trim: true         //? Removes unnecessary spaces from beginning and end
    },

    email: {
        type: String,
        required: true,
        unique: true,      //! Ensures email is not duplicated in database
        trim: true,        //? Removes extra spaces
        lowercase: true,   //! Automatically converts email to lowercase before saving
    },

    password: {
        type: String,
        required: true,    //! Password must be provided
    },

    isAdmin: {
        type: Boolean,
        default: false,    //? By default user is not an admin
    },

}, {
    timestamps: true,      //! Automatically adds createdAt and updatedAt fields
});


//* ========================================
//* MONGOOSE MIDDLEWARE (PRE SAVE HOOK)
//* ========================================

//! Runs automatically BEFORE a user document is saved
//? Used here to hash password before storing in database
userSchema.pre('save', async function (next) {

    //! If password was NOT modified, skip hashing
    //? Prevents re-hashing already hashed password during updates
    if (!this.isModified('password')) {
        return next();
    }

    //* Hash the password using bcrypt
    //? 10 = salt rounds (higher = more secure but slower)
    this.password = await bcrypt.hash(this.password, 10);

    next(); //? Continue saving the document
});


//* ========================================
//* CUSTOM INSTANCE METHOD
//* ========================================

//! Compares entered password with hashed password in database
//? Used during login authentication
userSchema.methods.matchPassword = async function (enteredPassword) {

    //* bcrypt.compare checks plain text password vs hashed password
    return await bcrypt.compare(enteredPassword, this.password);

};


//* Creating the User model from schema
const User = mongoose.model('User', userSchema);//? MongoDB collection name will become "users"

module.exports = User;//* Exporting model so it can be used in controllers/routes