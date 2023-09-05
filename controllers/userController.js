/* eslint-disable */
const { body, validationResult } = require("express-validator");

const Blogpost = require("../models/blogpost");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const he = require('he');

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

  async (req, res) => {
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
      admin: req.body.admin,
    });
    try {
      await user.save();
      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          admin: user.admin,
        }
      });
    } catch (error) {
      return res.status(500).json({ error: "error registering user"});
    }
  }
];

exports.login_post = async function (req, res, next) {
  try {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(403).json({
          error: 'Authentication failed'
        });
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
          admin: user.admin,
        };
        const token = jwt.sign({ user: body}, process.env.SECRET, {expiresIn: '1h'});
        return res.status(200).json({body, token});
      });
    }) (req, res, next);
  } catch (err) {
    return res.status(500).json({
      error: 'Server error'
    });
  }
};

exports.get_user = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).exec();

    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Internal error:", error);
    return res.status(500).json({ error: "error getting user" });
  }
};

exports.get_published_posts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).exec();
    let blogposts = await Blogpost.find({userid: user._id, published: true}, {title: 1, text: 1, timestamp: 1})
      .populate("title text username topic comments")
      .sort({timestamp: -1})
      .exec();

    const decodedBlogposts = blogposts.map(post => ({
      ...post._doc,
      title: he.decode(post.title),
      text: he.decode(post.text)
    }));
    return res.status(200).json(decodedBlogposts)
  } catch(error) {
    console.log(error)
    return res.status(500).json({ error: "error getting blogposts"})
  }
}

exports.get_user_drafts = [
  (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      jwt.verify(req.token, process.env.SECRET, (err, authData) => {
        if (err) {
          res.status(403).json({ error: "Access denied" });
        } else {
          req.authData = authData;
          next();
        }
      });
    } else {
      res.status(403).json({ error: "Access denied" });
    }
  },
  async (req, res) => {
    try {
      if (req.params.id !== req.authData.user._id) {
        return res.status(403).json({ error: "Access denied"})
      }
      const user = await User.findById(req.params.id).exec();
      let blogposts = await Blogpost.find({userid: user._id, published: false}, {title: 1, text: 1, timestamp: 1})
        .populate("title text username topic comments")
        .sort({timestamp: -1})
        .exec();

      const decodedBlogposts = blogposts.map(post => ({
        ...post._doc,
        title: he.decode(post.title),
        text: he.decode(post.text)
      }));
      return res.status(200).json(decodedBlogposts)
    } catch(error) {
      console.log(error)
      return res.status(500).json({ error: "error getting drafts"})
    }
  }

]
