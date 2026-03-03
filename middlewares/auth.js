const jwt = require("jsonwebtoken");
const data = require("../data");

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header missing or malformed" });
  }
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, data.JWT_SECRET);
    const user = data.users.find((u) => u.id === payload.id);
    if (!user) return res.status(401).json({ error: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = authMiddleware;
