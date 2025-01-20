// server/middleware/authMiddleware.js
const { verifyToken } = require("../config/auth");

const authMiddleware = (roles = []) => {
	if (typeof roles === "string") {
		roles = [roles];
	}

	return (req, res, next) => {
		try {
			const token = req.headers.authorization?.split(" ")[1];
			if (!token) {
				return res.status(401).json({ msg: "No token provided" });
			}

			const decoded = verifyToken(token); // Decodes { userId, role }
			req.user = decoded;

			// If 'admin' is required and user.role != 'admin', block
			if (roles.length && !roles.includes(req.user.role)) {
				return res.status(403).json({ msg: "Forbidden" });
			}

			next();
		} catch (error) {
			return res.status(401).json({ msg: "Invalid token" });
		}
	};
};

module.exports = authMiddleware;
