const express = require("express");
const router = express.Router();

const constants = require("../../constants");

const db = require("../../db");
const itemsCollection = constants.COLLECTION_ITEMS;
const storeHasCollection = constants.COLLECTION_STOREHAS;
const storeCollection = constants.COLLECTION_STORES;
const usersCollection = constants.COLLECTION_USERS;
const authCollection = constants.COLLECTION_AUTH;
const userSubCollection = constants.COLLECTION_USERSUBSCRIPTIONS;

const TokenGenerator = require("uuid-token-generator");
const tokgen2 = new TokenGenerator(256, TokenGenerator.BASE62);

router.use(express.json());


// Get all entries from the Items table
router.get("/api/internal/items", (req, res) => {
    db.getDB().collection(itemsCollection).find({}).toArray((err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }

        res.status(constants.RES_OK).send(result);
    });
});

router.get("/api/internal/items/store", (req, res) => {
    db.getDB().collection(storeHasCollection).find({}).toArray((err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }

        res.status(constants.RES_OK).send(result);
    });
});

// Get all entries from the StoreHas table
router.get("/api/internal/store", (req, res) => {
    db.getDB().collection(storeCollection).find({}).toArray((err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }

        res.status(constants.RES_OK).send(result);
    });
});

// Empty the Items table
router.delete("/api/internal/items", (req, res) => {
    db.getDB().collection(itemsCollection).deleteMany({}, (err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }
 
        res.sendStatus(constants.RES_OK);
    });
 });

// Empty the StoreHas table
router.delete("/api/internal/items/store", (req, res) => {
    db.getDB().collection(storeHasCollection).deleteMany({}, (err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }
 
        res.sendStatus(constants.RES_OK);
    });
 });

 // Get all users
 router.get("/api/internal/users", (req, res) => {
    db.getDB().collection(usersCollection).find({}).toArray((err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }

        res.status(constants.RES_OK).send(result);
    });
});

 // Get all user subscriptions
 router.get("/api/internal/users/subscriptions", (req, res) => {
    db.getDB().collection(userSubCollection).find({}).toArray((err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }

        res.status(constants.RES_OK).send(result);
    });
});

// Delete all user subscriptions
router.delete("/api/internal/users/subscriptions", (req, res) => {
    db.getDB().collection(userSubCollection).deleteMany({}, (err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }

        res.status(constants.RES_OK).send(result);
    });
});

// Create an auth token and client
router.post("/api/internal/auth", (req, res) => {
    const userInput = req.body;

    var token = tokgen2.generate() + "-" + userInput.clientId;

    db.getDB().collection(authCollection).insertOne({
        "clientId": userInput.clientId,
        token,
        "timestamp": Date.now()
    }, (err, result) => {
        if(err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return; 
        } else {
            res.status(constants.RES_OK).send(result.ops[0].token);
        }
    });

});

module.exports = router;