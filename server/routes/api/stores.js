const express = require('express');
const router = express.Router();
const constants = require('../../constants');

const db = require('../../db');
const collection = constants.COLLECTION_STORES;

const maps = require('./maps');

// console.log(maps.googleMapsClient);

/**
 * GET requests
 */

// Get all stores and their details. 
router.get('/', (req, res) => {
    db.getDB().collection(collection).find({}).toArray((err, documents) => {
        if(err){
            res.status(400).send(err);
            return; 
        } else {
            res.json(documents);
        }
    });
});

// Get details for a specific store
router.get('/:storeID', (req, res) => {
    const storeID = req.params.storeID;

    db.getDB().collection(collection).find({
        _id : db.getPrimaryKey(storeID)
    }).toArray((err, documents) => {
        if(err){
            res.status(400).send(err);
            return; 
        } else {
            res.json(documents);
        }
    });
});


/**
 * POST requests
 */

// Given a shopping list and user's location, find all stores nearby that have the items on the shopping list in stock
// ASSUMES NO AMBIGUITY AND EXACT MATCH
router.post('/shoppingtrip', (req, res) => {
    const shoppingList = req.body.shoppingList; 
    const latitude = req.body.location.latitude || 49.262130;
    const longitude = req.body.location.longitude || -123.250578;
    const radius_km = req.body.radius || 5.0;
    const R_EARTH = 6378.0

    // Calculate long/lat bounds (north, south, west, east)
    // Will assume square instead of radius
    // TODO: Might need to parse to double
    const north_boundary_lat = longitude + (radius_km / R_EARTH) * (180.0 / Math.PI) / Math.cos(latitude * Math.PI/180.0);
    const south_boundary_lat = longitude - (radius_km / R_EARTH) * (180.0 / Math.PI) / Math.cos(latitude * Math.PI/180.0);
    const west_boundary_long = latitude  + (radius_km /  R_EARTH) * (180.0 / Math.PI);
    const east_boundary_long = latitude  - (radius_km / R_EARTH) * (180.0 / Math.PI);
    console.log(west_boundary_long);
    console.log(east_boundary_long);
    console.log(south_boundary_lat);
    console.log(north_boundary_lat);
    
    // Get item IDs by name
    db.getDB().collection(constants.COLLECTION_ITEMS).find({
        "name": { $in: shoppingList }
    }).toArray((itemErr, items) => {
        // Get nearby stores
        console.log(items);
        if (!items) {
            res.sendStatus(404);
            return;
        }
        var itemIds = items.map(item => item._id);
        db.getDB().collection(collection).find({
            "lat": {
                $lt: south_boundary_lat,
                $gt: north_boundary_lat
            },
            "lng": {
                $lt: west_boundary_long,
                $gt: east_boundary_long
            }
        }).toArray((storeErr, stores) => {
            if (!stores) {
                console.log(stores);
                res.sendStatus(404);
                return;
            }
            var storeIds = stores.map(store => store._id);
            console.log(storeIds);
            console.log(itemIds);
            
            var itemFromStore = {};
            // storeIds.forEach((store) => {
            //     db.getDB().collection(constants.COLLECTION_STOREHAS).find({
            //         "storeId": storeId,
            //         "itemId": {$in: itemIds}
            //     })
            // })

            db.getDB().collection(constants.COLLECTION_STOREHAS).find({
                "storeId": { $in: storeIds },
                "itemId": { $in: itemIds },
            }, {projection: {_id: 0}}).toArray((storeHasItemErr, storeHasItem) => {
                console.log(storeHasItem);
                res.sendStatus(200);
                // Put each item into sets (stores)

                // Sort them by most to least

                // For each store, check if item has already been checked. If not, add store to visit
            })

           
        });
    });
    return;
});

// Create a store object
router.post('/', (req, res) => {
    const userInput = req.body;

    var addressString = userInput.address 
                        + " " + userInput.city 
                        + " " + userInput.province;

    // call google maps geocoding api
    maps.googleMapsClient.geocode({address: addressString}).asPromise()
        .then((response) => {
            var results = response.json.results;
            db.getDB().collection(collection).insertOne({
                "address": userInput.address,
                "city": userInput.city,
                "province": userInput.province,
                "name": userInput.name,
                "lat": results[0].geometry.location.lat,
                "lng": results[0].geometry.location.lng,
                "place_id": results[0].place_id
            }, (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return; 
                } else {
                    res.status(200).send(result.ops[0]._id);
                }
            });
        })
        .catch((err) => {
            res.status(400).send(err);
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
            address: userInput.address,
            city: userInput.city,
            province: userInput.province,
            name: userInput.name
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