const express = require("express");
const router = express.Router();
const constants = require("../../constants");

const db = require("../../db");
const usersCollection = constants.COLLECTION_USERS;
const userSubscriptionsCollection = constants.COLLECTION_USERSUBSCRIPTIONS;

router.use(express.json());

// Get user by id
router.get("/api/users/:user_id", (req, res) => {
    db.getDB().collection(usersCollection).find({
        "_id": db.getPrimaryKey(req.params.user_id),
    }).toArray((err, result) => {
        res.status(constants.RES_OK).send(result);
    })
});

// Add a single user
router.post("/api/users", (req, res) => {
    console.log("POST /api/users");
    db.getDB().collection(usersCollection).insertOne({
        "email": req.body.email,
        "password": req.body.password,
        "authType": req.body.auth_type
    }, (err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }

        res.status(constants.RES_OK).send(result.ops[0]._id);
    })
});

// Update user
// PUT /api/users/{user_id}
router.put("/api/users/:user_id", (req, res) => {
    db.getDB().collection(usersCollection).updateOne({
        "_id": db.getPrimaryKey(req.params.user_id)
    }, 
    {$set: {
        "email": req.body.email,
        "password": req.body.password,
        "authType": req.body.auth_type
    }}, (err, result) => {
        if (err) {
            console.log(err);
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }

        res.sendStatus(constants.RES_OK);
    })
});

// Deletes a single user by user_id
// DELETE /api/users/{user_id}
router.delete("/api/users/:user_id", (req, res) => {
    db.getDB().collection(usersCollection).deleteOne({
        "_id": db.getPrimaryKey(req.params.user_id)
    }, (err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }
 
        res.sendStatus(constants.RES_OK);
    })
 });

// Get user subscriptions
// GET /api/users/subscriptions/{user_id}
router.get("/api/users/subscriptions/:user_id", (req, res) => {
    db.getDB().collection(userSubscriptionsCollection).find({
        "userId": db.getPrimaryKey(req.params.user_id)
    }, {projection: {_id: 0, userId: 0}}).toArray((err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }

        res.status(constants.RES_OK).send(result);
    })
});

// Add item to subscription
// POST /api/users/subscriptions
router.post("/api/users/subscriptions", (req, res) => {
    db.getDB().collection(userSubscriptionsCollection).insertOne({
        "userId": db.getPrimaryKey(req.body.user_id),
        "storeId": db.getPrimaryKey(req.body.store_id),
        "itemId": db.getPrimaryKey(req.body.item_id)
    }, (err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }

        res.sendStatus(constants.RES_OK);
    })
});

// Delete item from subscription
// DELETE /api/users/subscriptions/{user_id}/{store_id}/{item_id}
router.delete("/api/users/subscriptions/:user_id/:store_id/:item_id", (req, res) => {
    db.getDB().collection(userSubscriptionsCollection).deleteOne({
        "userId": db.getPrimaryKey(req.params.user_id),
        "storeId": db.getPrimaryKey(req.params.store_id),
        "itemId": db.getPrimaryKey(req.params.item_id)
    }, (err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }

        res.sendStatus(constants.RES_OK);
    })
});

module.exports = router;