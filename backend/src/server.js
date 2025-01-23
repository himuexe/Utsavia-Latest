const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();
require("./config/passport");

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(passport.initialize());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Something went wrong!" });
});

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log("Connected to Database");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};

connectDB();

// Health Check Route
app.get("/api/health", async (req, res) => {
  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();
    res.status(200).json({
      status: "healthy",
      message: "Server and database are running smoothly.",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "unhealthy",
      message: "Server or database is not functioning properly.",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Routes
const userRouter = require("./routes/userRoute");
const authRouter = require("./routes/authRoute");
const categoryRouter = require("./routes/categoryRoute");
const bookingRouter = require("./routes/bookingRoute");
const paymentRouter = require("./routes/paymentRoute");
const cartRoutes = require('./routes/cartRoute');

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/booking", bookingRouter);
app.use('/api/cart', cartRoutes);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`);
});

// Graceful shutdown
const shutdown = () => {
  server.close(() => {
    console.log("Server closed");
    mongoose.connection.close(() => {
      console.log("Database connection closed");
      process.exit(0);
    });
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);