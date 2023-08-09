/* eslint-disable */
const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/user");
// const blogpost_controller = require("../controllers/blogpostController");
const user_controller = require("../controllers/userController");

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });


// user info
router.get('/', (req, res) => {
  return res.send("hello server");
})

router.post('/api/register', user_controller.signup_post);

// router.post('/api/login', passport.authenticate('local'), (req, res) => {
//   res.json({ message: 'logged in successfully', user: req.user});
// });
router.post('/api/login', user_controller.login_post);


router.get('/api/logout', user_controller.logout_get);



module.exports = router;
