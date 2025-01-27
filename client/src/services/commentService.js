// client/src/services/commentService.js
import axios from "axios";

const API_URL = "/api/comments";

export const fetchCommentsByPost = async (postId) => {
	const res = await axios.get(`${API_URL}/${postId}`);
	return res.data;
};

export const createComment = async (postId, content, token) => {
	const res = await axios.post(
		`${API_URL}/${postId}`,
		{ content },
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);
	return res.data;
};

export const fetchPendingComments = async (token) => {
	const res = await axios.get(API_URL, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};

export const approveOrRejectComment = async (commentId, status, token) => {
	const res = await axios.put(
		`${API_URL}/${commentId}`,
		{ status },
		{
			headers: { Authorization: `Bearer ${token}` },
		}
	);
	return res.data;
};

export const deleteComment = async (commentId, token) => {
	const res = await axios.delete(`${API_URL}/${commentId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};
