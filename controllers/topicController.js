/* eslint-disable */
const { body, validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");
const Topic = require("../models/topic");
const Blogpost = require("../models/blogpost");

exports.topic_create_post = [
  body("title", "Username must be specified")
    .trim()
    .escape(),

  async (req, res) => {
    const errors = validationResult(req);

    const topic = new Topic({
      title: req.body.title,
    });
    try {
      await topic.save();
      return res.status(201).json({
        message: "title added successfully",
        topic: {
          id: topic._id,
          title: topic.title,
        }
      });
    } catch (error) {
      return res.status(500).json({ error: "error adding topic "});
    }
  }
];

exports.topic_list = async (req, res) => {
  try {
    let topics = await Topic.find({}, {title: 1})
      .populate("title")
      .exec();
    return res.status(200).json(topics)
  } catch(error) {
    return res.status(500).json({ error: "error getting topics"})
  }
};

exports.topic_detail = async (req, res, next) => {
  try {
    const [topic, blogpostsInTopic ] = await Promise.all([
      Topic.findById(req.params.topicId).exec(),
      Blogpost.find({ topic: req.params.topicId}, "title username").exec(),
    ]);

    if (!topic) {
      const err = new Error("Topic not found");
      err.status = 404;
      return next(err);
    }
    return res.status(200).json({topic, blogpostsInTopic});
  } catch(error) {
    return res.status(500).json({ error: "error getting topic"});
  }
}
