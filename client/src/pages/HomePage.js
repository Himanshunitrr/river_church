import React, { useEffect, useState } from "react";
import { fetchApprovedPosts, deletePost } from "../services/postService";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
	const [posts, setPosts] = useState([]);
	const [popUpMessage, setPopUpMessage] = useState("");

	const token = localStorage.getItem("token");
	const userRole = localStorage.getItem("role");

	useEffect(() => {
		loadPosts();
	}, []);

	const loadPosts = async () => {
		try {
			const data = await fetchApprovedPosts();
			setPosts(data);
		} catch (error) {
			console.error(error);
		}
	};

	const handlePostDeletion = async (postId) => {
		try {
			await deletePost(postId, token);
			setPosts((prevPosts) => prevPosts.filter((p) => p._id !== postId));
			setPopUpMessage("Post has been deleted.");
			setTimeout(() => {
				setPopUpMessage("");
			}, 3000);
		} catch (error) {
			console.error(error);
			setPopUpMessage("Failed to delete post.");
		}
	};

	return (
		<div style={{ maxWidth: "600px", margin: "20px auto" }}>
			<h2>Approved Posts</h2>
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
			{posts.map((post) => (
				<div
					key={post._id}
					style={{
						border: "1px solid #000",
						margin: "10px 0",
						padding: "10px",
						position: "relative",
					}}
				>
					<h3>
						<Link to={`/post/${post._id}`}>{post.title}</Link>
					</h3>
					<p>by {post.user?.name}</p>
					{userRole === "admin" && (
						<button
							style={{ position: "absolute", top: "10px", right: "10px" }}
							onClick={() => handlePostDeletion(post._id)}
						>
							Delete
						</button>
					)}
				</div>
			))}
		</div>
	);
};

export default HomePage;
