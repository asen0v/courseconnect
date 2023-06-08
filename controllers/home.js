// Import required models
const Courses = require('../models/Courses');
const Subjects = require('../models/Subjects');
const Levels = require("../models/Levels");
const bodyParser = require("body-parser"); 

// Export the list function as the request handler for retrieving data for the index page
exports.list = async (req, res) => {
    console.log(req.session);

    try {
        // Retrieve various counts and statistics from the Courses collection
        const totalCourses = await Courses.find({}).countDocuments();
        const totalSubjects = await Subjects.find({}).countDocuments();
        const coursesUnder50 = await Courses.countDocuments({ price: { $lt: 50 } });
        const coursesUnder100 = await Courses.countDocuments({ price: { $lt: 100 } });
        const reviewsOver100 = await Courses.countDocuments({ num_reviews: { $gt: 100 } });
        const subsOver100 = await Courses.countDocuments({ num_subscribers: { $gt: 100 } });
        const courses = await Courses.find({}).limit(3).sort({ _id: -1 });
        const countFree = await Courses.countDocuments({ is_paid: false });
        const countPaid = await Courses.countDocuments({ is_paid: true });
        const categories = await Subjects.find({});
        const countCategories = await Subjects.countDocuments();

        // Retrieve subject count summary using aggregation pipeline
        const subjectCountSummaryRef = await Courses.aggregate([
            { $match: { subject: { $ne: null } } },
            {
                $group: {
                    _id: "$subject",
                    total: { $sum: 1 },
                    paid: { $sum: { $cond: { if: { $eq: ["$is_paid", true] }, then: 1, else: 0 } } },
                    free: { $sum: { $cond: { if: { $eq: ["$is_paid", false] }, then: 1, else: 0 } } },
                }
            }
        ]);

        // Map the subject count summary data to a more readable format
        const subjectCountSummary = subjectCountSummaryRef.map(c => ({
            subject: c._id,
            total: c.total,
            paid: c.paid,
            free: c.free,
        }));

        // Render the index view with the retrieved data
        res.render("index", {
            totalCourses,
            totalSubjects,
            coursesUnder50,
            coursesUnder100,
            reviewsOver100,
            subsOver100,
            countFree,
            countPaid,
            courses,
            categories,
            countCategories,
            subjectCountSummary,
        });
    } catch (e) {
        res.status(404).send({
            message: `error rendering page`,
        });
    }
}
