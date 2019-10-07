const express = require('express');
const router = express.Router();
const mongoClient = require('mongodb').MongoClient;
router.use(express.json());

var db;

mongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) return console.log(err);
    db = client.db('instock');
    db.collection("StoreHas").createIndex({storeId: 1, itemId: 1}, {unique: true})
})

// Gets all the items from a store
// GET /api/items/store/{storeId}
router.get('/api/items/:storeId', (req, res) => {
    db.collection("StoreHas").find({
        "storeId": req.params.storeId
    }).toArray((err, result) => {
        res.status(200).send(result);
    })
});

// Adds an item to a store
// POST /api/items/store/{storeId}
router.post('/api/items/store/:storeId', (req, res) => {
    db.collection("StoreHas").insertOne({
        "storeId": req.params.storeId,
        "itemId": req.body.itemId,
        "quantity": req.body.quantity || 0,
        "price": req.body.price || 0
    }, (err, result) => {
        if (err) {
            res.status(400).send(err);
            return;
        }

        res.sendStatus(200);
    })
});

// Removes an item from a store
// DELETE /api/items/store/{storeId}/{itemId}
router.delete('/api/items/store/:storeId/:itemId', (req, res) => {
   db.collection("StoreHas").deleteOne({
       "storeId": req.params.storeId,
       "itemId": req.params.itemId
   }, (err, result) => {
       if (err) {
           res.status(400).send(err);
           return;
       }

       res.send(result);
   })
});

module.exports = router;