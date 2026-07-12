const dotenv = require("dotenv");
dotenv.config();


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

// Routes
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");

// Error Middleware
const { errorHandler } = require("./middleware/errorMiddleware");



const app = express();

/* =========================
Security Middleware
========================= */
app.use(helmet());

/* =========================
General Middleware
========================= */
app.use(express.json());
app.use(cors());

/* =========================
MongoDB Connection
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed ❌", error);
    process.exit(1);
  });

/* =========================
Base Route
========================= */
app.get("/", (req, res) => {
  res.send("Bachelor Rental API Running 🚀");
});

/* =========================
API Routes
========================= */
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);

/* =========================
404 Handler
========================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/* =========================
Global Error Handler
========================= */
app.use(errorHandler);

/* =========================
Start Server
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
