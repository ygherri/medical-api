const express = require("express");
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");
const validate = require("../middleware/validate");
const {
  createAppointmentRules,
  updateAppointmentRules,
  listAppointmentsRules,
  idParamRule,
} = require("../validators/appointmentValidators");

router.get("/", listAppointmentsRules, validate, getAllAppointments);
router.get("/:id", idParamRule, validate, getAppointmentById);
router.post("/", createAppointmentRules, validate, createAppointment);
router.put("/:id", updateAppointmentRules, validate, updateAppointment);
router.delete("/:id", idParamRule, validate, deleteAppointment);

module.exports = router;
