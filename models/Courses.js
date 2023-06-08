// Import the required modules from Mongoose
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the courses schema
const coursesSchema = new Schema(
  {
    course_id: Number,
    course_title: String,
    url: String,
    is_paid: Boolean,
    price: Number,
    num_subscribers: Number,
    num_reviews: Number,
    num_lectures: Number,
    level: String,
    content_duration: String,
    published_timestamp: String,
    subject: String,

    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories", // Reference to the "Categories" model
    },
  },
  { timestamps: true } // Enable timestamps for createdAt and updatedAt fields
);

// Create an index for full-text search on all fields in the schema
coursesSchema.index({ "$**": "text" });

// Export the courses model
module.exports = mongoose.model("Courses", coursesSchema);
