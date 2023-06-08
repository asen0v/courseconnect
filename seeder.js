const { MongoClient } = require("mongodb");
require("dotenv").config();
const fs = require("fs").promises;
const path = require("path");
const loading = require("loading-cli");
const { MONGODB_URI } = process.env;


/**
 * constants
 */
const client = new MongoClient(MONGODB_URI);

async function main() {
  try {
    await client.connect();
    const db = client.db();
    const results = await db.collection("courses").find({}).count();

    /**
     * If existing records then delete the current collections
     */
    if (results) {
      db.dropDatabase();
    }

    /**
     * This is just a fun little loader module that displays a spinner
     * to the command line
     */
    const load = loading("Importing your courses 📚!!").start();

    /**
     * Import the JSON data into the database
     */

    const data = await fs.readFile(path.join(__dirname, "courses.json"), "utf8");
    await db.collection("courses").insertMany(JSON.parse(data));

    /**
     * This perhaps appears a little more complex than it is. Below, we are
     * grouping the wine tasters and summing their total tastings. Finally,
     * we tidy up the output so it represents the format we need for our new collection
     */


    const coursesCategoryRef = await db.collection("courses").aggregate([
      { $match: { subject: { $ne: null } } },
      {
        $group: {
          _id: "$subject",
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
        },
      },
    ]);
    

    const courseLevelsRef = await db.collection("courses").aggregate([
      { $match: { level: { $ne: null } } },
      {
        $group: {
          _id: "$level",
        },
      },
      {
        $project: {
          _id: 0,
          level: '$_id',
        },
      },
    ]);
    


    
    /**
     * Below, we output the results of our aggregate into a
     * new collection
     */
    const courseCategories = await coursesCategoryRef.toArray();
    await db.collection("categories").insertMany(courseCategories);

    const courseLevels = await courseLevelsRef.toArray();
    await db.collection("levels").insertMany(courseLevels);


 
     /** In this code, we are updating documents in the "courses" collection based on matching values from the "categories" collection.
We first retrieve all the documents from the "categories" collection and store them in the updatedCoursesCategory array.
Then, using a for...of loop, we iterate over each document in the updatedCoursesCategory array.
Inside the loop, we update the "courses" collection using the updateMany method. We specify a filter to match the documents where the "subject" field matches the current category value.
We then use the $set operator to set the "subject_id" field to the corresponding _id value from the "categories" collection.
By using await inside the loop, we ensure that each update operation completes before moving on to the next iteration.
     */

    const updatedCoursesCategoryRef = db.collection("categories").find({});
     const updatedCoursesCategory = await updatedCoursesCategoryRef.toArray();
     
     for (const { _id, category } of updatedCoursesCategory) {
       await db.collection("courses").updateMany({ subject: category }, [
         {
           $set: {
             subject_id: _id,
           },
         },
       ]);
     }

    
     const updatedCoursesLevelsRef = db.collection("levels").find({});
     const updatedCoursesLevels = await updatedCoursesLevelsRef.toArray();
     
     for (const { _id, level } of updatedCoursesLevels) {
       await db.collection("courses").updateMany({ level: level }, [
         {
           $set: {
             level_id: _id,
           },
         },
       ]);
     }
    


    load.stop();
    console.info(
      `Course collection is set up! 📖 \n `
    );


    process.exit();
  } catch (error) {
    console.error("error:", error);
    process.exit();
  }
}

main();
