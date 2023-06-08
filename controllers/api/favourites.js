// Import the User model
const User = require("../../models/User");

// Export the create function as the request handler for creating a favorite course
exports.create = async (req, res) => {
  // Retrieve the courseId from the request body
  const courseId = req.body.id;

  // Log the courseId to the console
  console.log(courseId);

  // Check if the courseId or the userID from the session is missing
  if (!courseId || req.session.userID) {
    res.json({ result: 'error' });
  }

  try {
    // Add the courseId to the saved_courses array of the user with the matching userID
    await User.updateOne({ "_id": req.session.userID }, { $push: { saved_courses: courseId } });
  } catch (e) {
    // If an error occurs during the update, send an error response
    res.json({ result: 'error could not create a favourite' });
  }
}

// Export the delete function as the request handler for deleting a favorite course
exports.delete = async (req, res) => {
  // Retrieve the courseId from the request body
  const courseId = req.body.id;

  // Log the courseId to the console
  console.log(courseId);

  // Check if the courseId or the userID from the session is missing
  if (!courseId || !req.session.userID) {
    res.json({ result: 'error' });
    return;
  }

  try {
    // Remove the courseId from the saved_courses array of the user with the matching userID
    await User.updateOne({ "_id": req.session.userID }, { $pull: { saved_courses: courseId } });
  } catch (e) {
    // If an error occurs during the update, send an error response
    res.json({ result: 'error could not delete the favourite' });
  }
}
