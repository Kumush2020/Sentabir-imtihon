const fs = require("fs/promises");
const path = require("path");

const logsDir = path.join(__dirname, "..", "logs");
const accessLog = path.join(logsDir, "access.log");

module.exports = function logger(req, res, next) {
  const start = Date.now();

  res.on("finish", async () => {
    try {
      await fs.mkdir(logsDir, { recursive: true });
      const elapsed = Date.now() - start;
      const line = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${elapsed}ms\n`;
      await fs.appendFile(accessLog, line, "utf8");
    } catch (err) {
      console.error("Access log yozilmadi:", err.message);
    }
  });

  next();
};
