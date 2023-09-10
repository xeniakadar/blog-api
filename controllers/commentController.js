/* eslint-disable */
const Comment = require("../models/comment");
const jwt = require("jsonwebtoken");
const Blogpost = require("../models/blogpost");
const he = require('he');

const { body, validationResult } = require("express-validator");

exports.comment_create = [(req, res, next) => {
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
  body("text", "Comment must be at least 2 characters long")
    .trim()
    .isLength({ min: 2 })
    .escape(),

  async(req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(403).json({
        text: req.body.text,
        errors: errors.array(),
      })
    }

    try {
      const blogpost = await Blogpost.findById(req.params.id);
      if (!blogpost) {
        return res.status(404).json({ error: "blog post not found"});
      }
      const comment = new Comment({
        text: req.body.text,
        timestamp: new Date(),
        blogpostid: req.params.id,
        user: req.authData.user._id,
      });
      await comment.save();

      blogpost.comments.push(comment._id);
      await blogpost.save();
      return res.status(201).json({
        message: "comment successfully published",
        comment: {
          id: comment._id,
          title: comment.text,
          timestamp: comment.timestamp,
          blogpostid: comment.blogpostid,
          user: comment.user,
        }
      });
    } catch(error) {
      console.log("error creating comment", error); //delete
      return res.status(500).json({ error: "Error creating comment"});
    }
  }
];

exports.comment_list = async (req, res) => {
  try {
    const [blogpost, allComments] = await Promise.all([
      Blogpost.findById(req.params.id).exec(),
      Comment.find({ blogpostid: req.params.id }, "text user timestamp")
        .sort({ timestamp: 1 })
        .exec(),
    ]);

    const decodedComments = allComments.map(comment => ({
      ...comment._doc,
      text: he.decode(comment.text)
    }));

    if (!blogpost) {
      return res.status(404).json({ error: "blog post not found"});
    }

    return res.status(200).json({ decodedComments });

  } catch(error) {
    console.log("error getting comments", error); //delete
    return res.status(500).json({ error: "error gettings comments"})
  }
}

exports.comment_detail = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId).exec();
    if (comment === null) {
      const err = new Error("comment not found");
      err.status = 404;
      return next(err);
    }

    const decodedComment = {
      ...comment._doc,
      title: he.decode(comment.title),
      text: he.decode(comment.text)
    };
    return res.status(200).json(decodedComment);
  } catch(error) {
    return res.status(500).json({error: "error getting comment"});
  }
}

exports.comment_delete = [
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

  async(req, res, next ) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      const blogpost = await Blogpost.findById(req.params.id);

      if (!comment) {
        return res.status(404).json({ message: `comment with id: "${req.params.commentId}" not found`})
      }

      if (comment.user.toString() !== req.authData.user._id && blogpost.user.toString() !== req.authData.user._id) {
        return res.status(403).json({message: "unauthorized to delete comment"});
      }
      await Blogpost.findByIdAndUpdate(req.params.id, { $pull: { comments: comment._id } });
      await Comment.findByIdAndRemove(req.params.commentId);
      return res.status(200).json({message: `comment with id: ${req.params.commentId}, under the post with id${req.params.id} removed`});
    } catch(error) {
      return res.status(500).json({ error: `error deleting blogpost id ${req.params.commentId} under the post with id${req.params.id}`})
    }
  }
]
