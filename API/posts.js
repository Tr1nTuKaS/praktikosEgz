const express = require("express");
const { dbAction, dbFail, dbSuccess } = require("../helper/dbHelper");
const { validateNewPost } = require("../helper/validateHelper");
const { hashValue, verifyHash } = require("../helper/hashHelper");

const router = express.Router();

router.get("/all", async (req, res) => {
  const sql = `
  SELECT * FROM posts`;
  const dbResult = await dbAction(sql);
  if (dbResult === false) return dbFail(res);
  return dbSuccess(res, dbResult);
});

router.post("/new", validateNewPost, async (req, res) => {
  // after validation
  const sql = `INSERT INTO posts(name, age, email, password) VALUES(?, ?, ?, ?)`;
  const { name, age, email, password } = req.body;
  const dbResult = await dbAction(sql, [
    name,
    age,
    email,
    hashValue(req.body.password),
  ]);
  if (dbResult === false) {
    return res.status(500).json({ error: "post ???" });
  }
  res.json({ msg: "post created", dbResult });
});

router.delete("/:id", async (req, res) => {
  const sql = `DELETE FROM posts WHERE id = ?`;
  const dbResult = await dbAction(sql, [req.params.id]);
  if (dbResult === false) {
    return dbFail(res);
  }
  if (dbResult.affectedRows === 1) {
    return dbSuccess(res, []);
  }
  dbFail(res, "no rows affected");
});

router.get("/edit/:id", async (req, res) => {
  const sql = `SELECT * FROM posts WHERE id=?`;
  const dbResult = await dbAction(sql, [req.params.id]);
  if (dbResult === false) return dbFail(res);
  return dbSuccess(res, dbResult);
});

router.put("/update/:id", async (req, res) => {
  const sql = `UPDATE posts SET name=?, age=?, email=?, password=?  WHERE id=?`;
  const { name, age, email, password } = req.body;
  const dbResult = await dbAction(sql, [
    req.params.id,
    name,
    age,
    email,
    password,
  ]);
  if (dbResult === false) return dbFail(res);
  return dbSuccess(res, dbResult);
});
router.post("/", async (req, res) => {
  console.log("/orders POST got ", req.body);

  try {
    const conn = await mysql.createConnection(dbConfig);
    let sql = `
        INSERT INTO posts (name,age,email,paswword)
        VALUES(?,?,?,?)`;
    const [resultOrder] = await conn.execute(sql, Object.values(req.body));

    sql = `
        UPDATE posts
        SET name=?, age=?, email=?, password=?
        WHERE id = ?
        `;
    const [resultUpdate] = await conn.execute(sql, [
      req.body.name,
      req.body.age,
      req.body.email,
      req.body.password,
      req.body.product_id,
    ]);

    res.send({ msg: "success connected", resultOrder, resultUpdate });
    conn.end();
  } catch (error) {
    console.log("/ got error", error);
    res.status(500).send({ error: "Something wrong with orders" });
  }
});
module.exports = router;
