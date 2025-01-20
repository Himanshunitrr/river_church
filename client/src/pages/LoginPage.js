import React, { useState } from "react";
import { login } from "../services/authService";
import "./Form.css";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errMessage, setErrMessage] = useState("");

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const response = await login({ email, password });
			localStorage.setItem("token", response.token);
			localStorage.setItem("role", response.user.role); // Store the user's role
			// Could also store user info or navigate to another page
			window.location.href = "/";
		} catch (error) {
			setErrMessage(error.response?.data?.msg || "Login failed");
		}
	};

	return (
		<div>
			<h2>Login</h2>
			{errMessage && <p style={{ color: "red" }}>{errMessage}</p>}
			<form onSubmit={handleLogin}>
				<div>
					<label>Email:</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div>
					<label>Password:</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button>Login</button>
			</form>
		</div>
	);
};

export default LoginPage;
