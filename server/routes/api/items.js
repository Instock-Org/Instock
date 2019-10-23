const express = require('express');
const router = express.Router();
const constants = require('../../constants');

const db = require('../../db');
const storeHasCollection = constants.COLLECTION_STOREHAS;
const itemsCollection = constants.COLLECTION_ITEMS;

router.use(express.json());


// Gets all the items from a store
// GET /api/items/store/{storeId}
router.get('/api/items/store/:storeId', (req, res) => {
    db.getDB().collection(storeHasCollection).find({
        "storeId": db.getPrimaryKey(req.params.storeId)
    }, {projection: {_id: 0, storeId: 0}}).toArray((err, result) => {
        res.status(200).send(result);
    })
});

// Adds an item to a store
// POST /api/items/store/{storeId}
router.post('/api/items/store/:storeId', (req, res) => {
    db.getDB().collection(storeHasCollection).insertOne({
        "storeId": db.getPrimaryKey(req.params.storeId),
        "itemId": db.getPrimaryKey(req.body.itemId),
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
// TODO: Manually test
router.put('/api/items/store/:storeId/:itemId', (req, res) => {
    db.getDB().collection(storeHasCollection).updateOne({
        "storeId": db.getPrimaryKey(req.params.storeId),
        "itemId": db.getPrimaryKey(req.body.itemId),
    }, {$set: {
        "quantity": req.body.quantity || 0,
        "price": req.body.price || 0
    }}, (err, result) => {
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
   db.getDB().collection(storeHasCollection).deleteMany({
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
// GET /api/items?search_term="string"
// Returns if exact match only, case insensitive
router.get('/api/items', (req, res) => {
    // Commented code would return results as long as it matches one word
    // let search_term_keywords = req.body.search_term.split(" ");
    // search_term_keywords.forEach( (search_term, key) => {
    //     search_term_keywords[key] = new RegExp('.*' + search_term + '.*', 'i');
    // });
    // console.log(search_term_keywords);
    db.getDB().collection(itemsCollection).find({
        "name": new RegExp('.*' + req.query.search_term + '.*', 'i')
        //$or: [{ name: { $in: search_term_keywords }}, { brand: { $in: search_term_keywords }}]
    }).toArray((err, result) => {
        res.status(200).send(result);
    })
});

// Add item to items list
// POST /api/items
router.post('/api/items', (req, res) => {
    db.getDB().collection(itemsCollection).insertOne({
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

        res.status(200).send(result.ops[0]._id);
    })
});

// Update item
// PUT /api/items/{itemId}
// TODO: Manually test
router.put('/api/items/:itemId', (req, res) => {
    db.getDB().collection(itemsCollection).updateOne({
        "_id": db.getPrimaryKey(req.params.itemId)
    },
    {$set: {
        "name": req.body.name,
        // "brand": req.body.brand,
        "description": req.body.description,
        "barcode": req.body.barcode,
        "units": req.body.units
    }}, (err, result) => {
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
        itemIds[key] = db.getPrimaryKey(value);
    });

    db.getDB().collection(itemsCollection).deleteMany({
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