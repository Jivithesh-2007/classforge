require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

/* -------------------- CONNECT DATABASE -------------------- */
connectDB();

/* -------------------- MIDDLEWARES -------------------- */
// CORS (React runs on 3000)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Parse JSON body
app.use(express.json());

/* -------------------- ROUTES -------------------- */
app.use("/api/auth", require("./routes/authRoutes"));

/* -------------------- TEST ROUTE -------------------- */
app.get("/ping", (req, res) => {
  res.json({ message: "Backend alive" });
});

/* -------------------- START SERVER -------------------- */
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
