const express = require("express");
const router = express.Router();
// const constants = require("../../constants");
const dbHelper = require("../../apiDbHelperAuth");

router.use(express.json());


// Get a token for passed in client id
router.get("/token", (req, res) => {

    var clientId = req.query.clientId;
    dbHelper.getToken(clientId, res);

});

module.exports = router;