/* eslint-disable */
const express = require('express');
const asyncHandler = require("express-async-handler");
const bodyParser = require("body-parser");
const Blogpost = require("../models/blogpost");
const { body, validationResult } = require('express-validator');

exports.blogpost_create_post = [
  body("title", "Title must be specified")
    .trim()
    .isLength({ max: 30 })
    .escape(),
  body("text", "Your blogpost must be at least 5 characters long")
    .trim()
    .isLength({ min: 5 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const blogpost = new Blogpost({
      title: req.body.title,
      text: req.body.text,
      userid: req.user._id,
      username: req.user.username,
      time_stamp: new Date(),
    });

    if (!errors.isEmpty()) {
      console.log(errors);
      // add error stuff
    } else {
      await blogpost.save();
      //res.redirect("/");
    }
  })
]
