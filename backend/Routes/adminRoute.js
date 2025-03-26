const express = require("express");
const { Dashboard, GetProduct, Deleteproduct, Addproduct, getAProduct, UpdateAProduct } = require("../Controller/adminController");
const { Record, Deleterecord, UpdateRecord } = require("../Controller/historyController");
const { Alluser } = require("../Controller/userController");
const router=express.Router()

router.get("/dashboard-stats",Dashboard)
router.get("/getproducts",GetProduct)
router.get("/products/:id",getAProduct)
router.put("/products/:id",UpdateAProduct)
router.post('/products',Addproduct)
router.delete('/products/:id',Deleteproduct)
router.delete('/deleterecord/:id/:recordid',Deleterecord)
router.post('/updaterecord/:id/:recordId',UpdateRecord)
router.get('/records/:id',Record)
router.get("/users",Alluser)
module.exports=router;