// client/src/pages/SignupPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/authService";
import "./Form.css";
const SignupPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [adminToken, setAdminToken] = useState("");
	const [errMessage, setErrMessage] = useState("");

	const navigate = useNavigate();

	const handleSignup = async (e) => {
		e.preventDefault();
		try {
			await signup({ name, email, password, adminToken });
			// After successful signup, navigate to login (or home)
			navigate("/login");
		} catch (error) {
			const serverMsg = error.response?.data?.msg;
			if (serverMsg) {
				setErrMessage(serverMsg);
			} else {
				setErrMessage("Something went wrong during signup. Please try again.");
			}
		}
	};

	return (
		<div>
			<h2>Signup</h2>
			{errMessage && <p style={{ color: "red" }}>{errMessage}</p>}
			<form onSubmit={handleSignup}>
				<div>
					<label>Name:</label>
					<input
						type="text"
						placeholder="John Doe"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>

				<div>
					<label>Email:</label>
					<input
						type="email"
						placeholder="john@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>

				<div>
					<label>Password:</label>
					<input
						type="password"
						placeholder="Enter a strong password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>

				<div>
					<label>Admin Token (optional):</label>
					<input
						type="text"
						placeholder="Enter admin token if you have one"
						value={adminToken}
						onChange={(e) => setAdminToken(e.target.value)}
					/>
				</div>

				<button type="submit">Sign Up</button>
			</form>
		</div>
	);
};

export default SignupPage;
