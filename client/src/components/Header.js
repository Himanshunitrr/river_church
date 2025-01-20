import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
	const token = localStorage.getItem("token");
	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("role"); // Clear the user's role
		window.location.href = "/";
	};

	return (
		<nav>
			<Link to="/">Home</Link>
			{token ? (
				<>
					<Link to="/create-post">Create Post</Link>
					<Link to="/admin">Admin Dashboard</Link>
					{/* Or conditionally show if user is admin */}
					<button onClick={handleLogout}>Logout</button>
				</>
			) : (
				<>
					<Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
				</>
			)}
		</nav>
	);
};

export default Header;
