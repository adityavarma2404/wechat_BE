require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const mongoose = require("mongoose");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);
app.use("/api", userRoutes);

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");

    app.listen(5000, () => console.log("Server connected on port 5000"));
  } catch (error) {
    console.error("Unable to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();
