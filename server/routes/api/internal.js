const express = require("express");
const router = express.Router();

const constants = require("../../constants");

const db = require("../../db");
const itemsCollection = constants.COLLECTION_ITEMS;
const storeHasCollection = constants.COLLECTION_STOREHAS;
const usersCollection = constants.COLLECTION_USERS;

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
    db.getDB().collection(storeHasCollection).find({}).toArray((err, result) => {
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

module.exports = router;