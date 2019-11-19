const express = require("express");
const router = express.Router();
const constants = require("../../constants");

const db = require("../../db");
const dbHelper = require("../../apiDbHelper");
const storeHasCollection = constants.COLLECTION_STOREHAS;
const itemsCollection = constants.COLLECTION_ITEMS;

router.use(express.json());

// Gets all the items from a store
// GET /api/items/store/{storeId}
const getItemsByStore = async (req, res) => {
    try {
        let storeId = db.getPrimaryKey(req.params.storeId);
        await dbHelper.getItemsByStore(storeId, res);
    } catch (error) {
        res.status(constants.RES_INTERNAL_ERR).send(error);
    }
};

// Adds an item to a store
// POST /api/items/store/{storeId}
const postItemsByStore = async (req, res) => {
    try {
        let storeId = db.getPrimaryKey(req.params.storeId);
        let itemId = db.getPrimaryKey(req.body.itemId);
        let quantity = req.body.quantity || 0;
        let price = req.body.price || 0;
        await dbHelper.postItemsByStore(storeId, itemId, quantity, price, res);
    } catch (error) {
        res.status(constants.RES_INTERNAL_ERR).send(error);
    }
};

// Updates a store's availability on an item
// PUT /api/items/store/{storeId}/{itemId}
const putItemAtStoreId = async (req, res) => {
    try {
        let storeId = db.getPrimaryKey(req.params.storeId);
        let itemId = db.getPrimaryKey(req.params.itemId);
        let quantity = req.body.quantity || 0;
        let price = req.body.price || 0;
        await dbHelper.putItemAtStoreId(storeId, itemId, quantity, price);
    } catch (error) {
        res.status(constants.RES_INTERNAL_ERR).send(error);
    };
};

// Removes items from a store
// DELETE /api/items/store/{storeId}
const deleteItemsFromStore = async (req, res) => {
    db.getDB().collection(storeHasCollection).deleteMany({
        "storeId": req.params.storeId,
        "itemId": {$in: req.body.itemIds}
    }, (err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }
 
        res.sendStatus(constants.RES_OK);
    });
 };

// Gets items by name or brand. Returns results only if exact match, case insensitive
// GET /api/items?search_term=example+string
const getItemsBySearchTerm = async (req, res) => {
    let regex = new RegExp(".*" + req.query.search_term + ".*", "i");
    dbHelper.getItemsBySearchTerm(regex, res);
};

// Get items by item IDs
// POST /api/items/multiple
const getMultipleItemsAtStore = async (req, res) => {
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
    });
};

// Add item to items list
// POST /api/items
const postItem = (req, res) => {
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
    });
};

// Update item
// PUT /api/items/{itemId}
const putItem = async (req, res) => {
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
    });
};

// Deletes items
// DELETE /api/items
const deleteItems = async (req, res) => {
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
    });
};

// Endpoints
router.get("/api/items/store/:storeId", getItemsByStore);
router.post("/api/items/store/:storeId", postItemsByStore);
router.put("/api/items/store/:storeId/:itemId", putItemAtStoreId);
router.delete("/api/items/store/:storeId", deleteItemsFromStore);
router.get("/api/items", getItemsBySearchTerm);
router.post("/api/items/multiple", getMultipleItemsAtStore);
router.post("/api/items", postItem);
router.put("/api/items/:itemId", putItem);
router.delete("/api/items", deleteItems);

module.exports = router;