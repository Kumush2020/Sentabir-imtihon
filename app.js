const express = require("express");
const path = require("path");
const fs = require("fs");
const dishRoutes = require("./routes/dish.routes");
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");


const app = express();
const PORT = 3000;


for (const dir of ["database", "uploads", "logs"]) {
  fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
}


app.use(logger);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/dishes", dishRoutes);

app.get("/debug/error", (req, res, next) => {
  next(new Error("Test server error"));
});


app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} da ishlayapti`);
});
