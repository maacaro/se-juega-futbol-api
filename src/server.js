const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes");
const port = process.env.PORT || 3005;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.json({ info: "Node.js Express and Postgres" });
});

app.use("/api", routes);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

module.exports = app;
