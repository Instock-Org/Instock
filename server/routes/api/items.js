const express = require('express');
const router = express.Router();
const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
router.use(express.json());

var db;

mongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) return console.log(err);
    db = client.db('instock');
    db.collection("StoreHas").createIndex({storeId: 1, itemId: 1}, {unique: true})
})

// Gets all the items from a store
// GET /api/items/store/{storeId}
router.get('/api/items/store/:storeId', (req, res) => {
    db.collection("StoreHas").find({
        "storeId": req.params.storeId
    }, {projection: {_id: 0, storeId: 0}}).toArray((err, result) => {
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

// Updates a store's availability on an item
// PUT /api/items/store/{storeId}
// TODO: Test
router.put('/api/items/store/:storeId/:itemId', (req, res) => {
    db.collection("StoreHas").update({
        "storeId": req.params.storeId,
        "itemId": req.body.itemId,
    }, {
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

// Removes items from a store
// DELETE /api/items/store/{storeId}
router.delete('/api/items/store/:storeId', (req, res) => {
   db.collection("StoreHas").deleteMany({
       "storeId": req.params.storeId,
       "itemId": {$in: req.body.itemIds}
   }, (err, result) => {
       if (err) {
           res.status(400).send(err);
           return;
       }

       res.sendStatus(200);
   })
});

// Gets items by name or brand
// GET /api/items
// Returns if exact match only, case insensitive
router.get('/api/items', (req, res) => {
    // Commented code would return results as long as it matches one word
    // let search_term_keywords = req.body.search_term.split(" ");
    // search_term_keywords.forEach( (search_term, key) => {
    //     search_term_keywords[key] = new RegExp('.*' + search_term + '.*', 'i');
    // });
    // console.log(search_term_keywords);
    db.collection("Items").find({
        "name": new RegExp('.*' + req.body.search_term + '.*', 'i')
        //$or: [{ name: { $in: search_term_keywords }}, { brand: { $in: search_term_keywords }}]
    }).toArray((err, result) => {
        res.status(200).send(result);
    })
});

// Add item to items list
// POST /api/items
router.post('/api/items', (req, res) => {
    db.collection("Items").insertOne({
        "name": req.body.name,
        // "brand": req.body.brand,
        "description": req.body.description,
        "barcode": req.body.barcode,
        "units": req.body.units
    }, (err, result) => {
        if (err) {
            res.status(400).send(err);
            return;
        }

        res.sendStatus(200);
    })
});

router.put('/api/items/:itemId', (req, res) => {
    db.collection("Items").update({
        "_id": ObjectId(req.params.itemId)
    },
    {
        "name": req.body.name,
        // "brand": req.body.brand,
        "description": req.body.description,
        "barcode": req.body.barcode,
        "units": req.body.units
    }, (err, result) => {
        if (err) {
            res.status(400).send(err);
            return;
        }

        res.sendStatus(200);
    })
})

// Deletes items
// DELETE /api/items
router.delete('/api/items', (req, res) => {
    let itemIds = [];
    req.body.itemIds.forEach( (value, key) => {
        itemIds[key] = ObjectId(value);
    });

    db.collection("Items").deleteMany({
        "_id": {$in: itemIds}
    }, (err, result) => {
        if (err) {
            res.status(400).send(err);
            return;
        }
 
        res.sendStatus(200);
    })
 });

module.exports = router;