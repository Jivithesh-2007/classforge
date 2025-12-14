const express = require("express");
const app = express();

app.get("/health", (req, res) => {
  res.status(200).send("OK FROM TEST SERVER");
});

app.listen(5001, () => {
  console.log("✅ TEST SERVER RUNNING ON 5001");
});
