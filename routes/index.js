const express = require('express');
const router = express.Router();
// const blogpost_controller = require("../controllers/blogpostController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.post('/blogposts', blogpost_controller.blogpost_create_post);

module.exports = router;
