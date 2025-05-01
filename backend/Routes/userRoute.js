const express = require("express");
const { register } = require("../Controller/userController");
const { getProducts, addRecord } = require("../Controller/productConroller");
const authMiddleware = require("../middleware/Authorize");
const { getRecords, editrecords, Deleterecord } = require("../Controller/historyController");
const { Validity } = require("../middleware/Verify");
const { RateAnalysis, getRecordsWithProducts } = require("../Controller/AnalysisController");
const { SendVerifyemail, Verifyemail } = require("../Controller/Email/VerifyEmail");

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
userRoute.post("/send-verification-email/:id",authMiddleware,SendVerifyemail)
userRoute.post('/verify-email/:id',authMiddleware,Verifyemail)
 


module.exports = userRoute;
