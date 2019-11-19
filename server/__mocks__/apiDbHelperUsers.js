
const constants = require("../constants");

const getUserById = async (userId, res) => {
    const response = [{
        _id: "123456123456abcdefabcdef",
        email: "johndoe@someemail.com",
        password: "mypasswordsucks",
        authType: "email"
    }];

    res.status(200).send(response);
}

const postOneUser = async (email, password, authType, res) => {
    res.sendStatus(200);
}

const putUserById = async (userId, email, password, authType, res) => {
    res.sendStatus(200);
}

const deleteUserById = async (userId, res) => {
    res.sendStatus(200);
}

const getUserSubscriptions = async (userId, res) => {
    if (userId == "abcdefabcdefabcdefabcdef") {
        const response = [];
        res.status(200).send(response)
    }
    else {
        const response = [{
            storeId: "123123123123123123123123",
            itemId: "321321321321321321321321"
        }, {
            storeId: "abcdefabcdef123123123123",
            itemId: "123456123456123456123456"
        }];
        res.status(200).send(response)
    }
}

const postItemToSubscription = async (userId, storeId, itemId, res) => {
    res.sendStatus(200);
}

const deleteItemFromSubscription = async (userId, storeId, itemId, res) => {
    res.sendStatus(200);
}

module.exports = {
    getUserById,
    postOneUser,
    putUserById,
    deleteUserById,
    getUserSubscriptions,
    postItemToSubscription,
    deleteItemFromSubscription
}