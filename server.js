const express = require("express");
const bodyParser = require("body-parser");
const { postUser } = require("./routes");
const app = express();
const port = 3005;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.json({ info: "Node.js Express and Postgres" });
});
app.post("/user", postUser);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

module.exports = app;
