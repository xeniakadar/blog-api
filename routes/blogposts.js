const express = require('express');
const router = express.Router();
const blogpost_controller = require("../controllers/blogpostController");

/* GET home page. */

router.post("/blogposts", blogpost_controller.blogpost_create_post);

module.exports = router;
