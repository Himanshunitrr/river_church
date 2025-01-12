// client/src/services/postService.js
import axios from "axios";

const API_URL = "/api/posts";

export const fetchApprovedPosts = async () => {
	const res = await axios.get(API_URL);
	return res.data;
};

export const createPost = async (postData, token) => {
	const res = await axios.post(API_URL, postData, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};

export const fetchPendingPosts = async (token) => {
	const res = await axios.get(`${API_URL}/pending`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};

export const approveOrRejectPost = async (postId, status, token) => {
	const res = await axios.put(
		`${API_URL}/${postId}`,
		{ status },
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);
	return res.data;
};

export const getPostById = async (postId) => {
	const res = await axios.get(`${API_URL}/${postId}`);
	return res.data;
};
