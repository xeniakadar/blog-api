const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BlogpostSchema = new Schema({
  title: { type: String, required: true, maxLength: 30 },
  text: { type: String, required: true, minLength: 5 },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  topic: { type: Schema.Types.ObjectId, ref: "Topic" },
  published: { type: Boolean, default: false },
});

module.exports = mongoose.model("Blogpost", BlogpostSchema);
