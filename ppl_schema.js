var mongoose = require("mongoose");
var user = mongoose.Schema(
  {
    username: { type: String },
    password: { type: String },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    description: { type: String },
    gender: { type: String },
    profile_pic: { type: String },
  },
  { versionKey: false }
);
module.exports = mongoose.model("ppluserdb", user);
