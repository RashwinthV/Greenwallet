const express = require("express");
const { register } = require("../Controller/userController");
const { getProducts, addRecord } = require("../Controller/productConroller");
const authMiddleware = require("../middleware/Authorize");
const { getRecords, editrecords, Deleterecord } = require("../Controller/historyController");
const { Validity } = require("../middleware/Verify");

const userRoute = express.Router();

userRoute.post("/register", register);
userRoute.get("/products/:id/:category",authMiddleware, getProducts);
userRoute.post("/record/:id", authMiddleware, addRecord);
userRoute.get("/records/:id",authMiddleware, getRecords); 

userRoute.put("/edit-record/:id/:recordId",authMiddleware,editrecords)
userRoute.delete("/delete-record/:id/:recordId",authMiddleware,Deleterecord)

//auth route
userRoute.get("/verify-token",Validity)


module.exports = userRoute;
