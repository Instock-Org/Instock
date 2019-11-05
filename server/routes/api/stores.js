const express = require("express");
const router = express.Router();
const constants = require("../../constants");

const db = require("../../db");
const collection = constants.COLLECTION_STORES;

const maps = require("./maps");

const redisClient = require('redis').createClient;
const redis = redisClient(constants.REDIS_PORT, 'localhost');

/**
 * GET requests
 */

// Get all stores and their details. 
router.get("/", (req, res) => {
    db.getDB().collection(collection).find({}).toArray((err, documents) => {
        if(err){
            res.status(constants.RES_BAD_REQUEST).send(err);
            return; 
        } else {
            res.json(documents);
        }
    });
});

// Get details for a specific store
router.get("/:storeID", (req, res) => {
    const storeID = req.params.storeID;

    db.getDB().collection(collection).find({
        _id : db.getPrimaryKey(storeID)
    }).toArray((err, documents) => {
        if(err){
            res.status(constants.RES_BAD_REQUEST).send(err);
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
// ASSUMES NO AMBIGUITY ON ITEMS: EXACT MATCH ONLY (NOT CASE SENSITIVE)
router.post("/feweststores", (req, res) => {
    
    
    const shoppingList = req.body.shoppingList || []; 
    const latitude = req.body.location ? req.body.location.latitude : constants.DEFAULT_LATITUDE;
    const longitude = req.body.location ? req.body.location.longitude : constants.DEFAULT_LONGITUDE;
    const radiusKm = req.body.radius || constants.DEFAULT_RADIUS_KM;

    // Input checking
    if (shoppingList.length === 0) {
        res.sendStatus(constants.RES_NOT_FOUND);
        return;
    }

    if (latitude > constants.MAX_LATITUDE || latitude < constants.MIN_LATITUDE ||  longitude > constants.MAX_LONGITUDE || longitude < constants.MIN_LONGITUDE) {
        res.sendStatus(constants.RES_BAD_REQUEST);
        return;
    }

    shoppingList.sort();
    
    // This combination of inputs will be used for Redis to identify if it has been searched before
    const redisKey = JSON.stringify({
        "shoppingList": shoppingList,
        "latitude": latitude,
        "longitude": longitude,
        "radiusKm": radiusKm
    });

    redis.get(redisKey, (rediserr, reply) => {
        if (rediserr) {
            res.status(constants.RES_INTERNAL_ERR);
        }
        else if (reply) {
            res.status(constants.RES_OK).send(JSON.parse(reply)); // exists in cache
        }
        else {
            // Calculate long/lat bounds (north, south, west, east)
            // Will assume square instead of circle
            const eastBoundaryLong = longitude + (radiusKm / constants.R_EARTH) * (180.0 / Math.PI) / Math.cos(latitude * Math.PI/180.0);
            const westBoundaryLong = longitude - (radiusKm / constants.R_EARTH) * (180.0 / Math.PI) / Math.cos(latitude * Math.PI/180.0);
            const northBoundaryLat = latitude + (radiusKm / constants.R_EARTH) * (180.0 / Math.PI);
            const southBoundaryLat = latitude - (radiusKm / constants.R_EARTH) * (180.0 / Math.PI);

            var storePickupList = [];

            // Convert each item on shopping list to regex to make it case insensitive
            shoppingList.forEach((searchTerm, key) => {
                shoppingList[key] = new RegExp(searchTerm, "i");
            });

            // Get item IDs by name
            db.getDB().collection(constants.COLLECTION_ITEMS).find({
                "name": { $in: shoppingList }
            }).toArray((itemErr, items) => {
                // Get nearby stores
                if (items.length === 0) {
                    res.sendStatus(constants.RES_NOT_FOUND);
                    return;
                }
                var itemIds = items.map((item) => item._id);
                db.getDB().collection(collection).find({
                    "lat": {
                        $lt: northBoundaryLat,
                        $gt: southBoundaryLat
                    },
                    "lng": {
                        $lt: eastBoundaryLong,
                        $gt: westBoundaryLong
                    }
                }).toArray((storeErr, stores) => {
                    if (stores.length === 0) {
                        res.sendStatus(constants.RES_NOT_FOUND);
                        return;
                    }

                    var storeIds = stores.map((store) => store._id);
                    var storeItems = [];
                    var prunedStoreItems = [];
                    stores.forEach((store) => {
                        storePickupList.push(store);
                        storeItems[store._id] = [];
                    })

                    // Get items that store carries and is on user's shopping list
                    db.getDB().collection(constants.COLLECTION_STOREHAS).find({
                        "storeId": { $in: storeIds },
                        "itemId": { $in: itemIds },
                        "quantity": { $gt: 0 }
                    }, {projection: {_id: 0}}).toArray((storeHasItemErr, storeHasItem) => {
                        storeHasItem.forEach((storeItem, storeId) => {
                            storeItems[storeItem.storeId].push(storeItem.itemId);
                        });

                        // Sort store with most items to fewest
                        var storeItemsSorted = Object.keys(storeItems).map((key) => {
                            return [key, storeItems[key]];
                        }).sort((a, b) => {
                            return b[1].length - a[1].length;
                        });

                        // Remove redundant items. Apply greedy algorithm so that we check the stores that carry the most items first
                        var checkedItems = [];

                        storeItemsSorted.forEach((storeEntry) => {
                            const itemStore = storeEntry[0];
                            const itemList = storeEntry[1];

                            itemList.forEach((item) => {
                                if (!checkedItems.includes(item.toString())) {
                                    checkedItems.push(item.toString());
                                    if (!prunedStoreItems[itemStore]) {
                                        prunedStoreItems[itemStore] = [];
                                    }
                                    prunedStoreItems[itemStore].push(item);
                                }
                            })
                        });

                        // Add item object to the stores collection objects
                        for (const itemStore in prunedStoreItems) {
                            if ({}.hasOwnProperty.call(prunedStoreItems, itemStore)) {
                                const itemList = prunedStoreItems[itemStore];
                                itemList.forEach((storeItem) => {
                                    var itemToAdd = items.filter((item) => item._id.toString() === storeItem.toString())[0];
                                    var storeHasItemFiltered = storeHasItem.filter((storeHas) => storeHas.storeId.toString() === itemStore.toString() && storeHas.itemId.toString() === itemToAdd._id.toString())[0];

                                    var storeToUpdate = storePickupList.filter((store) => store._id.toString() === itemStore.toString())[0];
                                    if (!storeToUpdate.items) {
                                        storeToUpdate.items = [];
                                    }

                                    itemToAdd.quantity = storeHasItemFiltered.quantity;
                                    itemToAdd.price = storeHasItemFiltered.price;
                                    storeToUpdate.items.push(itemToAdd);
                                })
                            }
                        }

                        // Identify stores that we can remove (i.e. the ones with no items to pick up)
                        var positionsToDelete = [];
                        storePickupList.forEach((store, key) => {
                            if (!store.items) {
                                positionsToDelete.push(key);
                            }
                        })

                        // Sort in reverse order to prevent indexing problems during actual deletion
                        positionsToDelete.sort((a,b) => {
                            return b - a;
                        })

                        // Delete the stores identified above
                        positionsToDelete.forEach((key) => {
                            storePickupList.splice(key, 1);
                        })

                        // Send response to client and store in Redis
                        const response = { stores: storePickupList };
                        redis.set(redisKey, JSON.stringify(response), () => {})
                        res.status(constants.RES_OK).send(response);
                    });
                });
            });
        }
    });
    return;
});


// Endpoint for getting nearest stores
router.post("/nearbyStores", (req, res) => {
    const latitude = req.body.location.latitude || constants.DEFAULT_LATITUDE;
    const longitude = req.body.location.longitude || constants.DEFAULT_LONGITUDE;
    const radiusKm = req.body.radius || constants.DEFAULT_RADIUS_KM;

    // Calculate long/lat bounds (north, south, west, east)
    // Will assume square instead of radius
    const eastBoundaryLong = longitude + (radiusKm / constants.R_EARTH) * (180.0 / Math.PI) / Math.cos(latitude * Math.PI/180.0);
    const westBoundaryLong = longitude - (radiusKm / constants.R_EARTH) * (180.0 / Math.PI) / Math.cos(latitude * Math.PI/180.0);
    const northBoundaryLat = latitude  + (radiusKm / constants.R_EARTH) * (180.0 / Math.PI);
    const southBoundaryLat = latitude  - (radiusKm / constants.R_EARTH) * (180.0 / Math.PI);

    db.getDB().collection(collection).find({
        "lat": {
            $lt: northBoundaryLat,
            $gt: southBoundaryLat
        },
        "lng": {
            $lt: eastBoundaryLong,
            $gt: westBoundaryLong
        }
    }).toArray((err, result) => {
        if (result.length === 0) {
            res.sendStatus(constants.RES_NOT_FOUND);
            return;
        }

        var stores = result.map((obj) => {
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
        res.status(constants.RES_OK).send(stores);
    });
})

// Create a store object
router.post("/", (req, res) => {
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
                    res.status(constants.RES_BAD_REQUEST).send(err);
                    return; 
                } else {
                    res.status(constants.RES_OK).send(result.ops[0]._id);
                }
            });
        })
        .catch((err) => {
            res.status(constants.RES_BAD_REQUEST).send(err);
        });
});


/**
 * PUT requests
 */

// Update all details for a specific store
router.put("/:storeID", (req, res) => {
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
        if(err) {
            res.sendStatus(constants.RES_BAD_REQUEST);
        }
        else {
            res.json(result);
        }
    });
});


/**
 * DELETE requests
 */
// Delete a store with store id "storeID"
router.delete("/:storeID", (req, res) => {
    const storeID = req.params.storeID;

    db.getDB().collection(collection).findOneAndDelete(
        {_id : db.getPrimaryKey(storeID)}, 
    (err, result) => {
        if(err) {
            res.sendStatus(constants.RES_INTERNAL_ERR);
        }
        else {
            res.json(result);
        }
    });
});

module.exports = router;