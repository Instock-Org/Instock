const db = require("./db");
const constants = require("./constants");

const redisClient = require("redis").createClient;
const redis = redisClient(constants.REDIS_PORT, "localhost");

const storeHasCollection = constants.COLLECTION_STOREHAS;
const itemsCollection = constants.COLLECTION_ITEMS;
const storesCollection = constants.COLLECTION_STORES;

const complexLogic = async (shoppingList, res) => {
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

module.exports = {
    complexLogic
}