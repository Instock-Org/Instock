const db = require("./db");
const app = require("./server");
const constants = require("./constants");
const PORT = constants.PORT;

db.connect((err) => {
    if (err) {
        // process.exit(1);
        // Do nothing
    } else {
        app.listen(PORT, () => {});
    }
});