// Import the User model
const User = require("../models/User");

// Export the list function as the request handler for retrieving user favorites
exports.list = async (req, res) => {
  try {
    // Find the user with the given id and populate the saved_courses field
    const userRef = await User.findOne({ "_id": user.id }).populate('saved_courses');

    // Render the favourites view with the retrieved courses
    res.render('favourites', { courses: userRef.saved_courses });
  } catch (e) {
    console.log(e);
    res.json({ result: 'could not find user faves' });
  }
}
