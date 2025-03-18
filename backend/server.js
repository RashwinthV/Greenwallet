const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const connectDB = require("./Database/db");
const userroute = require("./Routes/userRoute");
const { Login } = require('./Controller/loginController');

app.use(express.json());
app.use(cors());
connectDB();

app.use('/user',userroute)
app.post('/login',Login)

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Serveris running on port ${port}`);
});
