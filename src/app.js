const express = require("express");
const cors = require("cors");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const patientRoutes = require("./routes/patients");
const appointmentRoutes = require("./routes/appointments");

const app = express();
// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mediapp-web.netlify.app/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
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
