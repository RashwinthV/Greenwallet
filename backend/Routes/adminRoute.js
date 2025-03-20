const express = require("express");
const { Dashboard } = require("../Controller/adminController");
const router=express.Router()

router.get("/dashboard-stats",Dashboard)
module.exports=router;