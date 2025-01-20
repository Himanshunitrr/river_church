// client/src/pages/PostDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../services/postService";
import { fetchCommentsByPost, createComment } from "../services/commentService";
import "./PostDetailPage.css"; 
const PostDetailPage = () => {
	// Get the :postId from the URL
	const { postId } = useParams();

	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [commentContent, setCommentContent] = useState("");
	const [errorMsg, setErrorMsg] = useState("");

	// Token for authenticated requests (if needed)
	const token = localStorage.getItem("token");

	// 1. Fetch the post details
	const loadPost = async () => {
		try {
			const postData = await getPostById(postId);
			setPost(postData);
		} catch (error) {
			console.error(error);
			setErrorMsg("Failed to fetch the post details.");
		}
	};

	// 2. Fetch the approved comments for this post
	const loadComments = async () => {
		try {
			const commentData = await fetchCommentsByPost(postId);
			setComments(commentData);
		} catch (error) {
			console.error(error);
			setErrorMsg("Failed to fetch comments.");
		}
	};

	// 3. Create a new comment (requires user token if your app enforces auth)
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (!token) {
				setErrorMsg("You must be logged in to comment.");
				return;
			}

			// Send comment to API
			await createComment(postId, commentContent, token);
			setCommentContent(""); // clear text field
			// reload comments so user can see their pending comment or see a success message
			loadComments();
		} catch (error) {
			console.error(error);
			setErrorMsg("Failed to create a comment.");
		}
	};

	// 4. When component mounts, load post & comments
	useEffect(() => {
		loadPost();
		loadComments();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postId]);

	if (!post) {
		return <div>Loading post details...</div>;
	}

	return (
		<div>
			<h2>{post.title}</h2>
			<p>{post.content}</p>
			<p>Author: {post.user?.name}</p>
			<hr />

			<h3>Comments</h3>
			{comments.length === 0 && <p>No approved comments yet.</p>}
			{comments.map((comment) => (
				<div
					key={comment._id}
					style={{ border: "1px solid #000", margin: "8px 0", padding: "8px" }}
				>
					<p>
						<strong>{comment.user?.name}</strong>:
					</p>
					<p>{comment.content}</p>
				</div>
			))}

			<hr />
			<h3>Leave a Comment</h3>
			{errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
			<form onSubmit={handleSubmit}>
				<textarea
					value={commentContent}
					onChange={(e) => setCommentContent(e.target.value)}
					rows={3}
					placeholder="Write your comment here..."
					required
				/>
				<br />
				<button type="submit">Submit Comment</button>
			</form>
		</div>
	);
};

export default PostDetailPage;
