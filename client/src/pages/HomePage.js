// client/src/pages/HomePage.js
import React, { useEffect, useState } from "react";
import { fetchApprovedPosts } from "../services/postService";
import { Link } from "react-router-dom";
import "./HomePage.css";
const HomePage = () => {
	const [posts, setPosts] = useState([]);

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

	return (
		<div style={{ maxWidth: "600px", margin: "20px auto" }}>
			<h2>Approved Posts</h2>
			{posts.map((post) => (
				<div
					key={post._id}
					style={{
						border: "1px solid #000",
						margin: "10px 0",
						padding: "10px",
					}}
				>
					<h3>
						<Link to={`/post/${post._id}`}>{post.title}</Link>
					</h3>
					<p>by {post.user?.name}</p>
				</div>
			))}
		</div>
	);
};

export default HomePage;
