const { dbFail } = require("./dbHelper");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");

function showBody(req, res, next) {
  if (req.method === "POST") {
    console.log("The body we got: ", req.body);
  }
  next();
}

function authenticateToken(req, res, next) {
  const result = req.get("Authorization");

  if (!result) return dbFail(res, "not authenticated", 400);
  const token = result.split(" ")[1];
  jwt.verify(token, jwtSecret, (err, data) => {
    if (err) {
      return dbFail(res, "token expired/invalid", 400);
    }
    req.email = data.email;
    next();
  });
}

module.exports = {
  showBody,
  authenticateToken,
};
