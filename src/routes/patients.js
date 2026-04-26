const express = require("express");
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientAppointments,
} = require("../controllers/patientController");
const validate = require("../middleware/validate");
const {
  createPatientRules,
  updatePatientRules,
  idParamRule,
} = require("../validators/patientValidators");

router.get("/", getAllPatients);
router.get("/:id", idParamRule, validate, getPatientById);
router.post("/", createPatientRules, validate, createPatient);
router.put("/:id", updatePatientRules, validate, updatePatient);
router.delete("/:id", idParamRule, validate, deletePatient);
router.get("/:id/appointments", idParamRule, validate, getPatientAppointments);

module.exports = router;
