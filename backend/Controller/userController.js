const User = require("../Models/userModel");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { name, email, password, phoneNo, age, gender } = req.body;

    if (!name || !email || !password || !phoneNo || !age || !gender) {
      return res.status(400).json({ message: "All fields are required (name, email, password, phoneNo, age, gender)" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Already registered. Please go to login." });
    }

    if (!/^\d{10}$/.test(phoneNo)) {
      return res.status(400).json({ message: "Phone number must be 10 digits." });
    }

    if (age < 18) {
      return res.status(400).json({ message: "Age must be at least 18." });
    }

    if (!["male", "female", "other"].includes(gender.toLowerCase())) {
      return res.status(400).json({ message: "Invalid gender. Choose from 'male', 'female', or 'other'." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const pass = hashedPassword;
    const newUser = new User({ name, email, password:pass, phoneNo, age, gender });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};


exports.Alluser=async (req, res) => {
  try {
    const users = await User.find().select("name email");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
}