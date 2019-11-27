const db = require("./db");
const constants = require("./constants");

const authCollection = constants.COLLECTION_AUTH;
const tokenTimeout = constants.TOKEN_TIMEOUT;

const TokenGenerator = require("uuid-token-generator");
const tokgen2 = new TokenGenerator(256, TokenGenerator.BASE62);

const getToken = async (clientId, res) => {
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
}

module.exports = {
    getToken
};