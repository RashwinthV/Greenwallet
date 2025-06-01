const Notification = require("../Models/notificationModel");
const User = require("../Models/userModel");

//get all notifications
exports.allNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort(
      { createdAt: -1 }
    );
    const { id } = req.params;
    const isadmin = await User.findOne({ _id: id });

    const hasUnread = notifications.some((notif) => !notif.isRead);
    if (isadmin.role === "admin") {
      const notifications = await Notification.find();
          const adminread = notifications.some((notif) => !notif.AdminisRead);

      return res.json({
        success: hasUnread,
        adminread,
        notifications,
      });
    }
    res.json({
      success: hasUnread,
      adminread,
      notifications,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

//update red messsagge
exports.markAsRead = async (req, res) => {
  const { notificationid } = req.params;
  try {
    const updated = await Notification.findByIdAndUpdate(
      { _id: notificationid },
      { isRead: true },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
};

//product request
exports.Productrequest = async (req, res) => {
  try {
    const { productName, productType, category, type } = req.body;
    const { id } = req.params;

    if (!productName || !productType || !category || !id || !type) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newRequest = {
      userId: id,
      type,
      message: `A new product request has been submitted for ${productName}.`,
      productName,
      productType,
      productCategory: category,
      requestStatus: "processing",
      productAdded: false,
      isRead: false,
    };

    const updateNotification = await Notification.create(newRequest);

    res.status(200).json({
      message: "Product request submitted successfully.",
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to post your request. Please try again." });
  }
};

exports.RejectRequest = async (req, res) => {
  const { id, notificationid } = req.params;

  try {
    const notification = await Notification.findById(notificationid);

    if (!notification) return res.status(404).send("Not found");

    notification.requestStatus = "rejected";
    notification.isRead = true;
    notification. message="Your product request has been rejected",
    await notification.save();

    res.send({ message: "Rejected", notification });
  } catch (err) {
    res.status(500).send("Server error");
  }
};
