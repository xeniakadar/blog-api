const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: { type: String, required: true, minLength: 5, maxLength: 300 },
  timestamp: { type: Date },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  blogpostId: { type: Schema.Types.ObjectId, ref: "Blogpost" },
});

module.exports = mongoose.model("Comment", CommentSchema);
