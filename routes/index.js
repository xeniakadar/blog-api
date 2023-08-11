/* eslint-disable */
const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/user");
// const blogpost_controller = require("../controllers/blogpostController");
const user_controller = require("../controllers/userController");
const blogpost_controller = require("../controllers/blogpostController");

/* GET home page. */


// user stuff
router.post('/register', user_controller.signup_post);
router.post('/login', user_controller.login_post);
router.get('/logout', user_controller.logout_get);

// blogpost stuff post, update, delete, get
// get one post
//delete post
//update post

router.post("/blogposts", blogpost_controller.blogpost_create_post);
router.get("/blogposts", blogpost_controller.blogpost_list);
router.get("/blogposts/:id", blogpost_controller.blogpost_detail);

module.exports = router;
