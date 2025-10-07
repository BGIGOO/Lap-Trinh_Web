module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) {
    console.error("Internal error:", {
      message: err?.message,
      stack: err?.stack,
    });
  }
  res.status(status).json({ message: err.message || "Server error" });
};