const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const mongodb_URI = process.env.MONGODB_URI;
    if (!mongodb_URI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    await mongoose.connect(mongodb_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

module.exports = connectDB;
