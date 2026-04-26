// src/server.js
require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\nAPI Rendez-vous Médicaux`);
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV || "development"}`);
  console.log(`\nRoutes disponibles:`);
  console.log(`  GET    /health`);
  console.log(`  GET    /api/patients`);
  console.log(`  POST   /api/patients`);
  console.log(`  GET    /api/patients/:id`);
  console.log(`  PUT    /api/patients/:id`);
  console.log(`  DELETE /api/patients/:id`);
  console.log(`  GET    /api/patients/:id/appointments`);
  console.log(`  GET    /api/appointments`);
  console.log(`  POST   /api/appointments`);
  console.log(`  GET    /api/appointments/:id`);
  console.log(`  PUT    /api/appointments/:id`);
  console.log(`  DELETE /api/appointments/:id\n`);
});
