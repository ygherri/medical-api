const express = require("express");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const patientRoutes = require("./routes/patients");
const appointmentRoutes = require("./routes/appointments");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "API opérationnelle",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
