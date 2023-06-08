// Import required modules and models
const Courses = require("../models/Courses");
const Subjects = require("../models/Subjects");
const Levels = require("../models/Levels");
const bodyParser = require("body-parser");

// List courses
exports.list = async (req, res) => {
  const perPage = 10;
  const limit = parseInt(req.query.limit) || 10; // Make sure to parse the limit to number
  const page = parseInt(req.query.page) || 1;
  const message = req.query.message;

  try {
    // Retrieve courses with pagination and sorting
    const courses = await Courses.find({}).skip((perPage * page) - perPage).limit(limit).sort({ _id: -1 });
    const count = await Courses.find({}).count();
    const numberOfPages = Math.ceil(count / perPage);

    // Render the courses view with the retrieved data
    res.render("courses", {
      courses: courses,
      numberOfPages: numberOfPages,
      currentPage: page,
      message: message
    });
  } catch (e) {
    res.status(404).send({ message: "Could not list courses" });
  }
};

// Edit course
exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    // Retrieve subjects, levels, and the course with the given id
    const subject = await Subjects.find({});
    const levels = await Levels.find({});
    const course = await Courses.findById(id);
    if (!course) throw Error('can not find the course');

    // Render the update-course view with the retrieved data
    res.render('update-course', {
      subject: subject,
      levels: levels,
      course: course,
      id: id,
      errors: {}
    });
  } catch (e) {
    console.log(e)
    if (e.errors) {
      res.render('create-tasting', { errors: e.errors })
      return;
    }
    res.status(404).send({
      message: `could find course ${id}`,
    });
  }
};

// Update course
exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    // Find the course with the given id
    const course = await Courses.findById(id);
    const subject = await Subjects.find({});
    const levels = await Levels.find({});
    if (!course) {
      return res.status(404).send({
        message: `Could not find course ID: ${id}.`,
      });
    }

    // Update the course with the request body
    await Courses.updateOne({ _id: id }, req.body);
    const updatedCourse = await Courses.findById(id);
    res.redirect(`/courses?message=${updatedCourse.course_title} has been updated. `);
  } catch (e) {
    res.status(500).send({
      message: 'An error occurred while updating the course.',
    });
  }
};

// Delete course
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    // Find and remove the course with the given id
    await Courses.findByIdAndRemove(id);
    res.redirect("/courses");
  } catch (e) {
    res.status(404).send({
      message: `could not delete course - ${id}.`,
    });
  }
}

// Get current date as ISO string
function today() {
  const currentDate = new Date();
  return currentDate.toISOString();
}

// Create course
exports.create = async (req, res) => {
  try {
    // Find subjects and levels by their IDs
    const subjects = await Subjects.findById(req.body.subjects_id);
    const levels = await Levels.findById(req.body.levels_id);
    const [subjectId, subjectCategory] = req.body.subject.split('_');

    // Create a new course with the request body
    await Courses.create({
      course_title: req.body.course_title,
      course_id: req.body.course_id,
      url: req.body.url,
      is_paid: req.body.is_paid,
      price: parseInt(req.body.price),
      num_subscribers: parseInt(req.body.num_subscribers),
      num_reviews: parseInt(req.body.num_reviews),
      num_lectures: parseInt(req.body.num_lectures),
      level: req.body.level,
      content_duration: req.body.content_duration,
      published_timestamp: today(),
      subject: subjectCategory,
      subject_id: subjectId,
    });

    res.redirect('/courses?message=Course has been created');
  } catch (e) {
    if (e.errors) {
      res.render('add-course', { errors: e.errors });
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
}

// Create course view
exports.createView = async (req, res) => {
  try {
    // Retrieve subjects and levels
    const subjects = await Subjects.find({});
    const levels = await Levels.find({});

    // Render the add-course view with the retrieved data
    res.render("add-course", {
      subjects: subjects,
      levels: levels,
      errors: {}
    });
  } catch (e) {
    res.status(404).send({
      message: `could not generate create data`,
    });
  }
}
