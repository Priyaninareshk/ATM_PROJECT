export const errorHandler = (err, _req, res, _next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "Validation error", details: err.message });
  }

  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error"
  });
};
