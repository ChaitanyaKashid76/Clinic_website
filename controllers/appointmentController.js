const db = require("../config/db");

/**
 * PATIENT: Book appointment
 */
exports.bookAppointment = (req, res) => {
  const { doctor_id, appointment_date, appointment_time } = req.body;
  const user_id = req.user.id;

  if (!doctor_id || !appointment_date || !appointment_time) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // STEP 1: Get patient.id using user_id
  const getPatientSql = "SELECT id FROM patients WHERE user_id = ?";

  db.query(getPatientSql, [user_id], (err, patientResult) => {
    if (err) {
      console.error("PATIENT LOOKUP ERROR:", err);
      return res.status(500).json(err);
    }

    if (patientResult.length === 0) {
      return res.status(400).json({ message: "Patient profile not found" });
    }

    const patient_id = patientResult[0].id;

    // STEP 2: Insert appointment
    const insertSql = `
      INSERT INTO appointments
      (patient_id, doctor_id, appointment_date, appointment_time, status)
      VALUES (?, ?, ?, ?, 'PENDING')
    `;

    db.query(
      insertSql,
      [patient_id, doctor_id, appointment_date, appointment_time],
      (err) => {
        if (err) {
          console.error("BOOK APPOINTMENT ERROR:", err);
          return res.status(500).json(err);
        }

        res.json({ message: "Appointment booked, awaiting approval" });
      }
    );
  });
};

/**
 * ADMIN: Approve appointment
 */
exports.approveAppointment = (req, res) => {
  const { appointment_id } = req.params;

  db.query(
    "UPDATE appointments SET status='APPROVED' WHERE id=?",
    [appointment_id],
    (err, result) => {
      if (err) {
        console.error("APPROVE ERROR:", err);
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      res.json({ message: "Appointment approved" });
    }
  );
};

/**
 * DOCTOR: View own appointments
 */
exports.getDoctorAppointments = (req, res) => {
  const doctor_id = req.user.id;

  db.query(
    "SELECT * FROM appointments WHERE doctor_id=?",
    [doctor_id],
    (err, results) => {
      if (err) {
        console.error("DOCTOR APPOINTMENTS ERROR:", err);
        return res.status(500).json(err);
      }
      res.json(results);
    }
  );
};

