const express = require("express");
const router = express.Router();
const constants = require("../../constants");

const db = require("../../db");
const dbHelper = require("../../apiDbHelper");

router.use(express.json());

// Gets all the items from a store
// GET /api/items/store/{storeId}
const getItemsByStore = async (req, res) => {
    try {
        let storeId = db.getPrimaryKey(req.params.storeId);
        
        dbHelper.getItemsByStore(storeId, res);
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

        dbHelper.postItemsByStore(storeId, itemId, quantity, price, res);
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

        dbHelper.putItemAtStoreId(storeId, itemId, quantity, price);
    } catch (error) {
        res.status(constants.RES_INTERNAL_ERR).send(error);
    };
};

// Removes items from a store
// DELETE /api/items/store/{storeId}
const deleteItemsFromStore = async (req, res) => {
    try {
        let storeId = req.params.storeId;
        let itemIds = req.body.itemIds;

        dbHelper.deleteItemsFromStore(storeId, itemIds, res);
    } catch (error) {
        res.status(constants.RES_INTERNAL_ERR).send(error);
    }
 };

// Gets items by name or brand. Returns results only if exact match, case insensitive
// GET /api/items?search_term=example+string
const getItemsBySearchTerm = async (req, res) => {
    try {
        let regex = new RegExp(".*" + req.query.search_term + ".*", "i");

        dbHelper.getItemsBySearchTerm(regex, res);
    } catch (error) {
        res.status(constants.RES_INTERNAL_ERR).send(error);
    }
};

// Get items by item IDs
// POST /api/items/multiple
const getMultipleItemsAtStore = async (req, res) => {
    try {
        var itemIds = [];
        req.body.itemIds.forEach((value, key) => {
            itemIds[key] = db.getPrimaryKey(value);
        });

        dbHelper.getMultipleItemsAtStore(itemIds, res);
    } catch (error) {
        res.status(constants.RES_INTERNAL_ERR).send(error);
    }
};

// Add item to items list
// POST /api/items
const postItem = (req, res) => {
    try {
        let name = req.body.name;
        let description = req.body.description;
        let barcode = req.body.barcode;
        let units = req.body.units;

        dbHelper.postItem(name, description, barcode, units, res);
    } catch (error) {
        res.status(constants.RES_INTERNAL_ERR).send(error);
    }
};

// Update item
// PUT /api/items/{itemId}
const putItem = async (req, res) => {
    try {
        let itemId = db.getPrimaryKey(req.params.itemId);
        let name = req.body.name;
        let description = req.body.description;
        let barcode = req.body.barcode;
        let units = req.body.units;

        dbHelper.putItem(itemId, name, description, barcode, units);
    } catch (error) {
        res.status(constants.RES_INTERNAL_ERR).send(error);
    }
};

// Deletes items
// DELETE /api/items
const deleteItems = async (req, res) => {
    try {
        let itemIds = [];
        req.body.itemIds.forEach( (value, key) => {
            itemIds[key] = db.getPrimaryKey(value);
        });

        dbHelper.deleteItems(itemIds, res);
    } catch (error) {
        res.status(constants.RES_INTERNAL_ERR).send(error);
    }
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