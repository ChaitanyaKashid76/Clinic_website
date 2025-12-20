const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const appointmentController = require("../controllers/appointmentController");

router.post(
  "/book",
  auth,
  role(["PATIENT"]),
  appointmentController.bookAppointment
);

router.put(
  "/approve/:appointment_id",
  auth,
  role(["ADMIN"]),
  appointmentController.approveAppointment
);

router.get(
  "/doctor",
  auth,
  role(["DOCTOR"]),
  appointmentController.getDoctorAppointments
);

module.exports = router;
