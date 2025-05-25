const Notification = require("../Models/notificationModel");

//get all notifications
exports.allNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });

    const hasUnread = notifications.some((notif) => !notif.isRead);

    res.json({
      success: hasUnread,
      notifications,
    });
  } catch (err) {
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
