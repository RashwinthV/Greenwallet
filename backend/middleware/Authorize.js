const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Access Denied: No Token Provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = req.params; 
    
    if (String(id) !== String(decoded.id)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: User ID does not match token.",
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token has expired." });
    } else if (err.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Token." });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error." });
    }
  }
};

module.exports = authMiddleware;
