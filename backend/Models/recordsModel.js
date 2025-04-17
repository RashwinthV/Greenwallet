const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
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
          default: 0,
        },
        type: {
          type: String,
          enum: ["expense", "income"],
          required: true,
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        Expense: {
          type: String,
        },
        rate: {
          type: Number,
          required: true,
          min: [0, "Rate must be positive"],
          default: 0,
        },
        kgs: {
          type: Number,
          required: true,
          min: [0, "Quantity must be positive"],
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

const Record = mongoose.model("records", recordSchema);
module.exports = Record;
