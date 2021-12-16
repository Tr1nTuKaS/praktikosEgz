const express = require("express");
const { dbAction, dbFail, dbSuccess } = require("../helper/dbHelper");
const { validateNewPost } = require("../helper/validateHelper");

const router = express.Router();

router.get("/all", async (req, res) => {
  const sql = `
    SELECT * FROM posts`;
  const dbResult = await dbAction(sql);
  if (dbResult === false) return dbFail(res);
  dbSuccess(res, dbResult);
});

router.post("/new", validateNewPost, async (req, res) => {
  // after validation
  const sql =
    "INSERT INTO posts (name, age, email, password) VALUES (?, ?, ?, ?)";
  const { name, age, email, password } = req.body;
  const dbResult = await dbAction(sql, [name, age, email, password]);
  if (dbResult === false) {
    return res.status(500).json({ error: "sideways" });
  }
  res.json({ msg: "post created", dbResult });
});
module.exports = router;

router.delete("/:id", validateNewPost, async (req, res) => {
  const sql = "DELETE FROM posts WHERE id = ? LIMIT 1";
  const dbResult = await dbAction(sql, [req.params.id]);
  if (dbResult === false) {
    dbFail(res);
  }
  if (dbResult.affectedRows === 1) {
    return dbSuccess(res, []);
  }
  dbFail(res, "no rows affected");
});
