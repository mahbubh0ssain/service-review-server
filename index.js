const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());

app.get("/", (req, res) => {
  res.send("Mr. Plumber server side running successfully. ");
});

app.listen(port, () => {
  console.log("Mr. Plumber server is running on port", port);
});
