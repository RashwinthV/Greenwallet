// Import Models
const User = require("../Models/userModel");
const Record = require("../Models/recordsModel");
const Product = require("../Models/productsModel");
const product = require("../Models/productsModel");

exports.Dashboard = async (req, res) => {
  try {
    // 🧮 Count Users, Records, Entries
    const usersCount = await User.countDocuments();
    const recordsCount = await Record.countDocuments();

    // Count total entries across all records
    const entriesCount = await Record.aggregate([
      { $unwind: "$records" },
      { $count: "totalEntries" },
    ]);

    const totalEntries =
      entriesCount.length > 0 ? entriesCount[0].totalEntries : 0;

    // 🛒 Count Products by Category
    const productsByCategory = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // Format category counts
    const productCategories = {};
    productsByCategory.forEach((item) => {
      productCategories[item._id] = item.count;
    });

    res.json({
      usersCount,
      recordsCount,
      entriesCount: totalEntries,
      productCategories,
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.GetProduct=async (req, res) => {
  try {
    const products = await Product.find();
    const groupedProducts = products.reduce((acc, product) => {
      if (!acc[product.category]) acc[product.category] = [];
      acc[product.category].push(product);
      return acc;
    }, {});
    res.json(groupedProducts);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching products" });
  }
}

exports.Deleteproduct=async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
}


exports.Addproduct = async (req, res) => {
  try {
    const { name, category, type, image, price, description } = req.body;
    const rate = parseInt(price, 10);

    if (!name || !category || !type || !image || !price || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (isNaN(rate) || rate < 0) {
      return res.status(400).json({ message: "Invalid price. Must be a positive number." });
    }
    const newProduct = new product({ name, category, type, image, price: rate, description });
    await newProduct.save();

    res.status(201).json({ message: "Product added successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error adding product", error: err.message });
  }
};