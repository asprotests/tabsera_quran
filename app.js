const express = require("express");
const app = express();
const quranRouter = require("./routes/quran");
const dotenv = require("dotenv");

dotenv.config();

app.use(express.json());
app.use("/api/quran", quranRouter);

// Fallback route
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Quran API server running on port ${PORT}`);
});
