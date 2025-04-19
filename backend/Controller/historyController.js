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
    }).populate("records.productId");

    if (!userRecords || userRecords.records.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No records found for this user." });
    }

    const formattedRecords = await Promise.all(
      userRecords.    
      records.map(async (record) => {
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
          productName: productDetails?.name || record?.Expense,
          productCategory: productDetails?.category || "Work",
        };
      })
    );

    res.json({ success: true, records: formattedRecords });
    
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions" });
  }
};

exports.Record = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // ✅ Fetch user records with correct filter
    const userRecords = await Record.findOne({ userId: id }) // 🔥 Fixed here
      .populate("records.productId", "name category") // ✅ Get product name & category
      .lean();


    if (!userRecords) {
      return res.json({ records: [], totalPages: 1 });
    }

    const totalRecords = userRecords.records.length;
    const paginatedRecords = userRecords.records.slice(skip, skip + limit);

    return res.json({
      records: paginatedRecords,
      totalPages: Math.ceil(totalRecords / limit),
    });
  } catch (err) {
    console.error("Error fetching records:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.UpdateRecord = async (req, res) => {
try {
    const { id, recordId } = req.params;
    const updatedData = req.body; 
    
    const updatedRecord = await Record.findOneAndUpdate(
      { userId:id, "records._id": recordId }, 
      {
        $set: {
          "records.$.date": updatedData.date,
          "records.$.amount": updatedData.amount,
          "records.$.type": updatedData.type,
          "records.$.productId": updatedData.productId,
          "records.$.rate": updatedData.rate,
          "records.$.kgs": updatedData.kgs,
        },
      },
      { new: true } 
    ).populate("records.productId");

    if (!updatedRecord) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json({ message: "Record updated", records: updatedRecord.records });
  } catch (err) {
    console.error("Error updating record:", err);
    res.status(500).json({ error: "Server error while updating record" });
  }
};

exports.Deleterecord = async (req, res) => {
  try {
    const { id, recordId } = req.params;
    console.log("Deleting record:", req.params);

    // ✅ Find the user record
    const userRecord = await Record.findOne({ userId: id });

    if (!userRecord) {
      return res.status(404).json({ error: "User record not found" });
    }

    // ✅ Remove the specific record from the `records` array
    const updatedRecord = await Record.findOneAndUpdate(
      { userId: id },
      { $pull: { records: { _id: recordId } } }, // ✅ Removes matching record
      { new: true }
    ).populate("records.productId");

    if (!updatedRecord) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json({ message: "Record deleted", records: updatedRecord.records });
  } catch (err) {
    console.error("Error deleting record:", err);
    res.status(500).json({ error: "Server error while deleting record" });
  }
};

exports.editrecords = async (req, res) => {
  const { id, recordId } = req.params; // id = userId
  const updatedRecord = req.body;

  try {
    const result = await Record.findOneAndUpdate(
      { userId: id, "records._id": recordId },
      {
        $set: {
          "records.$": updatedRecord,
        },
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.status(200).json({
      message: "Record updated successfully",
      updated: result,
    });
  } catch (err) {
    console.error("Error updating record:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};