const notFound = (req, res, next) => {
  const error = new Error(
    `Route non trouvée: ${req.method} ${req.originalUrl}`,
  );
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  if (err.code === "P2002")
    return res
      .status(409)
      .json({
        success: false,
        error: "Un enregistrement avec ces données existe déjà.",
      });
  if (err.code === "P2025")
    return res
      .status(404)
      .json({ success: false, error: "Enregistrement introuvable." });
  res.status(statusCode).json({ success: false, error: err.message });
};

module.exports = { notFound, errorHandler };
