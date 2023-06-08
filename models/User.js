// Import the required modules from Mongoose and bcrypt
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new Schema(
    {
        email: { type: String, required: [true, 'Email is required'], unique: true }, // Define the email field with a required constraint and unique index
        password: { type: String, required: [true, 'Password is required'] }, // Define the password field with a required constraint
        saved_courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Courses" }], // Define the saved_courses field as an array of references to Courses
    },
    { timestamps: true } // Enable timestamps for createdAt and updatedAt fields
);

// Define a pre-save middleware to hash the password before saving
userSchema.pre('save', async function (next) {
    console.log(this.password);
    try {
        const hash = await bcrypt.hash(this.password, 10); // Hash the password using bcrypt with a salt factor of 10
        this.password = hash; // Set the hashed password as the new value
        next();
    } catch (e) {
        throw Error('could not hash password');
    }
});

// Export the user model
module.exports = mongoose.model("User", userSchema);
