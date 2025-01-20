// server/controllers/authController.js
const User = require("../models/user");
const { generateToken } = require("../config/auth");
require("dotenv").config();

exports.signup = async (req, res) => {
	try {
		const { name, email, password, adminToken } = req.body;

		// Check if the user provided the correct universal admin token
		let role = "user";
		if (adminToken && adminToken === process.env.ADMIN_SIGNUP_TOKEN) {
			role = "admin";
		}

		// Check if email is already used
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ msg: "Email already exists" });
		}

		// Create new user with the determined role
		const newUser = new User({
			name,
			email,
			password,
			role,
		});
		await newUser.save();

		return res
			.status(201)
			.json({ msg: `User created successfully as ${role}` });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(401).json({ msg: "Invalid credentials" });
		}

		const token = generateToken(user);
		return res.status(200).json({
			msg: "Login successful",
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};
