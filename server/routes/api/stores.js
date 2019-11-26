const express = require("express");
const router = express.Router();
const constants = require("../../constants");
const storesHelper = require("../../storesHelper");

const db = require("../../db");
const collection = constants.COLLECTION_STORES;
const authCollection = constants.COLLECTION_AUTH;
const tokenTimeout = constants.TOKEN_TIMEOUT;

const maps = require("./maps");

const redisClient = require("redis").createClient;
const redis = redisClient(constants.REDIS_PORT, "localhost");
const dbHelper = require("../../apiDbHelperStores");

/**
 * GET requests
 */

const complexLogic = async (req, res) => {
    let shoppingList = req.body.shoppingList || []; 
    const latitude = req.body.location ? req.body.location.latitude : constants.DEFAULT_LATITUDE;
    const longitude = req.body.location ? req.body.location.longitude : constants.DEFAULT_LONGITUDE;
    const radiusKm = req.body.radius || constants.DEFAULT_RADIUS_KM;

    // Input checking
    if (shoppingList.length === 0) {
        // TODO: Change to a different response
        res.sendStatus(constants.RES_NOT_FOUND);
        return;
    }

    if (!storesHelper.isValidCoordinates(latitude, longitude)) {
        res.sendStatus(constants.RES_BAD_REQUEST);
        return;
    }

    // Mutate the array to help out with caching so that shopping list won't be redundant
    shoppingList.sort();
    shoppingList = shoppingList.map((keyword) => keyword.toLowerCase());
    
    // This combination of inputs will be used for Redis to identify if it has been searched before
    const redisKey = JSON.stringify({
        shoppingList,
        latitude,
        longitude,
        radiusKm
    });

    redis.get(redisKey, (rediserr, reply) => {
        if (rediserr) {
            res.status(constants.RES_INTERNAL_ERR);
            return;
        }
        else if (reply) {
            res.status(constants.RES_OK).send(JSON.parse(reply)); // exists in cache
            return;
        }
        else {
            // Calculate long/lat bounds (north, south, west, east)
            // Will assume square instead of circle
            const boundaries = storesHelper.getBoundaryCoordinates(latitude, longitude, radiusKm);

            // Convert each item on shopping list to regex to make it case insensitive
            shoppingList.forEach((searchTerm, key) => {
                shoppingList[key] = new RegExp(searchTerm, "i");
            });

            // Get item IDs by name
            dbHelper.complexLogic(shoppingList, boundaries, redisKey, res);
        }
    });
    return;
};

// Get all stores and their details. 
router.get("/", (req, res) => {

    var clientId = req.query.clientId;
    var token = req.query.token;

    // Get all stores from DB
    dbHelper.getAllStores(clientId, token, res);

});

// Get details for a specific store
router.get("/:storeID", (req, res) => {
    const storeID = req.params.storeID;

    dbHelper.getSpecificStore(storeID, res);
});


/**
 * POST requests
 */


// Get shortest path
router.post("/shortestPath", (req, res) => {
    const waypoints = req.body.waypoints;
    const origin = req.body.origin;
    const destination = req.body.destination;

    // call google maps directions api
    maps.googleMapsClient.directions({
        origin,
        waypoints,
        destination,
        optimize: true
    }).asPromise()
        .then((response) => {
            var overview_polyline = response.json.routes[0].overview_polyline;
	    res.status(constants.RES_OK).send(overview_polyline);
        })
        .catch((err) => {
            res.status(constants.RES_BAD_REQUEST).send(err);
        });
    
});


// Given a shopping list and user's location, find all stores nearby that have the items on the shopping list in stock
// ASSUMES NO AMBIGUITY ON ITEMS: EXACT MATCH ONLY (NOT CASE SENSITIVE)
router.post("/feweststores", complexLogic);

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

    dbHelper.nearbyStores(northBoundaryLat, southBoundaryLat, eastBoundaryLong, westBoundaryLong, res);
});

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
