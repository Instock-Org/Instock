const db = require("./db");
const constants = require("./constants");

const redisClient = require("redis").createClient;
const redis = redisClient(constants.REDIS_PORT, "localhost");

const storeHasCollection = constants.COLLECTION_STOREHAS;
const itemsCollection = constants.COLLECTION_ITEMS;
const storesCollection = constants.COLLECTION_STORES;
const authCollection = constants.COLLECTION_AUTH;
const tokenTimeout = constants.TOKEN_TIMEOUT;

const complexLogic = async (shoppingList, boundaries, res) => {
    const eastBoundaryLong = boundaries[0];
    const westBoundaryLong = boundaries[1];
    const northBoundaryLat = boundaries[2];
    const southBoundaryLat = boundaries[3];
    db.getDB().collection(itemsCollection).find({
        "name": { $in: shoppingList }
    }).toArray((itemErr, items) => {
        // Get nearby stores
        if (items.length === 0) {
            res.sendStatus(constants.RES_NOT_FOUND);
            return;
        }
        var itemIds = items.map((item) => item._id);
        db.getDB().collection(storesCollection).find({
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
            });

            // Get items that store carries and is on user's shopping list
            db.getDB().collection(storeHasCollection).find({
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
                    });
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
                        });
                    }
                }

                // Identify stores that we can remove (i.e. the ones with no items to pick up)
                var positionsToDelete = [];
                storePickupList.forEach((store, key) => {
                    if (!store.items) {
                        positionsToDelete.push(key);
                    }
                });

                // Sort in reverse order to prevent indexing problems during actual deletion
                positionsToDelete.sort((a,b) => {
                    return b - a;
                });

                // Delete the stores identified above
                positionsToDelete.forEach((key) => {
                    storePickupList.splice(key, 1);
                });

                // Send response to client and store in Redis
                const response = { stores: storePickupList };
                redis.set(redisKey, JSON.stringify(response), () => {});
                res.status(constants.RES_OK).send(response);
            });
        });
    });
}

const getAllStores = async (clientId, token, res) => {
    db.getDB().collection(authCollection).find({
        clientId,
        token
    }).toArray((err, result) => {
        if (result.length === 0) {
            res.status(constants.RES_NOT_FOUND).json({
                "Error": "Invalid client id or token..."
            });
            return;
        }

        var oldTimestamp = result[0].timestamp;
        if(Math.floor((Date.now() - oldTimestamp)/1000) > tokenTimeout){
            res.status(constants.RES_INTERNAL_ERR).json({
                "Error": "Invalid token..."
            });
            return; 
        } else {
            db.getDB().collection(storesCollection).find({}).toArray((err, documents) => {
                if(err){
                    res.status(constants.RES_BAD_REQUEST).send(err);
                    return; 
                } else {
                    res.json(documents);
                }
            });
        }
    });
}

const getSpecificStore = async (storeID, res) => {
    db.getDB().collection(storesCollection).find({
        _id : db.getPrimaryKey(storeID)
    }).toArray((err, documents) => {
        if(err){
            res.status(constants.RES_BAD_REQUEST).json({
                "Error": "Invalid store id..."
            });
            return; 
        } else {
            res.json(documents);
        }
    });
}

const nearbyStores = async (northBoundaryLat, southBoundaryLat, eastBoundaryLong, westBoundaryLong, res) => {
    db.getDB().collection(storesCollection).find({
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
            };

            return store;
        });
        res.status(constants.RES_OK).send(stores);
    });
}

module.exports = {
    complexLogic,
    getAllStores,
    getSpecificStore,
    nearbyStores
}