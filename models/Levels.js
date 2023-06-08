// Import the required modules from Mongoose
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the level schema
const levelSchema = new Schema(
    {
        level: { type: String, required: [true, 'Level is required'] }, // Define the level field with a required constraint
    },
    { timestamps: true } // Enable timestamps for createdAt and updatedAt fields
);

// Export the level model
module.exports = mongoose.model("Levels", levelSchema);
