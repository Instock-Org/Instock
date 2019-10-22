const express = require('express');
const router = express.Router();
const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
router.use(express.json());

var db;

mongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) return console.log(err);
    db = client.db('instock');
    db.collection("Users").createIndex({email: 1, authType: 1}, {unique: true});
    db.collection("UserSubscriptions").createIndex({userId: 1, storeId: 1, itemId: 1}, {unique: true});
})

// Get user by id
router.get('/api/users/:user_id', (req, res) => {
    db.collection("Users").find({
        "_id": ObjectId(req.params.user_id),
    }).toArray((err, result) => {
        res.status(200).send(result);
    })
});

// Add a single user
router.post('/api/users', (req, res) => {
    console.log("POST /api/users");
    db.collection("Users").insertOne({
        "email": req.body.email,
        "password": req.body.password,
        "authType": req.body.auth_type
    }, (err, result) => {
        if (err) {
            res.status(400).send(err);
            return;
        }

        res.status(200).send(result.ops[0]._id);
    })
});

// Update user
// PUT /api/users/{user_id}
router.put('/api/users/:user_id', (req, res) => {
    db.collection("Users").updateOne({
        "_id": ObjectId(req.params.user_id)
    }, {
        "email": req.body.email,
        "password": req.body.password,
        "authType": req.body.auth_type
    }, (err, result) => {
        if (err) {
            res.status(400).send(err);
            return;
        }

        res.sendStatus(200);
    })
});

// Deletes a single user by user_id
// DELETE /api/users/{user_id}
router.delete('/api/users/:user_id', (req, res) => {
    db.collection("Users").deleteOne({
        "_id": ObjectId(req.params.user_id)
    }, (err, result) => {
        if (err) {
            res.status(400).send(err);
            return;
        }
 
        res.sendStatus(200);
    })
 });

// Get user subscriptions
// GET /api/users/subscriptions/{user_id}
router.get('/api/users/subscriptions/:user_id', (req, res) => {
    db.collection("UserSubscriptions").find({
        "userId": req.params.user_id
    }, {projection: {_id: 0, userId: 0}}).toArray((err, result) => {
        if (err) {
            res.status(400).send(err);
            return;
        }

        res.status(200).send(result);
    })
});

// Add item to subscription
// POST /api/users/subscriptions
router.post('/api/users/subscriptions', (req, res) => {
    db.collection("UserSubscriptions").insertOne({
        "userId": req.body.user_id,
        "storeId": req.body.store_id,
        "itemId": req.body.item_id
    }, (err, result) => {
        if (err) {
            res.status(400).send(err);
            return;
        }

        res.sendStatus(200);
    })
});

// Delete item from subscription
// DELETE /api/users/subscriptions/{user_id}/{store_id}/{item_id}
router.delete('/api/users/subscriptions/:user_id/:store_id/:item_id', (req, res) => {
    db.collection("UserSubscriptions").deleteOne({
        "userId": req.params.user_id,
        "storeId": req.params.store_id,
        "itemId": req.params.item_id
    }, (err, result) => {
        if (err) {
            res.status(400).send(err);
            return;
        }

        res.sendStatus(200);
    })
});

module.exports = router;