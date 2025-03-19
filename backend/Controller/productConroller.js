const product = require("../Models/productsModel");
const User = require("../Models/userModel");
const Record=require('../Models/recordsModel')

const mongoose = require("mongoose");

exports.getproducts = async (req, res) => {
  try {
  
    const products = await product.find({});

    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ error: "Error fetching products" });
  }
};


exports.addRecord=async(req,res)=>{
    const { date, amount, type, productId, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
  
    try {
      const newRecord = new Record({
        date,
        amount,
        type,
        productId,
        userId
      });
  
      await newRecord.save();
  
       return res.status(201).json({ success: true, message: "Record added successfully!", record: newRecord });
    } catch (error) {
      console.error("Error creating record:", error);
      return res.status(500).json({ success: false, message: "Failed to create record." });
    }
}