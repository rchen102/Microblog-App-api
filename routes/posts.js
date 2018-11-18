const express = require("express");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const PostController = require("../controllers/post");
const router = express.Router();

// Get the posts
router.get("", PostController.getPosts);

// Get one post by Id
router.get("/:id", PostController.getSinglePost);

// Post a post
router.post("", checkAuth, extractFile, PostController.createPost);

// Update a post by Id
router.put("/:id", checkAuth, extractFile, PostController.updatePost);

// Delete a post by Id
router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
