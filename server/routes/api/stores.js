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
    const east_boundary_long = longitude + (radius_km / R_EARTH) * (180.0 / Math.PI) / Math.cos(latitude * Math.PI/180.0);
    const west_boundary_long = longitude - (radius_km / R_EARTH) * (180.0 / Math.PI) / Math.cos(latitude * Math.PI/180.0);
    const north_boundary_lat = latitude  + (radius_km /  R_EARTH) * (180.0 / Math.PI);
    const south_boundary_lat = latitude  - (radius_km / R_EARTH) * (180.0 / Math.PI);

    // Get item IDs by name
    db.getDB().collection(constants.COLLECTION_ITEMS).find({
        "name": { $in: shoppingList }
    }).toArray((itemErr, items) => {
        // Get nearby stores
        console.log(items);
        if (items.length == 0) {
            res.sendStatus(404);
            return;
        }
        var itemIds = items.map(item => item._id);
        db.getDB().collection(collection).find({
            "lat": {
                $lt: north_boundary_lat,
                $gt: south_boundary_lat
            },
            "lng": {
                $lt: east_boundary_long,
                $gt: west_boundary_long
            }
        }).toArray((storeErr, stores) => {
            if (stores.length == 0) {
                console.log(stores);
                res.sendStatus(404);
                return;
            }
            var storeIds = stores.map(store => store._id);
            var storeItemMapping = {};
            // Initially no items per store
            storeIds.forEach(storeId => {
                storeItemMapping[storeId] = [];
            })
            console.log("Store IDs: " + storeIds);
            console.log("Item IDs: " + itemIds);

            db.getDB().collection(constants.COLLECTION_STOREHAS).find({
                "storeId": { $in: storeIds },
                "itemId": { $in: itemIds },
            }, {projection: {_id: 0}}).toArray((storeHasItemErr, storeHasItem) => {
                console.log(storeHasItem);

                // Put each item into sets (stores)
                storeHasItem.forEach(value => {
                    storeItemMapping[value.storeId.toString()].push(value.itemId.toString());
                })

                var storeMapObj = {
                    storeItemMapping: storeItemMapping
                }

                console.log(storeMapObj);
                res.status(200).send(storeMapObj);
            });
        });
    });
    return;
});


// Endpoint for getting nearest stores
router.post('/nearbyStores', (req, res) => {
    // const userInput = req.body;

    const latitude = req.body.location.latitude || 49.262130;
    const longitude = req.body.location.longitude || -123.250578;
    const radius_km = req.body.radius || 5.0;
    const R_EARTH = 6378.0;

    // Calculate long/lat bounds (north, south, west, east)
    // Will assume square instead of radius
    const east_boundary_long = longitude + (radius_km / R_EARTH) * (180.0 / Math.PI) / Math.cos(latitude * Math.PI/180.0);
    const west_boundary_long = longitude - (radius_km / R_EARTH) * (180.0 / Math.PI) / Math.cos(latitude * Math.PI/180.0);
    const north_boundary_lat = latitude  + (radius_km /  R_EARTH) * (180.0 / Math.PI);
    const south_boundary_lat = latitude  - (radius_km / R_EARTH) * (180.0 / Math.PI);

    db.getDB().collection(collection).find({
        "lat": {
            $lt: north_boundary_lat,
            $gt: south_boundary_lat
        },
        "lng": {
            $lt: east_boundary_long,
            $gt: west_boundary_long
        }
    }).toArray((err, result) => {
        if (result.length == 0) {
            console.log(result);
            res.sendStatus(404);
            return;
        }

        var stores = result.map(obj => {
            var store = {
                storeName: obj.name,
                address: obj.address,
                city: obj.city,
                province: obj.province,
                location: {
                    lat: obj.lat,
                    lng: obj.lng
                }
            }

            return store;
        })
        res.status(200).send(stores);
    });
})

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