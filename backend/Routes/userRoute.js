const express=require('express')
const { register } = require('../Controller/userController')
const { getproducts, addRecord } = require('../Controller/productConroller')
const authMiddleware = require('../middleware/Authorize')
const userroute=express.Router()


userroute.post('/register',register)
userroute.get('/products/:id',authMiddleware,getproducts)
userroute.post('/records/:id',authMiddleware,addRecord)


module.exports=userroute