var express = require("express");
const bodyParser = require("body-parser");
const app = express();
const constants = require("./constants");

const PORT = constants.PORT;
const db = require("./db");

app.use(bodyParser.json());

app.use("/api/stores", require("./routes/api/stores"));
app.use("/api/employees", require("./routes/api/employees"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/", require("./routes/api/items"));
app.use("/", require("./routes/api/internal"));
app.use("/", require("./routes/api/users"));

db.connect((err) => {
    if(err) {
        // process.exit(1);
        // Do nothing
    } else {
        app.listen(PORT, () => {});
    }
});

module.exports = app;