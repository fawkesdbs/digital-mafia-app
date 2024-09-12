const jwt = require("jsonwebtoken");
const { TOKEN_KEY } = process.env;

const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  // check for provided token
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  // verify token
  jwt.verify(token, TOKEN_KEY, (err, user) => {
    if (err) return res.status(403).send("Invalid token."); // Forbidden
    req.user = user;
    next();
  });
};

const checkAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.sendStatus(403); // Forbidden
  next();
};

module.exports = { verifyToken, checkAdmin };
