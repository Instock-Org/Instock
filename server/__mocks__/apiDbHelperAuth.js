const constants = require("../constants");

const getToken = async (clientId, res) => {
    if(clientId === "12345") {
        res.status(constants.RES_OK).send("token");
    } else {
        res.sendStatus(constants.RES_BAD_REQUEST);
    }
}

module.exports = {
    getToken
}