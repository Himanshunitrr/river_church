// server/controllers/postController.js
const Post = require("../models/post");

exports.createPost = async (req, res) => {
	try {
		const { title, content } = req.body;
		const newPost = new Post({
			user: req.user.userId,
			title,
			content,
		});
		await newPost.save();
		return res.status(201).json({ msg: "Post created, pending approval" });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

exports.getAllApprovedPosts = async (req, res) => {
	try {
		const posts = await Post.find({ status: "approved" })
			.populate("user", "name email")
			.sort({ createdAt: -1 });
		return res.status(200).json(posts);
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

exports.getPendingPosts = async (req, res) => {
	// Admin only route
	try {
		const pendingPosts = await Post.find({ status: "pending" }).populate(
			"user"
		);
		return res.status(200).json(pendingPosts);
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};
// server/controllers/postController.js
exports.approveOrRejectPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { status, reason } = req.body; // e.g. { status: "approved" } or { status: "rejected" }

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Update status
    post.status = status; // "approved" or "rejected"
    await post.save();

    // If you want to store or log the reason for rejection:
    // post.rejectionReason = reason; // (Add in your schema if you want)
    // await post.save();

    return res.status(200).json({ msg: `Post ${status}` });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};


exports.getPostById = async (req, res) => {
	try {
		const { postId } = req.params;
		// Find the post by ID. If you want to populate user info (e.g. name), do so:
		const post = await Post.findById(postId).populate("user", "name"); // or more fields if needed

		if (!post) {
			return res.status(404).json({ msg: "Post not found" });
		}

		// Only return approved posts to the public.
		// If you want to let the post be visible regardless, skip this check.
		if (post.status !== "approved") {
			return res.status(403).json({ msg: "This post is not approved yet." });
		}

		return res.status(200).json(post);
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};