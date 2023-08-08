/* eslint-disable */
const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/user");
// const blogpost_controller = require("../controllers/blogpostController");

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/users', (req, res) => {
  return res.send('Received a GET HTTP method');
});
router.post('/users', (req, res) => {
  return res.send('Received a POst HTTP method');
});
router.put('/users/:userId', (req, res) => {
  return res.send(`PUT HTTP method on user/${req.params.userId} resource`);
});
router.delete('/users/:userId', (req, res) => {
  return res.send(`DELETE HTTP method on user/${req.params.userId} resource`);
});


// user info
router.get('/', (req, res) => {
  return res.send("hello server");
})

router.post('/api/register', async(req, res) => {
  const { username, email, password} = req.body;
  try {
    const user = await User.create({ username, email, password});
    res.status(201).json({ message: `user registered successfully ${req.params.username}`});
    console.log(req.body);
  } catch (error) {
    res.status(500).json({ error: "error registering user"});
  }
});

router.post('/api/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'logged in successfully', user: req.user});
});

router.post('/api/logout', (req, res) => {
  req.logout();
  res.json({ message: 'logged out succesffuly'});
});


module.exports = router;
