const express = require('express');
const router = express.Router();
const mongoClient = require('mongodb').MongoClient;
router.use(express.json());

var db;

mongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) return console.log(err);
    db = client.db('instock');
})

// Get all entries from the Items table
router.get('/api/internal/items', (req, res) => {
    db.collection("Items").find({}).toArray((err, result) => {
        if (err) {
            res.status(400).send(err);
            return;
        }

        res.status(200).send(result);
    })
});

// Get all entries from the StoreHas table
router.get('/api/internal/store', (req, res) => {
    db.collection("StoreHas").find({}).toArray((err, result) => {
        if (err) {
            res.status(400).send(err);
            return;
        }

        res.status(200).send(result);
    })
});

// Prepopulate Database
// TODO: Implement
router.post('/api/internal/prepopulate', (req, res) => {
    // Add some items

    // Add some stores

    // Add some users 

    // Add some items that stores have

    // Add some items that users subscribe to
});

// Empty the Items table
router.delete('/api/internal/items', (req, res) => {
    db.collection("Items").deleteMany({}, (err, result) => {
        if (err) {
            res.status(400).send(err);
            return;
        }
 
        res.sendStatus(200);
    })
 });

// Empty the StoreHas table
router.delete('/api/internal/items/store', (req, res) => {
    db.collection("StoreHas").deleteMany({}, (err, result) => {
        if (err) {
            res.status(400).send(err);
            return;
        }
 
        res.sendStatus(200);
    })
 });

 // Get all users
 router.get('/api/internal/users', (req, res) => {
    db.collection("Users").find({}).toArray((err, result) => {
        if (err) {
            res.status(400).send(err);
            return;
        }

        res.status(200).send(result);
    })
});

module.exports = router;