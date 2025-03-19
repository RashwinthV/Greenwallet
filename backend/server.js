const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const connectDB = require("./Database/db");
const userroute = require("./Routes/userRoute");
const { Login, cokieesave } = require('./Controller/loginController');
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
connectDB();
const corsOptions = {
  origin: ["http://localhost:5173", "https://greenwallet-frontend.onrender.com"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use('/user',userroute)
app.post('/login',Login)
app.get('/me',cokieesave)
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.json({ message: "Logged out successfully" });
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Serveris running on port ${port}`);
});
