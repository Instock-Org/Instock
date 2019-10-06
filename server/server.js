var express = require('express');
const bodyParser = require('body-parser');
const app = express();
const constants = require('./constants');

const PORT = constants.PORT;
const db = require('./db');

app.use(bodyParser.json());

app.use('/api/stores', require('./routes/api/stores'));

db.connect((err) => {
    if(err) {
        console.log("Unable to connect to db.");
        process.exit(1);
    } else {
        app.listen(PORT, () => console.log(`Connected to DB. Server started on port ${PORT}`));
    }
});