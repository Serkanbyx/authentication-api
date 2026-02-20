const errorHandler = (err, req, res, _next) => {
  console.error(err.stack || err.message);

  if (err.message && err.message.includes("UNIQUE constraint failed")) {
    return res.status(409).json({
      success: false,
      message: "This email is already registered.",
    });
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
