const jwt = require("jsonwebtoken");

//====================
// Verify token only
//====================
function verifyToken(req, res, next) {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
}

//====================================
// Verify token and same user or admin
//====================================
function verifyTokenAndAutherization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Not allowed" });
    }
  });
}

//==============================
// Verify token and admin only
//==============================
function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Admin access only" });
    }
  });
}

//==============================
// Export everything correctly
//==============================
module.exports = {
  verifyToken,
  verifyTokenAndAutherization,
  verifyTokenAndAdmin,
};
