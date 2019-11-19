const express = require("express");
const router = express.Router();
router.use(express.json());

// Gets all the items from a store
// GET /api/items/store/{storeId}
const getItemsByStore = async (req, res) => {
    res.sendStatus(200);
};

// Adds an item to a store
// POST /api/items/store/{storeId}
const postItemsByStore = async (req, res) => {
    res.sendStatus(200);
};

// Updates a store's availability on an item
// PUT /api/items/store/{storeId}/{itemId}
const pushItemAtStoreId = async (req, res) => {
    res.sendStatus(200);
};

// Removes items from a store
// DELETE /api/items/store/{storeId}
const deleteItemsFromStore = async (req, res) => {
    res.sendStatus(200);
 };

// Gets items by name or brand. Returns results only if exact match, case insensitive
// GET /api/items?search_term=example+string
const getItemsBySearchTerm = async (req, res) => {
    res.sendStatus(200);
};

// Get items by item IDs
// POST /api/items/multiple
const getMultipleItemsAtStore = async (req, res) => {
    res.sendStatus(200);
};

// Add item to items list
// POST /api/items
const postItem = (req, res) => {
    res.sendStatus(200);
};

// Update item
// PUT /api/items/{itemId}
const putItem = async (req, res) => {
    res.sendStatus(200);
};

// Deletes items
// DELETE /api/items
const deleteItems = async (req, res) => {
    res.sendStatus(200);
};

// Endpoints
router.get("/api/items/store/:storeId", getItemsByStore);
router.post("/api/items/store/:storeId", postItemsByStore);
router.put("/api/items/store/:storeId/:itemId", pushItemAtStoreId);
router.delete("/api/items/store/:storeId", deleteItemsFromStore);
router.get("/api/items", getItemsBySearchTerm);
router.post("/api/items/multiple", getMultipleItemsAtStore);
router.post("/api/items", postItem);
router.put("/api/items/:itemId", putItem);
router.delete("/api/items", deleteItems);

module.exports = router;