const express = require("express");
const router = express.Router();
const constants = require("../../constants");
const passport = require("passport");

const db = require("../../db");
const authCollection = constants.COLLECTION_AUTH;
const tokenTimeout = constants.TOKEN_TIMEOUT;

const TokenGenerator = require("uuid-token-generator");
const tokgen2 = new TokenGenerator(256, TokenGenerator.BASE62);

router.use(express.json());


// Get a token for passed in client id
router.get("/token", (req, res) => {

    var clientId = req.query.clientId;

    db.getDB().collection(authCollection).find({
        clientId
    }).toArray((err, result) => {
        if (result.length === 0) {
            res.sendStatus(constants.RES_NOT_FOUND);
            return;
        }

        var oldTimestamp = result[0].timestamp;
        
        if(Math.floor((Date.now() - oldTimestamp)/1000) > tokenTimeout) {
            var token = tokgen2.generate() + "-" + clientId;

            db.getDB().collection(authCollection).findOneAndUpdate(
                {clientId}, 
                {$set : {
                    clientId,
                    token,
                    timestamp: Date.now()
                }}, 
                {returnOriginal : false}, 
            (err, result) => {
                if(err) {
                    res.sendStatus(constants.RES_BAD_REQUEST);
                }
                else {
                    res.status(constants.RES_OK).send(result.value.token);
                }
            });
        } else {
            res.status(constants.RES_OK).send(result[0].token);
        }
    });
});

router.get("/login", (req, res) => {
    res.send("loggin in");
});

router.get("/logout", (req, res) => {
    res.send("loggin out");
});

// google auth
router.get("/google", passport.authenticate("google", {
    scope: ['profile']
}));

module.exports = router;