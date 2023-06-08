// Import the Courses model
const Courses = require('../../models/Courses');

// Export the list function as the request handler for the GET request
exports.list = async (req, res) => {
    
    // Retrieve the search query parameter from the request
    const searchQuery = req.query.search;

    // If search query is not provided, send an empty array as the response
    if (!searchQuery) {
        res.json([]);
    }

    try {
        // Perform the search using the Courses model
        const Result = await Courses.find(
            { $text: { $search: searchQuery } }, // Perform a text-based search on the searchQuery field
            { score: { $meta: "textScore" } } // Include the relevance score in the result
        )
        .sort({ score: { $meta: "textScore" } }) // Sort the results by relevance score in descending order
        .limit(50); // Limit the maximum number of results to 50

        // Send the search results as the response
        res.json(Result);
    } catch (error) {
        // If an error occurs during the search, log the error and send a 404 response with an error message
        console.log(error);
        res.status(404).send({
            message: `Could not perform search`,
        });
    }
}
