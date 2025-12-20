const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  console.log("REQ BODY:", req.body);

  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, email, hashedPassword, role], (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json(err);
    }
    res.json({ message: "User registered successfully" });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      console.log("LOGIN EMAIL:", email);
      console.log("DB RESULT:", results);

      if (err) {
        console.error("DB ERROR:", err);
        return res.status(500).json(err);
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }

      const user = results[0];

      console.log("PLAIN PASSWORD:", password);
      console.log("HASHED PASSWORD:", user.password);

      const isMatch = bcrypt.compareSync(password, user.password);
      console.log("PASSWORD MATCH:", isMatch);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({ token, role: user.role });
    }
  );
};
