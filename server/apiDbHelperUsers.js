const db = require("./db");
const constants = require("./constants");
const usersCollection = constants.COLLECTION_USERS;
const userSubscriptionsCollection = constants.COLLECTION_USERSUBSCRIPTIONS;

const getUserById = async (userId, res) => {
    db.getDB().collection(usersCollection).find({
        "userid": userId
    }).toArray((err, result) => {
        res.status(constants.RES_OK).send(result);
    });
};

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
};

const createUser = async (userid, res) => {
    db.getDB().collection(usersCollection).find({
        "userid": userid
    }).toArray((err, result) => {
        if(err) {
            res.status(constants.RES_INTERNAL_ERR).send(err);
            return;
        }

        if(result.length === 0) {
            db.getDB().collection(usersCollection).insertOne({
                userid
            }, (err, result) => {
                if (err) {
                    res.status(constants.RES_INTERNAL_ERR).send(err);
                    return;
                }
        
                res.sendStatus(constants.RES_OK);
            });
        }

        res.status(constants.RES_OK).send(result);
    });
};

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
};

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
};

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
};

const postItemToSubscription = async (userId, storeId, itemId, fcm, res) => {
    db.getDB().collection(userSubscriptionsCollection).insertOne({
        "userId": db.getPrimaryKey(userId),
        "storeId": db.getPrimaryKey(storeId),
        "itemId": db.getPrimaryKey(itemId),
        fcm
    }, (err, result) => {
        if (err) {
            res.status(constants.RES_INTERNAL_ERR).send(err);
            return;
        }

        res.sendStatus(constants.RES_OK);
    });
};

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
};

module.exports = {
    getUserById,
    postOneUser,
    putUserById,
    deleteUserById,
    getUserSubscriptions,
    postItemToSubscription,
    deleteItemFromSubscription,
    createUser
};