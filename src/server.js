const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

const app = express();

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
