const express = require("express");
const { Dashboard, GetProduct, Deleteproduct, Addproduct, getAProduct, UpdateAProduct, AdminmarkAsRead } = require("../Controller/adminController");
const { Record, Deleterecord, UpdateRecord } = require("../Controller/historyController");
const { Alluser } = require("../Controller/userController");
const authMiddleware = require("../middleware/Authorize");
const router=express.Router()

router.get("/dashboard-stats",Dashboard)
router.get("/getproducts",GetProduct)
router.get("/products/:id",authMiddleware,getAProduct)
router.put("/products/:id",authMiddleware,UpdateAProduct)
router.post('/products',Addproduct)
router.delete('/products/:id',authMiddleware,Deleteproduct)
router.delete('/deleterecord/:id/:recordid',authMiddleware,Deleterecord)
router.post('/updaterecord/:id/:recordId',authMiddleware,UpdateRecord)
router.get('/records/:id',authMiddleware,Record)
router.post('/:id/products/:notificationId',authMiddleware,Addproduct)
router.put('/:id/notifications/mark-read/:notificationid',authMiddleware,AdminmarkAsRead)

router.get("/users",Alluser)
module.exports=router;