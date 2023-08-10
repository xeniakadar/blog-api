const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BlogpostSchema = new Schema({
  title: { type: String, required: true, maxLength: 30 },
  text: { type: String, required: true, minLength: 5, maxLength: 300 },
  userid: { type: String },
  timestamp: { type: Date },
  username: { type: String },
  published: { type: Boolean, default: false},
});

module.exports = mongoose.model("Blogpost", BlogpostSchema);
