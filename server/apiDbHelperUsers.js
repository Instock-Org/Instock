const db = require("./db");
const constants = require("./constants");
const usersCollection = constants.COLLECTION_USERS;
const userSubscriptionsCollection = constants.COLLECTION_USERSUBSCRIPTIONS;

const getUserById = async (userId, res) => {
    db.getDB().collection(usersCollection).find({
        "_id": db.getPrimaryKey(userId)
    }).toArray((err, result) => {
        res.status(constants.RES_OK).send(result);
    });
}

const postOneUser = async (email, password, authType, res) => {
    db.getDB().collection(usersCollection).insertOne({
        email,
        password,
        authType
    }, (err, result) => {
        if (err) {
            res.status(constants.RES_INTERNAL_ERR).send(err);
            return;
        }

        res.status(constants.RES_OK).send(result.ops[0]._id);
    });
}

const putUserById = async (userId, email, password, authType, res) => {
    db.getDB().collection(usersCollection).updateOne({
        "_id": db.getPrimaryKey(userId)
    }, 
    {$set: {
        email,
        password,
        authType
    }}, (err, result) => {
        if (err) {
            res.status(constants.RES_INTERNAL_ERR).send(err);
            return;
        }

        res.sendStatus(constants.RES_OK);
    });
}

const deleteUserById = async (userId, res) => {
    db.getDB().collection(usersCollection).deleteOne({
        "_id": db.getPrimaryKey(userId)
    }, (err, result) => {
        if (err) {
            res.status(constants.RES_INTERNAL_ERR).send(err);
            return;
        }
 
        res.sendStatus(constants.RES_OK);
    });
}

const getUserSubscriptions = async (userId, res) => {
    db.getDB().collection(userSubscriptionsCollection).find({
        "userId": db.getPrimaryKey(userId)
    }, {projection: {_id: 0, userId: 0}}).toArray((err, result) => {
        if (err) {
            res.status(constants.RES_INTERNAL_ERR).send(err);
            return;
        }

        res.status(constants.RES_OK).send(result);
    });
}

const postItemToSubscription = async (userId, storeId, itemId, res) => {
    db.getDB().collection(userSubscriptionsCollection).insertOne({
        "userId": db.getPrimaryKey(userId),
        "storeId": db.getPrimaryKey(storeId),
        "itemId": db.getPrimaryKey(itemId)
    }, (err, result) => {
        if (err) {
            res.status(constants.RES_INTERNAL_ERR).send(err);
            return;
        }

        res.sendStatus(constants.RES_OK);
    });
}

const deleteItemFromSubscription = async (userId, storeId, itemId, res) => {
    db.getDB().collection(userSubscriptionsCollection).deleteOne({
       "userId": db.getPrimaryKey(userId),
       "storeId": db.getPrimaryKey(storeId),
       "itemId": db.getPrimaryKey(itemId)
    }, (err, result) => {
        if (err) {
            res.status(constants.RES_INTERNAL_ERR).send(err);
            return;
        }

        res.sendStatus(constants.RES_OK);
    });
}

module.exports = {
    getUserById,
    postOneUser,
    putUserById,
    deleteUserById,
    getUserSubscriptions,
    postItemToSubscription,
    deleteItemFromSubscription
};