/* eslint-disable */
const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/userController");
const blogpost_controller = require("../controllers/blogpostController");
const comment_controller = require("../controllers/commentController");
const topic_controller = require("../controllers/topicController");

// users
router.post("/register", user_controller.signup_post);
router.post("/login", user_controller.login_post);
router.get("/users/:id", user_controller.get_user);
router.get("/users/:id/drafts", user_controller.get_user_drafts);
router.get("/users/:id/blogposts", user_controller.get_published_posts);

// blogposts

router.post("/blogposts", blogpost_controller.blogpost_create_post);
router.get("/blogposts", blogpost_controller.blogpost_list);
router.get("/blogposts/:id", blogpost_controller.blogpost_detail);
router.put("/blogposts/:id", blogpost_controller.blogpost_update);
router.delete("/blogposts/:id", blogpost_controller.blogpost_delete);
router.post("/blogposts/:id/publish", blogpost_controller.blogpost_publish);

//topics
router.get("/topics", topic_controller.topic_list);
router.post("/topics", topic_controller.topic_create_post);
router.get("/topics/:topicId", topic_controller.topic_detail);

//comments

router.post("/blogposts/:id/comments", comment_controller.comment_create);
router.get("/blogposts/:id/comments", comment_controller.comment_list);
router.get(
  "/blogposts/:id/comments/:commentId",
  comment_controller.comment_detail,
);
router.delete(
  "/blogposts/:id/comments/:commentId",
  comment_controller.comment_delete,
);

module.exports = router;
