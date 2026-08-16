const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/auth");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", userRoutes);

app.listen(5000, () => console.log("server connected"));
