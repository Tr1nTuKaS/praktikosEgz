const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

const { serverPort } = require("../config/config");
const PORT = serverPort || 3000;

// middleware
app.use(morgan("common"));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello express");
});

const posts = require("../API/posts");

app.use("/posts", posts);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
