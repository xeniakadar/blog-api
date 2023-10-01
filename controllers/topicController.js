const { body, validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");
const Topic = require("../models/topic");
const Blogpost = require("../models/blogpost");
const he = require("he");

exports.topic_create_post = [
  (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      jwt.verify(req.token, process.env.SECRET, (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
          console.log(authData);
          req.authData = authData;
          next();
        }
      });
    } else {
      res.sendStatus(403);
    }
  },
  body("title", "topic must be specified").trim().escape(),

  async (req, res) => {
    const errors = validationResult(req);

    const topic = new Topic({
      title: req.body.title,
    });
    try {
      if (req.authData.user.admin === true) {
        await topic.save();
        return res.status(201).json({
          message: "title added successfully",
          topic: {
            id: topic._id,
            title: topic.title,
          },
        });
      } else {
        return res.status(403).json({
          message: `You must be an administrator to create a topic user: ${req.authData.user.admin}`,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "error adding topic " });
    }
  },
];

exports.topic_list = async (req, res) => {
  try {
    let topics = await Topic.find({}, { title: 1 }).populate("title").exec();
    return res.status(200).json(topics);
  } catch (error) {
    return res.status(500).json({ error: "error getting topics" });
  }
};

exports.topic_detail = async (req, res, next) => {
  try {
    const [topic, blogpostsInTopic] = await Promise.all([
      Topic.findById(req.params.topicId).exec(),
      Blogpost.find({ topic: req.params.topicId, published: true })
        .select("title user timestamp text comments published")
        .populate("comments user")
        .sort({ timestamp: -1 })
        .exec(),
    ]);

    if (!topic) {
      const err = new Error("Topic not found");
      err.status = 404;
      return next(err);
    }

    const decodedBlogpost = blogpostsInTopic.map((post) => ({
      ...post._doc,
      title: he.decode(post.title),
      text: he.decode(post.text),
    }));

    return res.status(200).json({ topic, decodedBlogpost });
  } catch (error) {
    return res.status(500).json({ error: "error getting topic" });
  }
};
