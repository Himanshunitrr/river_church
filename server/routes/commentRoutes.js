// server/routes/commentRoutes.js
const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

// Create a comment on a specific post
router.post(
	"/:postId",
	authMiddleware(["user", "admin"]),
	commentController.createComment
);


// Get approved comments for a specific post (public)
router.get("/:postId", commentController.getCommentsByPost);

// Get pending comments (admin only)
router.get("/", authMiddleware("admin"), commentController.getPendingComments);

// Approve or reject a comment (admin only)
router.put(
	"/:commentId",
	authMiddleware("admin"),
	commentController.approveOrRejectComment
);

module.exports = router;
