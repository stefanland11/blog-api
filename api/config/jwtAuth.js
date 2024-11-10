const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY; 

function jwtAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Expected format: "Bearer <token>"
  
  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload; // Add payload to req object for access in the route
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = jwtAuth;