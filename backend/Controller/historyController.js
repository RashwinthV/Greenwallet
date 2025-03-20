const mongoose = require("mongoose");
const Record = require("../Models/recordsModel");
const Product = require("../Models/productsModel");

exports.getRecords = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID format" });
    }

    const userRecords = await Record.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    }).populate("records.productId", "name type category price");

    if (!userRecords || userRecords.records.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No records found for this user." });
    }

    const formattedRecords = await Promise.all(
      userRecords.records.map(async (record) => {
        let productDetails = record.productId;

        if (!productDetails || !productDetails.name) {
          productDetails = await Product.findById(record.productId).select(
            "name type category price"
          );
        }

        return {
          _id: record._id,
          date: record.date,
          rate: record.rate,
          kgs: record.kgs,
          amount: record.amount,
          type: record.type,
          productId: productDetails?._id || null,
          productName: productDetails?.name || "Unknown",
          productCategory: productDetails?.category || "Unknown",
        };
      })
    );

    res.json({ success: true, records: formattedRecords });
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
};
