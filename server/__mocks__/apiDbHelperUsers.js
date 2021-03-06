
const constants = require("../constants");

const getUserById = async (userId, res) => {
    const response = [{
        _id: "123456123456abcdefabcdef",
        email: "johndoe@someemail.com",
        password: "mypasswordsucks",
        authType: "email"
    }];

    res.status(constants.RES_OK).send(response);
};

const postOneUser = async (email, password, authType, res) => {
    res.sendStatus(constants.RES_OK);
};

const putUserById = async (userId, email, password, authType, res) => {
    res.sendStatus(constants.RES_OK);
};

const deleteUserById = async (userId, res) => {
    res.sendStatus(constants.RES_OK);
};

const getUserSubscriptions = async (userId, res) => {
    if (userId === "abcdefabcdefabcdefabcdef") {
        const response = [];
        res.status(constants.RES_OK).send(response);
    }
    else {
        const response = [{
            storeId: "123123123123123123123123",
            itemId: "321321321321321321321321",
            fcm: "testfcm"
        }, {
            storeId: "abcdefabcdef123123123123",
            itemId: "123456123456123456123456",
            fcm: "testfcm2"
        }];
        res.status(constants.RES_OK).send(response);
    }
};

const postItemToSubscription = async (userId, storeId, itemId, fcm, res) => {
    res.sendStatus(constants.RES_OK);
};

const deleteItemFromSubscription = async (userId, storeId, itemId, res) => {
    res.sendStatus(constants.RES_OK);
};

module.exports = {
    getUserById,
    postOneUser,
    putUserById,
    deleteUserById,
    getUserSubscriptions,
    postItemToSubscription,
    deleteItemFromSubscription
};