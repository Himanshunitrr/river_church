// client/src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PostDetailPage from "./pages/PostDetailPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import Header from "./components/Header";
import CreatePostPage from "./pages/CreatePostPage";

import "./styles/styles.css";
import "./App.css";
function App() {
	return (
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />
				<Route path="/post/:postId" element={<PostDetailPage />} />
				<Route path="/create-post" element={<CreatePostPage />} />
				<Route path="/admin" element={<AdminDashboardPage />} />
			</Routes>
		</Router>
	);
}

export default App;
