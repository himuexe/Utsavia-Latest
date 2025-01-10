const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();




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


mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.error("Connected to Database:", err);
  });




app.listen(PORT, () => {
    console.log(`Server running on Port:${PORT}`);
  });
  