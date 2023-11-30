"use strict";

const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const authentication = require("basic-auth");

const { User } = require("./models/user");
const { Course } = require("./models/course");
const mongoose = require("mongoose");
let ObjectId = require("mongodb").ObjectID;

//error handler middlerware
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      console.log("inside error middleware");
      console.log("inside error middleware");
      await cb(req, res, next);
    } catch (err) {
      console.log("middleware throwing error");
      console.log(err);
      next(err);
      console.log("after err");
    }
  };
}

//User authitfication
const authenticateUser = async (req, res, next) => {
  console.log("auth");
  let message = null;
  console.log("before find");
  const users = await User.find({});
  console.log("find");
  console.log("request for sign in", req);
  const credentials = authentication(req);
  console.log("credentials", credentials);
  if (credentials) {
    const user = users.find((user) => user.emailAddress === credentials.name);
    if (user) {
      const authenticated = bcryptjs.compareSync(
        credentials.pass,
        user.password
      );
      if (authenticated) {
        console.log(
          `Authentication successful for username: ${user.emailAddress}`
        );
        req.currentUser = user;
      } else {
        message = `Password incorrect for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = "Authorization header not found";
  }
  if (message) {
    console.warn(message);
    res.status(401).json({ message: message });
  } else {
    next();
  }
};

// Get all users for testing purpose
// router.get(
//   "/users",
//   asyncHandler(async (req, res) => {
//     const users = await User.find({});
//     res.json(users);
//   })
// );

//USER ROUTE for UserSignIn
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    console.log(req);
    console.log("sign in");
    console.log(req.currentUser);
    const authUser = req.currentUser;
    // {
    //   attributes: {
    //     exclude: ["password", "createdAt", "updatedAt"],
    //   },
    const user = await User.findById(authUser.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "User not found" });
    }
  })
);

//POST USER for Sign Up
router.post(
  "/user",
  // [
  //   check("firstName")
  //     .not()
  //     .isEmpty()
  //     .withMessage("Please provide a first name."),
  //   check("lastName")
  //     .not()
  //     .isEmpty()
  //     .withMessage("Please provide a last name."),
  //   check("emailAddress")
  //     .not()
  //     .isEmpty()
  //     .withMessage("Please provide an email address"),
  //   check("password").not().isEmpty().withMessage("Please provide a password."),
  //   check("confirmedpassword")
  //     .not()
  //     .isEmpty()
  //     .withMessage("Please confirm your password."),
  // ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      console.log(errors);
      console.log("inside erorrs");
      const errorMessages = errors.array().map((error) => error.msg);
      res.status(400).json({ errors: errorMessages });
    } else {
      console.log("else");
      const user = req.body;
      if (user.password) {
        user.password = bcryptjs.hashSync(user.password);
        user.createdAt = Date.now();
        user.updatedAt = Date.now();
      }

      console.log(user);

      // create a new object newuser, by stripping out confirmedpassword property from user object
      //const { confirmedpassword, ...newuser } = user;
      var createduser = new User(user);
      //console.log("newuser", newuser);
      console.log(createduser);
      console.log("routes");

      try {
        console.log("before create1111");
        const created = await User.create(createduser);
        console.log("try111");
        console.log("created1222222", created);

        return res.status(200).json({
          message: "User successfully created!",
          createduser: created,
        });
      } catch (err) {
        console.log("in catch");
        console.log(err);
        return res.status(400).json({ error: "User not created!" });
      }

      // createduser.create(function (err) {
      //   if (err) {
      //     console.log("dd");
      //     console.log(err.errmsg);
      //     console.dir(err);
      //     res.status(400).json({ errors: [err.errmsg] });
      //   } else {
      //     console.log("here2");
      //     res.status(201).json({
      //       message: "User created successfully",
      //       createduser: createduser,
      //     });
      //   }
      // });
    }
    console.log("test2");
  }
);

// COURSES ROUTES

//GET COURSES
router.get(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res) => {
    // Inner Join, grab the user information with the given ObjectId and attach it to the course
    Course.find()
      .populate("user")
      .exec(function (err, courses) {
        if (err) throw err;
        // return all courses with the user information after the Inner Join
        res.send(courses);
      });
  })
);

//GET Courses by ID
router.get(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    console.log("get course");
    const course = await Course.findById(req.params.id);
    res.status(200).json(course);
  })
);

//POST (CREATE) Course
router.post(
  "/courses/create",
  [
    authenticateUser,

    check("title").not().isEmpty().withMessage("Please provide a title."),
    check("description")
      .not()
      .isEmpty()
      .withMessage("Please provide a description."),
    check("estimatedTime")
      .not()
      .isEmpty()
      .withMessage("Please provide an estimated time."),
    check("materialsNeeded")
      .not()
      .isEmpty()
      .withMessage("Please provide materials needed."),
  ],

  asyncHandler(async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      console.log(errors);
      console.log("inside erorrs");
      const errorMessages = errors.array().map((error) => error.msg);
      res.status(400).json({ errors: errorMessages });
    } else {
      try {
        let course = new Course();
        console.log("the course is :", course);
        console.log(req.body);
        course.title = req.body.title;
        course.description = req.body.description;
        course.estimatedTime = req.body.estimatedTime;
        course.materialsNeeded = req.body.materialsNeeded;
        console.log("typeof req.body,userId:", typeof req.body.userId);
        const userId = new mongoose.mongo.ObjectId(req.body.userId);
        const author = await User.findById(userId);
        console.log(author);
        course.user = author;
        course.createdAt = Date.now();
        course.updatedAt = Date.now();
        const createdcourse = await Course.create(course);
        console.log("createdcourse is: ", createdcourse);
        res.status(201).json(createdcourse);
      } catch (error) {
        console.log(error);
        res.status(400).json({ error });
      }
    }
  })
);

//PUT(Update) Courses
router.put(
  "/courses/update/:id",
  authenticateUser,
  [
    check("title").not().isEmpty().withMessage("Please provide a title"),
    check("description")
      .not()
      .isEmpty()
      .withMessage("Please provide a description"),
  ],
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("got issue");
      //if there are validation errors such as a title is empty
      const errorMessages = errors.array().map((error) => error.msg);
      res.status(400).json({ errors: errorMessages });
    } else {
      console.log("no issue");
      const authUser = req.currentUser;
      console.log("req.body", req.body);
      console.log("req.params", req.params);
      console.log("req.params.id", req.params.id);
      const course = await Course.findById(req.params.id);
      console.log(typeof authUser._id);
      console.log(typeof course.user._id);
      console.log(
        JSON.stringify(authUser._id) === JSON.stringify(course.user._id)
      );
      /* authUser._id and course.user._id are both objects, 
      of type ObjectID, but have different addresses in memory
      To compare these 2 objectrs we need to use JSON.stringify: 
      this is how you compare two Id's if they have the same Id, 
      you convert them to string with JSON.stringify and check their content.*/
      if (JSON.stringify(authUser._id) === JSON.stringify(course.user._id)) {
        console.log("json");
        //if (authUser.emailAddress === course.user.emailAddress) {
        const filter = { _id: req.params.id };
        const update = req.body;
        // `doc` is the document _before_ `update` was applied
        let updatedcourse = await Course.findOneAndUpdate(filter, update, {
          new: true,
        });
        //const updatedcourse = await course.update(req.body);
        res.status(200).json({ updatedcourse: updatedcourse });
      } else {
        console.log("not own course");
        res.status(403).json({
          errors: [
            "Unfortunatley you can only make changes to your own courses.",
          ],
        });
      }
    }
  })
);

//DELETE Course ID, return no page
router.delete(
  "/courses/delete/:id",
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    const authUser = req.currentUser;
    console.log("authUser :", authUser);
    const course = await Course.findById(req.params.id);
    console.log("course:", course);
    console.log(authUser.emailAddress);
    console.log(course.user.emailAddress);
    if (course) {
      // check the content of the  id of the user that is logged in vs the content of the id of the user for that course
      if (JSON.stringify(authUser._id) === JSON.stringify(course.user._id)) {
        await course.remove();
        res.status(200).json({ successmessage: "Course has been deleted." });
      } else {
        res.status(403).json({
          message: "Sorry. You can only make changes to your own courses.",
        });
      }
    } else {
      next(); //
    }
  })
);

module.exports = router;
