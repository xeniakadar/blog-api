/* eslint-disable */
const express = require('express');
const asyncHandler = require("express-async-handler");
const bodyParser = require("body-parser");
const Comment = require("../models/comment");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Blogpost = require("../models/blogpost");

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

    const comment = new Comment({
      text: req.body.text,
      timestamp: new Date(),
      username: req.authData.user.username,
    });

    try {
      await comment.save();
      const blogpost = await Blogpost.findById(req.params.id);
      blogpost.comments.push(comment._id);
      await blogpost.save();
      return res.status(201).json({
        message: "comment successfully published",
        comment: {
          id: comment._id,
          title: comment.text,
          comment: comment.username,
          timestamp: comment.timestamp,
        }
      });
    } catch(error) {
      console.log("error creating message", error);
      return res.status(500).json({ error: "Error creating comment"});
    }
  }
]
