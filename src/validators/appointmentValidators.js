const { body, param, query } = require("express-validator");

const createAppointmentRules = [
  body("patientId")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("patientId invalide."),
  body("doctorName")
    .trim()
    .notEmpty()
    .withMessage("Le nom du médecin est requis."),
  body("reason").optional().trim(),
  body("startTime").notEmpty().isISO8601().withMessage("startTime invalide."),
  body("endTime")
    .notEmpty()
    .isISO8601()
    .withMessage("endTime invalide.")
    .custom((value, { req }) => {
      if (req.body.startTime && new Date(value) <= new Date(req.body.startTime))
        throw new Error("endTime doit être après startTime.");
      return true;
    }),
  body("notes").optional().trim(),
];

const updateAppointmentRules = [
  param("id").isInt({ min: 1 }).withMessage("ID invalide."),
  body("doctorName").optional().trim(),
  body("reason").optional().trim(),
  body("startTime").optional().isISO8601().withMessage("startTime invalide."),
  body("endTime").optional().isISO8601().withMessage("endTime invalide."),
  body("status")
    .optional()
    .isIn(["SCHEDULED", "CONFIRMED", "CANCELLED", "COMPLETED"])
    .withMessage("Statut invalide."),
  body("notes").optional().trim(),
];

const listAppointmentsRules = [
  query("status")
    .optional()
    .isIn(["SCHEDULED", "CONFIRMED", "CANCELLED", "COMPLETED"]),
  query("from").optional().isISO8601(),
  query("to").optional().isISO8601(),
];

const idParamRule = [param("id").isInt({ min: 1 }).withMessage("ID invalide.")];

module.exports = {
  createAppointmentRules,
  updateAppointmentRules,
  listAppointmentsRules,
  idParamRule,
};
