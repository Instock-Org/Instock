const express = require("express");
const router = express.Router();
const constants = require("../../constants");
const storesHelper = require("../../storesHelper");
const maps = require("./maps");
const redis = require("../../services/redis");
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

    redis.redis.get(redisKey, (rediserr, reply) => {
        if (rediserr) {
            res.status(constants.RES_INTERNAL_ERR);
        }
        else if (reply) {
            res.status(constants.RES_OK).send(JSON.parse(reply)); // exists in cache
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
};

const getAllStores = async (req, res) => {

    var clientId = req.query.clientId;
    var token = req.query.token;

    // Get all stores from DB
    dbHelper.getAllStores(clientId, token, res);

};

const getAllStoresWithItemByName = async (req, res) => {
    const regex = new RegExp(".*" + req.query.search_term + ".*", "i");

    try {
        const regex = new RegExp(".*" + req.query.search_term + ".*", "i");

        dbHelper.getAllStoresWithItemByName(regex, res);
    } catch (error) {
        res.status(constants.RES_INTERNAL_ERR).send(error);
    }
};

const getStoreId = (req, res) => {
    const storeID = req.params.storeID;

    dbHelper.getSpecificStore(storeID, res);
};

const postNearbyStores = async (req, res) => {
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
};

const postShortestPath = async (req, res) => {
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
<<<<<<< HEAD
            var overviewPolyline = response.json.routes[0].overview_polyline;
            var waypointOrder = response.json.routes[0].waypoint_order;
	        res.status(constants.RES_OK).json({
                overviewPolyline,
                waypointOrder
            });
=======
            var overviewPolyline = response.json.routes[0].overviewPolyline;
            res.status(constants.RES_OK).send(overviewPolyline);
>>>>>>> f24858bf98d2df78183c6d3788222560d3eb29d4
        })
        .catch((err) => {
            res.status(constants.RES_BAD_REQUEST).send(err);
        });
    
};

const postStore = async (req, res) => {
    const userInput = req.body;

    var addressString = userInput.address 
                        + " " + userInput.city 
                        + " " + userInput.province;

    // call google maps geocoding api
    maps.googleMapsClient.geocode({address: addressString}).asPromise()
        .then((response) => {
            var results = response.json.results;
            
            const address = userInput.address;
            const city = userInput.city;
            const province = userInput.province;
            const name = userInput.name;
            const lat = results[0].geometry.location.lat;
            const lng = results[0].geometry.location.lng;
            const placeId = results[0].place_id;

            dbHelper.postStore(address, city, province, name, lat, lng, placeId);
        })
        .catch((err) => {
            res.status(constants.RES_BAD_REQUEST).send(err);
        });
};

const putStore = async (req, res) => {
    const storeID = req.params.storeID;
    const userInput = req.body;

    const address = userInput.address;
    const city = userInput.city;
    const province = userInput.province;
    const name = userInput.name;

    dbHelper.putStore(storeID, address, city, province, name, res);
};

const deleteStore = async (req, res) => {
    const storeID = req.params.storeID;

    dbHelper.deleteStore(storeID, res);
};


/**
 * GET requests
 */

// Get all stores and their details. 
router.get("/", getAllStores);

// Return all items with given name
router.get("/item", getAllStoresWithItemByName);

// Get details for a specific store
router.get("/:storeID", getStoreId);


/**
 * POST requests
 */

// Get shortest path
router.post("/shortestPath", postShortestPath);

// Given a shopping list and user's location, find all stores nearby that have the items on the shopping list in stock
router.post("/feweststores", complexLogic);

// Endpoint for getting nearest stores
router.post("/nearbyStores", postNearbyStores);

// Create a store object
router.post("/", postStore);


/**
 * PUT requests
 */

// Update all details for a specific store
router.put("/:storeID", putStore);


/**
 * DELETE requests
 */
// Delete a store with store id "storeID"
router.delete("/:storeID", deleteStore);

module.exports = router;
