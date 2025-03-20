const Product = require("../Models/productsModel");
const Record = require("../Models/recordsModel");

exports.getProducts = async (req, res) => {
  try {
    const { id, category } = req.params;

    if (!id) {
      console.error("🚨 Missing userId in request!");
      return res.status(400).json({ error: "User ID is required" });
    }

    let filter = {};
    if (category) {
      filter = category;
    }
    const products = await Product.find({ category: filter });

    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ error: "Error fetching products" });
  }
};

exports.addRecord = async (req, res) => {
  const { id } = req.params;

  const { date, amount, type, productId, rate, kgs } = req.body;

  try {
    const user = await Record.findOne({ userId: id });

    let Rate = rate || 0;

    let Kgs = kgs || 0;

    if (!user) {
      const newRecord = new Record({
        userId: id,
        records: [
          {
            date,
            amount,
            type,
            productId,
            rate: Rate,
            kgs: Kgs,
          },
        ],
      });

      await newRecord.save();
      return res.status(201).json({
        success: true,
        message: "New user created and record added successfully!",
        record: newRecord,
      });
    } else {
      const userRecord = await Record.findOne({ userId: id });
      const newRecord = {
        date,
        amount,
        type,
        productId,
        rate: Rate,
        kgs: Kgs,
      };

      // Append the new record to the user's 'records' array
      userRecord.records.push(newRecord);

      // Save the updated record
      await userRecord.save();

      return res.status(200).json({
        success: true,
        message: "Record added successfully!",
        record: newRecord,
      });
    }
  } catch (error) {
    console.error("❌ Error creating record:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create record." });
  }
};
