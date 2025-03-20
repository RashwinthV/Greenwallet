// Import Models
const User = require("../Models/userModel");
const Record = require("../Models/recordsModel");
const Product = require("../Models/productsModel");

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
