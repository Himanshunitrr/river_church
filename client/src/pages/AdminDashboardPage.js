// client/src/pages/AdminDashboardPage.js
import React, { useState, useEffect } from "react";
import {
	fetchPendingPosts,
	approveOrRejectPost,
} from "../services/postService";
import {
	fetchPendingComments,
	approveOrRejectComment,
} from "../services/commentService";
import "./AdminDashboardPage.css";
const AdminDashboardPage = () => {
	const [pendingPosts, setPendingPosts] = useState([]);
	const [pendingComments, setPendingComments] = useState([]);
	const [popUpMessage, setPopUpMessage] = useState("");

	// Get JWT token for API calls
	const token = localStorage.getItem("token");

	// Load pending posts/comments on mount
	useEffect(() => {
		loadData();
		// eslint-disable-next-line
	}, [token]);

	// Helper to load all pending data
	const loadData = async () => {
		try {
			const posts = await fetchPendingPosts(token);
			const comments = await fetchPendingComments(token);
			setPendingPosts(posts);
			setPendingComments(comments);
		} catch (error) {
			console.error(error);
		}
	};

	// Handle post approval/rejection
	const handlePostApproval = async (postId, status) => {
		try {
			// Call the service function
			const response = await approveOrRejectPost(postId, status, token);

			// Remove the post from state so it's no longer displayed
			setPendingPosts((prevPosts) => prevPosts.filter((p) => p._id !== postId));

			// Show a popup message
			setPopUpMessage(`Post has been ${status}.`);

			// Clear the popup after 3 seconds
			setTimeout(() => {
				setPopUpMessage("");
			}, 3000);
		} catch (error) {
			console.error(error);
			setPopUpMessage("Failed to update post.");
		}
	};

	// Handle comment approval/rejection
	const handleCommentApproval = async (commentId, status) => {
		try {
			// Call the service function
			const response = await approveOrRejectComment(commentId, status, token);

			// Remove the comment from state so it's no longer displayed
			setPendingComments((prevComments) =>
				prevComments.filter((c) => c._id !== commentId)
			);

			// Show a popup message
			setPopUpMessage(`Comment has been ${status}.`);

			// Clear the popup after 3 seconds
			setTimeout(() => {
				setPopUpMessage("");
			}, 3000);
		} catch (error) {
			console.error(error);
			setPopUpMessage("Failed to update comment.");
		}
	};

	return (
		<div>
			<h2>Admin Dashboard</h2>

			{/* Popup message, shown if popUpMessage is non-empty */}
			{popUpMessage && (
				<div
					style={{
						backgroundColor: "lightblue",
						border: "1px solid #000",
						borderRadius: "4px",
						padding: "10px",
						marginBottom: "10px",
					}}
				>
					{popUpMessage}
				</div>
			)}

			{/* Pending Posts */}
			<section>
				<h3>Pending Posts</h3>
				{pendingPosts.length === 0 && <p>No pending posts.</p>}
				{pendingPosts.map((post) => (
					<div
						key={post._id}
						style={{
							border: "1px solid #000",
							margin: "10px 0",
							padding: "10px",
							borderRadius: "4px",
						}}
					>
						<h4>{post.title}</h4>
						<p>{post.content}</p>
						<button
							style={{ marginRight: "5px" }}
							onClick={() => handlePostApproval(post._id, "approved")}
						>
							Approve
						</button>
						<button onClick={() => handlePostApproval(post._id, "rejected")}>
							Reject
						</button>
					</div>
				))}
			</section>

			{/* Pending Comments */}
			<section style={{ marginTop: "20px" }}>
				<h3>Pending Comments</h3>
				{pendingComments.length === 0 && <p>No pending comments.</p>}
				{pendingComments.map((comment) => (
					<div
						key={comment._id}
						style={{
							border: "1px solid #000",
							margin: "10px 0",
							padding: "10px",
							borderRadius: "4px",
						}}
					>
						<p>
							<strong>Post:</strong> {comment.post?.title}
						</p>
						<p>
							<strong>Comment:</strong> {comment.content}
						</p>
						<button
							style={{ marginRight: "5px" }}
							onClick={() => handleCommentApproval(comment._id, "approved")}
						>
							Approve
						</button>
						<button
							onClick={() => handleCommentApproval(comment._id, "rejected")}
						>
							Reject
						</button>
					</div>
				))}
			</section>
		</div>
	);
};

export default AdminDashboardPage;
