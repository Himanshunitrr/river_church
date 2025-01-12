// client/src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const signup = async (userData) => {
	// userData includes { name, email, password, adminToken }
	const res = await axios.post(`${API_URL}/signup`, userData);
	return res.data;
};

export const login = async (userData) => {
	const res = await axios.post(`${API_URL}/login`, userData);
	return res.data;
};
