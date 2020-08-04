const { model, Schema } = require("mongoose");
const validate = require("mongoose-validator");

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
  createdAt: Date,
  updatedAt: Date,
});

const User = model("User", UserSchema);
module.exports = { User };
