const express = require('express');
const router = express.Router();
const constants = require('../../constants');

const db = require('../../db');
const collection = constants.COLLECTION_STORES;


/**
 * GET requests
 */

// Get all stores and their details. 
router.get('/', (req, res) => {
    db.getDB().collection(collection).find({}).toArray((err, documents) => {
        if(err)
            console.log(err);
        else {
            res.json(documents);
        }
    });
});

// Get details for a specific store
router.get('/:storeID', (req, res) => {
    const storeID = req.params.storeID;

    res.send("Received");
});


/**
 * POST requests
 */

// Create a store object
router.post('/', (req, res) => {
    const userInput = req.body;

    db.getDB().collection(collection).insertOne(userInput, 
    (err, result) => {
        if(err)
            console.log(err);
        else {
            res.json(result);
        }
    });
});


/**
 * PUT requests
 */

// Update all details for a specific store
router.put('/:storeID', (req, res) => {
    const storeID = req.params.storeID;
    const userInput = req.body;

    db.getDB().collection(collection).findOneAndUpdate(
        {_id : db.getPrimaryKey(storeID)}, 
        {$set : {
            open: userInput.open,
            city: userInput.city
        }}, 
        {returnOriginal : false}, 
    (err, result) => {
        if(err)
            console.log(err);
        else {
            res.json(result);
        }
    });
});


/**
 * DELETE requests
 */

// Delete a store with store id "storeID"
router.delete('/:storeID', (req, res) => {
    const storeID = req.params.storeID;

    db.getDB().collection(collection).findOneAndDelete(
        {_id : db.getPrimaryKey(storeID)}, 
    (err, result) => {
        if(err)
            console.log(err);
        else {
            res.json(result);
        }
    });
});

module.exports = router;