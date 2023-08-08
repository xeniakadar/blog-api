const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: { type: String, required: true, minLength: 5, maxLength: 300 },
  time_stamp: { type: Date },
  username: { type: String },
  postid: { type: String },
});

module.exports = mongoose.model("Comment", CommentSchema);
