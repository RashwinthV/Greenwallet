const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.Validity=(req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);      
      res.json({ user: decoded }); 
    } catch (err) {
      console.error("Invalid token", err);
      res.status(401).json({ error: "Invalid token" });
    }
  }