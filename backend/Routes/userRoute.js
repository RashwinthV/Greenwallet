const express = require("express");
const { register } = require("../Controller/userController");
const { getProducts, addRecord, allproducts } = require("../Controller/productConroller");
const authMiddleware = require("../middleware/Authorize");
const {
  getRecords,
  editrecords,
  Deleterecord,
} = require("../Controller/historyController");
const { Validity } = require("../middleware/Verify");
const {
  RateAnalysis,
  getRecordsWithProducts,
} = require("../Controller/AnalysisController");
const {
  SendVerifyemail,
  Verifyemail,
} = require("../Controller/Email/VerifyEmail");
const { password } = require("../Controller/loginController");
const {
  sendPasswordEmail,
  PasswordUpdateInfo,
} = require("../Controller/Email/Password");
const { allNotifications, markAsRead, Productrequest, RejectRequest } = require("../Controller/notification");

const userRoute = express.Router();

userRoute.post("/register", register);
userRoute.get("/products/:id/:category", authMiddleware, getProducts);
userRoute.post("/record/:id", authMiddleware, addRecord);
userRoute.get("/records/:id", authMiddleware, getRecords);
userRoute.get('/products',allproducts)

userRoute.put("/edit-record/:id/:recordId", authMiddleware, editrecords);
userRoute.delete("/delete-record/:id/:recordId", authMiddleware, Deleterecord);

//auth route
userRoute.get("/verify-token", Validity);

//analysis route
userRoute.get("/rates/:id", authMiddleware, RateAnalysis);
userRoute.get("/product/:id", authMiddleware, getRecordsWithProducts);

//email route
userRoute.post(
  "/mail/send-verification-email/:id",
  authMiddleware,
  SendVerifyemail
);
userRoute.post("/mail/verify-email/:id", authMiddleware, Verifyemail);
userRoute.post("/mail/reset-password", sendPasswordEmail);
userRoute.post(
  "/mail/passwordupdate-info/:id",
  authMiddleware,
  PasswordUpdateInfo
);

//get password
userRoute.post("/verify-password/:id", authMiddleware, password);
userRoute.put("/password/:id", authMiddleware, password);



//notification route
userRoute.get('/notifications/:id',authMiddleware,allNotifications)
userRoute.put('/:id/notifications/mark-read/:notificationid',authMiddleware,markAsRead)
userRoute.put('/:id/notifications/reject/:notificationid',authMiddleware,RejectRequest)


//request Route
userRoute.post('/products-request/:id',authMiddleware,Productrequest)


module.exports = userRoute;
