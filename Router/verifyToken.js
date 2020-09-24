const dotenv = require("dotenv");

const jwt = require("jsonwebtoken");
dotenv.config();
process.env.ACCESS_TOKEN_SECRET;


function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  console.log("auth", token);
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log("JWT err", err);
    if (err) return res.sendStatus(403);
    console.log("verify", user);
    next();
  });
}

module.exports = authenticateToken;
