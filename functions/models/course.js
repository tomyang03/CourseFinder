const { model, Schema } = require("mongoose");

const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  estimatedTime: { type: String, required: true },
  materialsNeeded: { type: String, required: true },
  // attach the whole user as an object to the course is wrong way, bad for performance
  //user: { type: Object, ref: "User", required: true },
  // use foreign key: attach the ObjectId of the user to the course, correct way of doing it
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: Date,
  updatedAt: Date,
});

const Course = model("Course", CourseSchema);
module.exports = { Course };
