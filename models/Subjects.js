// Import the required modules from Mongoose
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the subject schema
const subjectSchema = new Schema(
    {
        category: { type: String, required: [true, 'Category name is required'] }, // Define the category field with a required constraint
    },
    { timestamps: true } // Enable timestamps for createdAt and updatedAt fields
);

// Export the subject model
module.exports = mongoose.model("Categories", subjectSchema);
