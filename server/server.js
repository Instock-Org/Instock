var express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

app.use("/api/stores", require("./routes/api/stores"));
app.use("/api/employees", require("./routes/api/employees"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/", require("./routes/api/items"));
app.use("/", require("./routes/api/internal"));
app.use("/", require("./routes/api/users"));

module.exports = app;