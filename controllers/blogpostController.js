/* eslint-disable */
const Blogpost = require("../models/blogpost");
const Comment = require("../models/comment");
const jwt = require("jsonwebtoken");
const Topic = require("../models/topic");
const he = require('he');

const { body, validationResult } = require('express-validator');

exports.blogpost_create_post = [
  (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      jwt.verify(req.token, process.env.SECRET, (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
          req.authData = authData;
          next();
        }
      })
    } else {
      res.sendStatus(403);
    }
  },

  body("title", "Title must be specified")
    .trim()
    .isLength({ max: 30 })
    .escape(),
  body("text", "Your blogpost must be at least 5 characters long")
    .trim()
    .isLength({ min: 5 })
    .escape(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).json({
        title: req.body.title,
        text: req.body.text,
        topic: req.body.topic,
        errors: errors.array(),
      });
    }
    const topic = await Topic.findOne({ title: req.body.topic }).exec();
    if (!topic) {
      return res.status(404).json({ error: "topic not found" });
    }
    const topicId = topic._id;

    const blogpost = new Blogpost({
      title: req.body.title,
      text: req.body.text,
      topic: topicId,
      timestamp: new Date(),
      username: req.authData.user.username,
      userid: req.authData.user._id,
    });
    try {
      await blogpost.save();
      return res.status(201).json({
        message: "post saved/published successfully",
        blogpost: {
          id: blogpost._id,
          title: blogpost.title,
          published: blogpost.published,
          timestamp: blogpost.timestamp,
          username: blogpost.username,
          userid: blogpost.userid,
          comments: blogpost.comments,
          topic: blogpost.topic,
        }
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: "Error creating blogpost"})
    }
  }
];

exports.blogpost_list = async (req, res) => {
  try {
    let blogposts = await Blogpost.find({}, {title: 1, text: 1, timestamp: -1})
      .populate("title text username topic comments")
      .exec();

    const decodedBlogposts = blogposts.map(post => ({
      ...post._doc,
      title: he.decode(post.title),
      text: he.decode(post.text)
    }));
    return res.status(200).json(decodedBlogposts)
  } catch(error) {
    return res.status(500).json({ error: "error getting blogposts"})
  }
};

exports.blogpost_detail = async (req, res, next) => {
  try {
    const blogpost = await Blogpost.findById(req.params.id)
    .populate("username topic text timestamp comments")
    .exec();

    if (blogpost === null) {
      const err = new Error("Blogpost not found");
      err.status = 404;
      return next(err);
    }

    const decodedBlogpost = {
      ...blogpost._doc,
      title: he.decode(blogpost.title),
      text: he.decode(blogpost.text)
    };


    return res.status(200).json(decodedBlogpost);
  } catch(error) {
    return res.status(500).json({ error: "error getting blogpost"});
  }
}

exports.blogpost_update = [
  body("title", "Title must be specified")
    .trim()
    .isLength({ max: 30 })
    .escape(),
  body("text", "Your blogpost must be at least 5 characters long")
    .trim()
    .isLength({ min: 5 })
    .escape(),
  async (req, res) => {
    try {
      const updatedData = {};
      if (req.body.title) {
        updatedData.title = req.body.title;
      }
      if (req.body.text) {
        updatedData.text = req.body.text;
      }
      if (req.body.topic) {
        updatedData.topic = req.body.topic;
      }
      const updatedBlogpost = await Blogpost.findByIdAndUpdate(req.params.id, updatedData, {new: true});
      if (!updatedBlogpost) {
        return res.status(404).json({ error: "blogpost not found"});
      }
      return res.status(200).json(updatedBlogpost);
    } catch(error) {
      return res.status(500).json({ error: "error updating blogpost"});
    }
  }
]

// this needs to be changed
exports.blogpost_delete = [
  (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      jwt.verify(req.token, process.env.SECRET, (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
          req.authData = authData;
          next();
        }
      })
    } else {
      res.sendStatus(403);
    }
  },

  async (req, res, next) => {
    try {
      const blogpost = await Blogpost.findById(req.params.id).exec();
      if (!blogpost) {
        return res.status(404).json({ message: `blogpost ${req.params.id} not found, ` });
      }
      //check if owner of post
      if ( blogpost.userid.toString() !== req.authData.user._id) {
        return res.status(403).json({ message: "Unauthroized: youre not the author of this post", comments: commentsDeleted});
      }

      //user can delete post
      const commentsDeleted = await Comment.deleteMany({blogpostid: req.params.id});
      const blogpostDeleted = await Blogpost.findByIdAndRemove(req.params.id).exec();

      return res.status(200).json({ message: `post ${req.params.id} deleted successfully` });
    } catch (error) {
      console.log(error, req.user);
      return res.status(500).json({ error: `error deleting blogpost id: ${req.params.id}` });
    }
  }
];

exports.blogpost_publish = [
  (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      jwt.verify(req.token, process.env.SECRET, (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
          req.authData = authData;
          next();
        }
      })
    } else {
      res.sendStatus(403);
    }
  },
  async (req, res, next) => {
    try {
      const blogpost = await Blogpost.findById(req.params.id);
      if (blogpost) {
        blogpost.published = !blogpost.published;
        await blogpost.save();
        return res.status(200).json({ message: "Blog published successfully"});
      } else {
        return res.status(404).json({ message: "Blog post not found"});
      }
    } catch(error) {
      next(error);
    }
  }
];
