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
        res.status(constants.RES_OK).send(result);
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
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }

        res.sendStatus(constants.RES_OK);
    })
});

// Updates a store's availability on an item
// PUT /api/items/store/{storeId}/{itemId}
router.put('/api/items/store/:storeId/:itemId', (req, res) => {
    db.getDB().collection(storeHasCollection).updateOne({
        "storeId": db.getPrimaryKey(req.params.storeId),
        "itemId": db.getPrimaryKey(req.params.itemId),
    }, {$set: {
        "quantity": req.body.quantity || 0,
        "price": req.body.price || 0
    }}, (err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }

        res.sendStatus(constants.RES_OK);
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
           res.status(constants.RES_BAD_REQUEST).send(err);
           return;
       }

       res.sendStatus(constants.RES_OK);
   })
});

// Gets items by name or brand. Returns results only if exact match, case insensitive
// GET /api/items?search_term=example+string
router.get('/api/items', (req, res) => {
    db.getDB().collection(itemsCollection).find({
        "name": new RegExp('.*' + req.query.search_term + '.*', 'i')
    }).toArray((err, result) => {
        res.status(constants.RES_OK).send(result);
    })
});

// Get items by item IDs
// POST /api/items/multiple
router.post('/api/items/multiple', (req, res) => {
    var itemIds = [];
    req.body.itemIds.forEach((value, key) => {
        itemIds[key] = db.getPrimaryKey(value);
    });

    db.getDB().collection(itemsCollection).find({
        "_id": {$in: itemIds}
    }).toArray((err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }

        res.status(constants.RES_OK).send(result);
    })
})

// Add item to items list
// POST /api/items
router.post('/api/items', (req, res) => {
    db.getDB().collection(itemsCollection).insertOne({
        "name": req.body.name,
        "description": req.body.description,
        "barcode": req.body.barcode,
        "units": req.body.units
    }, (err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }

        res.status(constants.RES_OK).send(result.ops[0]._id);
    })
});

// Update item
// PUT /api/items/{itemId}
router.put('/api/items/:itemId', (req, res) => {
    db.getDB().collection(itemsCollection).updateOne({
        "_id": db.getPrimaryKey(req.params.itemId)
    },
    {$set: {
        "name": req.body.name,
        "description": req.body.description,
        "barcode": req.body.barcode,
        "units": req.body.units
    }}, (err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }

        res.sendStatus(constants.RES_OK);
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
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }
 
        res.sendStatus(constants.RES_OK);
    })
 });

module.exports = router;