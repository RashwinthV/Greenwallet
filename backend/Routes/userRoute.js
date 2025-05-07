const express = require("express");
const { register } = require("../Controller/userController");
const { getProducts, addRecord } = require("../Controller/productConroller");
const authMiddleware = require("../middleware/Authorize");
const { getRecords, editrecords, Deleterecord } = require("../Controller/historyController");
const { Validity } = require("../middleware/Verify");
const { RateAnalysis, getRecordsWithProducts } = require("../Controller/AnalysisController");
const { SendVerifyemail, Verifyemail } = require("../Controller/Email/VerifyEmail");
const sendPasswordEmail = require("../Controller/Email/Password");

const userRoute = express.Router();

userRoute.post("/register", register);
userRoute.get("/products/:id/:category",authMiddleware, getProducts);
userRoute.post("/record/:id", authMiddleware, addRecord);
userRoute.get("/records/:id",authMiddleware, getRecords); 

userRoute.put("/edit-record/:id/:recordId",authMiddleware,editrecords)
userRoute.delete("/delete-record/:id/:recordId",authMiddleware,Deleterecord)

//auth route
userRoute.get("/verify-token",Validity)

//analysis route
userRoute.get('/rates/:id',authMiddleware,RateAnalysis)
userRoute.get('/product/:id',authMiddleware,getRecordsWithProducts)

//email route
userRoute.post("/mail/send-verification-email/:id",authMiddleware,SendVerifyemail)
userRoute.post('/mail/verify-email/:id',authMiddleware,Verifyemail)
userRoute.post('/mail/reset-password',sendPasswordEmail)
 


module.exports = userRoute;
