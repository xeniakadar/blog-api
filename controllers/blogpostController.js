/* eslint-disable */
const express = require('express');
const asyncHandler = require("express-async-handler");
const bodyParser = require("body-parser");
const Blogpost = require("../models/blogpost");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const { body, validationResult } = require('express-validator');

exports.blogpost_create_post = [
  //verifyToken,

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
        errors: errors.array(),
      });
    }
    const blogpost = new Blogpost({
      title: req.body.title,
      text: req.body.text,
      published: req.body.published,
      timestamp: new Date(),
      username: req.body.username,
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
        }
      });
    } catch (error) {
      return res.status(500).json({ error: "Error creating blogpost"})
    }
  }
];

exports.blogpost_list = async (req, res, next) => {
  try {
    let blogposts = await Blogpost.find({}, {title: 1, text: 1, timestamp: -1})
      .populate("title")
      .exec();
    return res.status(200).json(blogposts)
  } catch(error) {
    return res.status(500).json({ error: "error getting blogposts"})
  }
};

exports.blogpost_detail = async (req, res, next) => {
  try {
    const blogpost = await Blogpost.findById(req.params.id)
    .populate("username")
    .exec();
    if (blogpost === null) {
      const err = new Error("Blogpost not found");
      err.status = 404;
      return next(err);
    }

    return res.status(200).json(blogpost);
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
exports.blogpost_delete =async (req, res, next) => {
  try {
    const blogpost = await Blogpost.findByIdAndRemove(req.params.id).exec();
    if (!blogpost) {
      return res.status(404).json({ message: `blogpost ${req.params.id} not found` });
    }
    return res.status(200).json({ message: `post ${req.params.id} deleted successfully` });
  } catch (error) {
    return res.status(500).json({ error: `error deleting blogpost id: ${req.params.id}` });
  }
}


function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
};
