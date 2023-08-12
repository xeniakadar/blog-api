/* eslint-disable */
const express = require('express');
const router = express.Router();
// const blogpost_controller = require("../controllers/blogpostController");
const user_controller = require("../controllers/userController");
const blogpost_controller = require("../controllers/blogpostController");
const comment_controller = require("../controllers/commentController");
const topic_controller = require("../controllers/topicController");

/* GET home page. */


// user stuff
router.post('/register', user_controller.signup_post);
router.post('/login', user_controller.login_post);
router.get('/logout', user_controller.logout_get);

// blogpost stuff post, update, delete, get

router.post("/blogposts", blogpost_controller.blogpost_create_post);
router.get("/blogposts", blogpost_controller.blogpost_list);
router.get("/blogposts/:id", blogpost_controller.blogpost_detail);
router.put("/blogposts/:id", blogpost_controller.blogpost_update);
router.delete("/blogposts/:id", blogpost_controller.blogpost_delete);
router.post("/blogposts/:id/publish", blogpost_controller.blogpost_publish);

//blogpost topic get all topics, get all posts under topic
router.get("/topics", topic_controller.topic_list);
router.post("/topics", topic_controller.topic_create_post);
router.get("/topics/:topicId", topic_controller.topic_detail);

//comment stuff getall, post, getone, delete

router.post("/blogposts/:id/comments", comment_controller.comment_create);
router.get("/blogposts/:id/comments", comment_controller.comment_list);
router.get("/blogposts/:id/comments/:commentId", comment_controller.comment_detail);
router.delete("/blogposts/:id/comments/:commentId", comment_controller.comment_delete);

module.exports = router;
