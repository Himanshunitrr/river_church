import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById, deletePost } from "../services/postService";
import {
	fetchCommentsByPost,
	createComment,
	deleteComment,
} from "../services/commentService";
import "./PostDetailPage.css";

const PostDetailPage = () => {
	const { postId } = useParams();
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [commentContent, setCommentContent] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [popUpMessage, setPopUpMessage] = useState("");

	const token = localStorage.getItem("token");
	const userRole = localStorage.getItem("role");

	const loadPost = async () => {
		try {
			const postData = await getPostById(postId);
			setPost(postData);
		} catch (error) {
			console.error(error);
			setErrorMsg("Failed to fetch the post details.");
		}
	};

	const loadComments = async () => {
		try {
			const commentData = await fetchCommentsByPost(postId);
			setComments(commentData);
		} catch (error) {
			console.error(error);
			setErrorMsg("Failed to fetch comments.");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (!token) {
				setErrorMsg("You must be logged in to comment.");
				return;
			}

			await createComment(postId, commentContent, token);
			setCommentContent("");
			loadComments();
		} catch (error) {
			console.error(error);
			setErrorMsg("Failed to create a comment.");
		}
	};

	const handlePostDeletion = async () => {
		try {
			await deletePost(postId, token);
			setPopUpMessage("Post has been deleted.");
			setTimeout(() => {
				setPopUpMessage("");
				window.location.href = "/";
			}, 3000);
		} catch (error) {
			console.error(error);
			setPopUpMessage("Failed to delete post.");
		}
	};

	const handleCommentDeletion = async (commentId) => {
		try {
			await deleteComment(commentId, token);
			setComments((prevComments) =>
				prevComments.filter((c) => c._id !== commentId)
			);
			setPopUpMessage("Comment has been deleted.");
			setTimeout(() => {
				setPopUpMessage("");
			}, 3000);
		} catch (error) {
			console.error(error);
			setPopUpMessage("Failed to delete comment.");
		}
	};

	useEffect(() => {
		loadPost();
		loadComments();
	}, [loadPost, loadComments]);

	if (!post) {
		return <div>Loading post details...</div>;
	}

	return (
		<div>
			<h2>{post.title}</h2>
			<p>{post.content}</p>
			<p>Author: {post.user?.name}</p>
			{userRole === "admin" && (
				<button onClick={handlePostDeletion}>Delete Post</button>
			)}
			<hr />

			<h3>Comments</h3>
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
			{comments.length === 0 && <p>No approved comments yet.</p>}
			{comments.map((comment) => (
				<div
					key={comment._id}
					style={{
						border: "1px solid #000",
						margin: "8px 0",
						padding: "8px",
						position: "relative",
					}}
				>
					<p>
						<strong>{comment.user?.name}</strong>:
					</p>
					<p>{comment.content}</p>
					{userRole === "admin" && (
						<button
							style={{ position: "absolute", top: "10px", right: "10px" }}
							onClick={() => handleCommentDeletion(comment._id)}
						>
							Delete
						</button>
					)}
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
