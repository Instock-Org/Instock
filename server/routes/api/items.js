const express = require("express");
const router = express.Router();
const constants = require("../../constants");

const db = require("../../db");
const dbHelper = require("../../apiDbHelperItems");

router.use(express.json());

// Gets all the items from a store
// GET /api/items/store/{storeId}
const getItemsByStore = async (req, res) => {
    try {
        const storeId = db.getPrimaryKey(req.params.storeId);

        dbHelper.getItemsByStore(storeId, res);
    } catch (error) {
        res.status(constants.RES_INTERNAL_ERR).send(error);
    }
};

// Adds an item to a store
// POST /api/items/store/{storeId}
const postItemsByStore = async (req, res) => {
    try {
        if (!req.params.storeId || !req.body.itemId) {
            res.sendStatus(constants.RES_BAD_REQUEST);
            return;
        }

        const storeId = db.getPrimaryKey(req.params.storeId);
        const itemId = db.getPrimaryKey(req.body.itemId);      
        const quantity = req.body.quantity || 0;
        const price = req.body.price || 0;

        dbHelper.postItemsByStore(storeId, itemId, quantity, price, res);
    } catch (error) {
        res.status(constants.RES_INTERNAL_ERR).send(error);
    }
};

// Updates a store's availability on an item
// PUT /api/items/store/{storeId}/{itemId}
const putItemAtStoreId = async (req, res) => {
    try {
        const storeId = db.getPrimaryKey(req.params.storeId);
        const itemId = db.getPrimaryKey(req.params.itemId);
        // Maybe we should disallow empty values
        const quantity = req.body.quantity || 0;
        const price = req.body.price || 0;

        dbHelper.putItemAtStoreId(storeId, itemId, quantity, price, res);
    } catch (error) {
        res.status(constants.RES_INTERNAL_ERR).send(error);
    }
};

// Removes items from a store
// DELETE /api/items/store/{storeId}
const deleteItemsFromStore = async (req, res) => {
    try {
        const storeId = req.params.storeId;
        const itemIds = req.body.itemIds;

        dbHelper.deleteItemsFromStore(storeId, itemIds, res);
    } catch (error) {
        res.status(constants.RES_INTERNAL_ERR).send(error);
    }
 };


// Gets items by name or brand. Returns results only if exact match, case insensitive
// GET /api/items?search_term=example+string
const getItemsBySearchTerm = async (req, res) => {
    try {
        const regex = new RegExp(".*" + req.query.search_term + ".*", "i");

        dbHelper.getItemsBySearchTerm(regex, res);
    } catch (error) {
        res.status(constants.RES_INTERNAL_ERR).send(error);
    }
};

const getAllItems = async (req, res) => {
    try {
        dbHelper.getAllItems(req, res);
    } catch (error) {
        res.status(constants.RES_INTERNAL_ERR).send(error);
    }
};

// Get items by item IDs
// POST /api/items/multiple
const getMultipleItems = async (req, res) => {
    try {
        let itemIds = [];
        req.body.itemIds.forEach((value) => {
            itemIds.push(db.getPrimaryKey(value));
        });

        dbHelper.getMultipleItems(itemIds, res);
    } catch (error) {
        res.status(constants.RES_INTERNAL_ERR).send(error);
    }
};

// Add item to items list
// POST /api/items
const postItem = (req, res) => {
    try {
        const name = req.body.name;
        const description = req.body.description;
        const barcode = req.body.barcode;
        const units = req.body.units;

        if (!name || !description || !barcode || !units) {
            res.sendStatus(constants.RES_BAD_REQUEST);
            return;
        }
        
        dbHelper.postItem(name, description, barcode, units, res);
    } catch (error) {
        res.status(constants.RES_INTERNAL_ERR).send(error);
    }
};

// Update item
// PUT /api/items/{itemId}
const putItem = async (req, res) => {
    try {
        const itemId = db.getPrimaryKey(req.params.itemId);
        const name = req.body.name;
        const description = req.body.description;
        const barcode = req.body.barcode;
        const units = req.body.units;

        if (!name || !description || !barcode || !units){
            res.sendStatus(constants.RES_BAD_REQUEST);
            return;
        }

        dbHelper.putItem(itemId, name, description, barcode, units, res);
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

const postRestockItemNotifs = async (req, res) => {
    let storeId = req.params.storeId;
    let itemId = req.params.itemId;

    dbHelper.postRestockItemNotifs(storeId, itemId, res);
};
// Endpoints
router.get("/api/items/store/:storeId", getItemsByStore);
router.post("/api/items/store/:storeId", postItemsByStore);
router.put("/api/items/store/:storeId/:itemId", putItemAtStoreId);
router.delete("/api/items/store/:storeId", deleteItemsFromStore);
router.get("/api/items", getItemsBySearchTerm);
router.get("/api/items/all", getAllItems);
router.post("/api/items/multiple", getMultipleItems);
router.post("/api/items", postItem);
router.put("/api/items/:itemId", putItem);
router.delete("/api/items", deleteItems);
router.post("/api/items/restockNotifs/:storeId/:itemId", postRestockItemNotifs);

module.exports = router;