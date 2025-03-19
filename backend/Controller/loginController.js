const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password.trim()!==password.trim()) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT Secret is not defined" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, 
      sameSite: "None",
    });

    return res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

exports.cokieesave=async (req,res)=>{
  const token = req.cookies.token;
  
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const users=await User.findById({_id:decoded.id})
    
    res.json({ user: users });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}