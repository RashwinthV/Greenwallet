const Record = require("../Models/recordsModel");

exports.RateAnalysis = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await Record.findOne({ userId: id })
      .populate('records.productId', 'category') 
      .lean();

    if (!record) {
      return res.status(404).json({ message: "No records found" });
    }

    const rateData = record.records
      .filter(r => r.productId && r.productId.category === "consumable")
      .map(r => ({
        rate: r.rate,
        date: r.date,
      }));

    res.status(200).json(rateData);
  } catch (error) {
    console.error("Error fetching rate data:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.getRecordsWithProducts = async (req, res) => {
    try {
      const { id } = req.params;
  
      const userRecords = await Record.findOne({ userId: id })
        .populate("records.productId")
        .lean();
  
      if (!userRecords || !userRecords.records.length) {
        return res.status(404).json({ message: "No records found" });
      }
  
      let totalKg = 0;
      let totalQuantity = 0;
      let totalPrice = 0;
  
      const filteredRecords = userRecords.records.map(record => {
        const product = record.productId;
  
        if (!product) return null;
  
        const isConsumable = product.category === 'consumable';
  
        const kg = isConsumable ? record.kgs || 0 : 0;
        const quantity = !isConsumable ? record.kgs || 0 : 0;
        const rate = record.rate || 0;
        const price = isConsumable ? rate * kg : rate * quantity;
  
        // Update totals
        totalKg += kg;
        totalQuantity += quantity;
        totalPrice += price;
  
        return {
          productName: product.name,
          category: product.category,
          kg,
          quantity,
          rate,
          price
        };
      }).filter(Boolean); // Remove nulls
  
      res.status(200).json(
         filteredRecords,
      );
  
    } catch (error) {
      console.error("Error fetching user records:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  
