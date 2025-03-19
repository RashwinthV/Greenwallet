const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    category: { type: String, required: true,enum:["consumable","fertlizer","pesticide"] },
    type: {
      type: String,
      required: [true, "Product type is required"],
      enum: ["vegetable", "Fruit", "Coconut"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be positive"],
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const product = mongoose.model("product", productSchema,"product");

module.exports = product;
