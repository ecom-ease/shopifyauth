const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

// health + root only
app.get("/health", (_req, res) => res.status(200).send("ok"));
app.get("/", (_req, res) => res.status(200).send("up"));

app.listen(port, "0.0.0.0", () => {
  console.log(`App listening on port ${port}`);
});
