const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    type: {
      type: String,
      enum: ["request", "report", "ideas", "message"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    productName: String,
    productType: String,
    productCategory: String,

    requestStatus: {
      type: String,
      enum: ["processing", "updated", "rejected", "under-consideration", "accepted"],
      default: "processing",
    },
    productAdded: {
      type: Boolean,
      default: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '30d', 
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
