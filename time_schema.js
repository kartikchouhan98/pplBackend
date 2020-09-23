var mongoose = require("mongoose");
var post = mongoose.Schema(
  {
    username: { type: String },
    title: { type: String },

    pic: { type: String },
    category: { type: String },
  },
  { versionKey: false }
);
module.exports = mongoose.model("pplpostdb", post);
