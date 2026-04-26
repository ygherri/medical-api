const { body, param } = require("express-validator");

const createPatientRules = [
  body("firstName").trim().notEmpty().withMessage("Le prénom est requis."),
  body("lastName").trim().notEmpty().withMessage("Le nom est requis."),
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Email invalide.")
    .normalizeEmail(),
  body("phone").optional().trim(),
  body("dateOfBirth").optional().isISO8601().withMessage("Date invalide."),
];

const updatePatientRules = [
  param("id").isInt({ min: 1 }).withMessage("ID invalide."),
  body("firstName").optional().trim(),
  body("lastName").optional().trim(),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Email invalide.")
    .normalizeEmail(),
  body("phone").optional().trim(),
  body("dateOfBirth").optional().isISO8601().withMessage("Date invalide."),
];

const idParamRule = [param("id").isInt({ min: 1 }).withMessage("ID invalide.")];

module.exports = { createPatientRules, updatePatientRules, idParamRule };
