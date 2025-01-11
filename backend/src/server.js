const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
require("dotenv").config();
require("./config/passport");




const app = express();
const PORT = process.env.PORT || 9000;


app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );
app.use(passport.initialize());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});


mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.error("Connected to Database:", err);
  });

const userRouter = require("./routes/userRoute");
const authRouter = require("./routes/authRoute");


app.use("/api/user",userRouter);
app.use("/api/auth",authRouter);


app.listen(PORT, () => {
    console.log(`Server running on Port:${PORT}`);
  });
  