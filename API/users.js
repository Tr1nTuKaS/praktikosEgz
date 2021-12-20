const express = require("express");
const { dbAction, dbFail, dbSuccess } = require("../helper/dbHelper");
const { hashValue, verifyHash } = require("../helper/hashHelper");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../helper/middleware");

const mysql = require("mysql2/promise");
const { dbConfig } = require("../config/config");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/register", async (req, res) => {
  const newUser = {
    email: req.body.email,
    password: hashValue(req.body.password),
  };
  const sql = `
    INSERT INTO users (email, password)
    VALUES ( ?, ? )
    `;
  const dbResult = await dbAction(sql, [newUser.email, newUser.password]);
  if (dbResult === false) {
    return res.status(500).json({ error: "something went wrong" });
  }
  if (dbResult.affectedRows === 1) {
    return res.json({ msg: "register success", newUser: newUser.email });
  }
  console.log("no rows affected");
  res.status(500).json({ error: "something went wrong" });
});

router.post("/login", async (req, res) => {
  const { body } = req;

  try {
    const conn = await mysql.createConnection(dbConfig);
    const sql = "SELECT * FROM users WHERE email = ?";
    const [foundUser] = await conn.execute(sql, [body.email]);
    await conn.end();

    if (foundUser.length === 0) {
      throw new Error("user not found");
    }
    console.log(foundUser);
    console.log(body.password, foundUser[0].pass);
    if (bcrypt.compareSync(body.password, foundUser[0].password)) {
      const userToBeEncrypted = {
        email: foundUser[0].email,
        userId: foundUser[0].id,
      };

      const token = jwt.sign(
        userToBeEncrypted,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        msg: "user found",
        foundUser: foundUser[0].email,
        token,
      });
    }
    throw new Error("password do not match");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
