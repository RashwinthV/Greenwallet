const express = require("express");
const { register } = require("../Controller/userController");
const { getProducts, addRecord } = require("../Controller/productConroller");
const authMiddleware = require("../middleware/Authorize");
const { getRecords } = require("../Controller/historyController");

const userRoute = express.Router();

userRoute.post("/register", register);
userRoute.get("/products/:id/:category",authMiddleware, getProducts);
userRoute.post("/record/:id", authMiddleware, addRecord);
userRoute.get("/records/:id",authMiddleware, getRecords); 

module.exports = userRoute;
