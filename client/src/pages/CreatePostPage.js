// client/src/pages/CreatePostPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/postService";
import "./Form.css";
// We'll define createPost below

const CreatePostPage = () => {
	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [errorMsg, setErrorMsg] = useState("");

	const token = localStorage.getItem("token"); // user must be logged in

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!token) {
			setErrorMsg("You must be logged in to create a post.");
			return;
		}

		try {
			await createPost({ title, content }, token);
			// If successful, redirect user, for example, to the home page
			navigate("/");
		} catch (error) {
			console.error(error);
			setErrorMsg(error.response?.data?.msg || "Error creating post");
		}
	};

	return (
		<div>
			<h2>Create a New Post</h2>
			{errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
			<form onSubmit={handleSubmit}>
				<div>
					<label>Title:</label>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Content:</label>
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						rows={6}
						required
					/>
				</div>
				<button type="submit">Submit Post</button>
			</form>
		</div>
	);
};

export default CreatePostPage;
