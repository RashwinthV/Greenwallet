const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./Database/db");
const userRoute = require("./Routes/userRoute");
const adminroute=require('./Routes/adminRoute')
const { Login, cokieesave } = require("./Controller/loginController");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

connectDB();

const corsOptions = {
<<<<<<< HEAD
  origin: ["http://localhost:5173", "https://greenwallet-frontend.onrender.com","http://localhost:5174"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use("/api",adminroute)
=======
  origin: ["http://localhost:5173", "https://greenwallet-frontend.onrender.com"],
  credentials: true,
};
app.use(cors(corsOptions));

>>>>>>> 87e2e767dbbc586ee1088452c033410b9e630ecf
app.use("/user", userRoute);
app.post("/login", Login);
app.get("/me", cokieesave);

<<<<<<< HEAD
 
=======

>>>>>>> 87e2e767dbbc586ee1088452c033410b9e630ecf
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
 