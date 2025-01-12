// server/controllers/commentController.js
const Comment = require("../models/comment");

exports.createComment = async (req, res) => {
	try {
		const { postId } = req.params;
		const { content } = req.body;

		const newComment = new Comment({
			post: postId,
			user: req.user.userId,
			content,
		});

		await newComment.save();
		return res.status(201).json({ msg: "Comment created, pending approval" });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

exports.getCommentsByPost = async (req, res) => {
	try {
		const { postId } = req.params;
		// Only fetch comments for this post, that are approved
		const comments = await Comment.find({
			post: postId,
			status: "approved",
		})
			.populate("user", "name") // show who commented
			.sort({ createdAt: 1 }); // oldest first, or newest first

		return res.status(200).json(comments);
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};


exports.getPendingComments = async (req, res) => {
	// Admin only
	try {
		const pendingComments = await Comment.find({ status: "pending" })
			.populate("user")
			.populate("post");
		return res.status(200).json(pendingComments);
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

exports.approveOrRejectComment = async (req, res) => {
	// Admin only
	try {
		const { commentId } = req.params;
		const { status, reason } = req.body; // 'approved' or 'rejected'

		const comment = await Comment.findById(commentId);
		if (!comment) {
			return res.status(404).json({ msg: "Comment not found" });
		}

		comment.status = status;
		await comment.save();

		// Optionally handle notifications or store the reason
		// ...

		return res.status(200).json({ msg: `Comment ${status}` });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};
