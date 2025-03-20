const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./Database/db");
const userRoute = require("./Routes/userRoute");
const { Login, cokieesave } = require("./Controller/loginController");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

connectDB();


app.use(cors());

app.use("/user", userRoute);
app.post("/login", Login);
app.get("/me", cokieesave);

// app.post("/logout", (req, res) => {
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: true,
//     sameSite: "None",
//   });
//   res.json({ message: "Logged out successfully" });
// });

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
