const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const auth = require("./middleware/authMiddleware");

app.get("/api/test-auth", auth, (req, res) => {
  res.json({ message: "Token valid", user: req.user });
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));
app.use("/api/patient", require("./routes/patientRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
