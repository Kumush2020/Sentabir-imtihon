const fs = require("fs/promises");
const path = require("path");

const logsDir = path.join(__dirname, "..", "logs");
const errorLog = path.join(logsDir, "error.log");

module.exports = function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  let status = Number(err.status) || 500;
  let message = err.message || "Internal Server Error";

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    status = 400;
    message = "Invalid JSON";
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    status = 400;
    message = "File size must not exceed 2MB";
  }

  if (status >= 500) {
    message = "Internal Server Error";
    fs.mkdir(logsDir, { recursive: true })
      .then(() => fs.appendFile(
        errorLog,
        `[${new Date().toISOString()}] ERROR ${req.method} ${req.originalUrl} - ${err.message}\n`,
        "utf8"
      ))
      .catch(logErr => console.error("Error log yozilmadi:", logErr.message));
  }

  res.status(status).json({
    success: false,
    message
  });
};
