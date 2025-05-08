const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");


exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT Secret is not defined" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
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

 
exports.password = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;
  

  try {
    const user = await User.findById(id).select("password");
    

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If only currentPassword is provided: just verify
    if (currentPassword && !newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      return res.json({ match: isMatch });
    }

    if (newPassword) {
      const isSame = await bcrypt.compare(newPassword, user.password);
      if (isSame) {
        return res.json({ same: true });
      }
          const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
    
      return res.json({ match: true, message: "Password updated successfully" });
    }
    

    return res.status(400).json({ message: "Invalid request" });
  } catch (error) {
    console.error("Password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};