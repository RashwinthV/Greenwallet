const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    records: [
      {
        date: {
          type: Date,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        type: {
          type: String,
          enum: ["expense", "income"],
          required: true,
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        rate: {
          type: Number,
          required: true,
          min: [0, "Rate must be positive"],
        },
        kgs: {
          type: Number,
          required: true,
          min: [0, "Quantity must be positive"],
        },
      },
    ],
  },
  { timestamps: true }
);

const Record = mongoose.model("records", recordSchema);
module.exports = Record;
