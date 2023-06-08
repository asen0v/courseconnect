require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const User = require("./models/User");

const homeController = require("./controllers/home");
const coursesController = require("./controllers/courses");
const userController = require("./controllers/user");

const courseApiController = require("./controllers/api/course");
const favouritesApiController = require("./controllers/api/favourites");
const favouritesController = require("./controllers/favourites");
 
const app = express();
app.set('trust proxy', 1) // trust first proxy
app.set("view engine", "ejs");
const { PORT, MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressSession({ secret: 'Palm Tree', cookie: { expires: new Date(253402300000000), resave: true, saveUninitialized: true} }))


app.use("*", async (req, res, next) => {
  global.user = false;
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
})

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect('/');
  }
  next()
}

app.get("/", homeController.list);
app.get("/courses", coursesController.list);

app.get("/logout", async (req, res) => { 
  req.session.destroy(); 
  global.user = false;
  res.redirect('/');
})



app.get("/add-course", coursesController.createView);
app.post("/add-course", coursesController.create);

app.get("/update-course/:id", coursesController.edit);
app.post("/update-course/:id", coursesController.update);

app.get("/search-courses",(req,res) => {
  res.render('search-courses', courseApiController);
});

 app.get("/favourites", favouritesController.list);

app.get("/api/search-courses", courseApiController.list);
app.post("/api/favourites", favouritesApiController.create);
app.delete("/api/favourites", favouritesApiController.delete);

app.get("/courses/delete/:id", coursesController.delete);

app.get("api/courses", )

app.get("/register", (req, res) => {
  res.render('register', { errors: {} })
});

app.post("/register", userController.create);
app.get("/login", (req, res) => {
  res.render('login', { errors: {} })
});
app.post("/login", userController.login);

app.listen(PORT, () => {
  console.log(
    `CourseConnect app online at http://localhost:${PORT}`,
    chalk.green("✓")
  );
});
