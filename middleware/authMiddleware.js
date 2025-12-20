const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("AUTH HEADER:", req.headers.authorization);
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err){
    console.error("JWT VERIFY ERROR:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
