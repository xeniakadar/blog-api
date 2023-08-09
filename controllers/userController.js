/* eslint-disable */
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// create user
// exports.signup_post = async (req, res) => {
//   const user = new User({
//     username: req.body.username,
//     email: req.body.email,
//     password: req.body.password,
//   });
//   try {
//     const newUser = await user.save();
//     res.status(201).json({ message: `user registered successfully: ${newUser}`});
//   } catch (error) {
//     res.status(500).json({ error: "error registering user"});
//   }
// };

exports.signup_post = [
  body("username", "Username must be specified")
    .custom(async(username) => {
      try {
        const usernameExists = await User.findOne({ username: username });
        if (usernameExists) {
          throw new Error('Username already exists');
        }
      } catch (err) {
        throw new Error(err);
      }
    })
    .trim()
    .escape(),
  body("email")
    .trim()
    .escape()
    .isEmail()
    .withMessage("Email must be specified"),
  body("password", "Password must be specified")
    .trim()
    .escape(),

  async(req, res) => {
    const errors = validationResult(req);
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    if (!errors.isEmpty()) {
      return res.status(403).json({
        username: req.body.username,
        errors: errors.array(),
      });
    }
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: passwordHash,
    });
    try {
      await user.save();
      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        }
      });
    } catch(error) {
      return res.status(500).json({ error: "error registering user"});
    }
  }
];

exports.login_post = async function (req, res, next) {
  try {
    passport.authenticate('local', { session: false}, (err, user, info) => {
      if (err || !user) {
        const error = new Error('User does not exist');
        return res.status(403).json({
          info
        })
      }
      req.login(user, {session: false}, (err) => {
        if (err) {
          next(err);
        }
        // token
        const body = {
          _id: user._id,
          username: user.username,
          email: user.email,
        };
        const token = jwt.sign({ user: body}, process.env.SECRET, {expiresIn: '1d'});

        return res.status(200).json({body, token});

      });
    }) (req, res, next);
  } catch (err) {
    res.status(403).json({
      err
    })
  }
};
