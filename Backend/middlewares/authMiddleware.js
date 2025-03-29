const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get token from cookie instead of header
  const token = req.cookies.jwt; // Assuming your token is stored in a cookie named 'jwt'

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // Clear the expired token cookie
      res.clearCookie('jwt');
      return res.status(401).json({ msg: "Token expired, please log in again" });
    }
    // Clear the invalid token cookie
    res.clearCookie('jwt');
    return res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = authMiddleware;
