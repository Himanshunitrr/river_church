// server/routes/postRoutes.js
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

// Normal user - create a new post
router.post("/", authMiddleware(["user", "admin"]), postController.createPost);

// Get all approved posts (public - no role needed)
router.get("/", postController.getAllApprovedPosts);

// Get pending posts (admin only)
router.get("/pending", authMiddleware("admin"), postController.getPendingPosts);
router.put(
    "/:postId",
    authMiddleware("admin"),
    postController.approveOrRejectPost
);

router.get('/:postId', postController.getPostById); // define this route

// Approve or reject a post (admin only)
router.put(
    "/:postId",
    authMiddleware("admin"),
    postController.approveOrRejectPost
);

// Delete a post (admin only)
router.delete(
	"/:postId", 
	authMiddleware("admin"), 
	postController.deletePost
);

module.exports = router;
