const db = require("./db");
const constants = require("./constants");
const storeHasCollection = constants.COLLECTION_STOREHAS;
const storesCollection = constants.COLLECTION_STORES;
const itemsCollection = constants.COLLECTION_ITEMS;

// Firebase and cloud messaging setup
var admin = require("firebase-admin");
var serviceAccount = require("./instock-1571623676921-firebase-adminsdk-d81uj-ae5ddf39de.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://instock-1571623676921.firebaseio.com"
});


const getItemsByStore = async (storeId, res) => {
    db.getDB().collection(storeHasCollection).find({
        "storeId": db.getPrimaryKey(storeId)
    }, {projection: {_id: 0, storeId: 0}}).toArray((err, result) => {
        res.status(constants.RES_OK).send(result);
    });
};

const postItemsByStore = async (storeId, itemId, quantity, price, res) => {
    db.getDB().collection(storeHasCollection).insertOne({
        "storeId": db.getPrimaryKey(storeId),
        "itemId": db.getPrimaryKey(itemId),
        quantity,
        price
    }, (err, result) => {
        if (err) {
            res.status(constants.RES_INTERNAL_ERR).send(err);
            return;
        }

        res.sendStatus(constants.RES_OK);
    });
};

const putItemAtStoreId = async (storeId, itemId, quantity, price, res) => {
    db.getDB().collection(storeHasCollection).updateOne({
        "storeId": db.getPrimaryKey(storeId),
        "itemId": db.getPrimaryKey(itemId)
    }, {$set: {
        quantity,
        price
    }}, (err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }

        res.sendStatus(constants.RES_OK);
    });
}

const deleteItemsFromStore = async (storeId, itemIds, res) => {
    db.getDB().collection(storeHasCollection).deleteMany({
        storeId,
        "itemId": {$in: itemIds}
    }, (err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }
 
        res.sendStatus(constants.RES_OK);
    });
}
const getItemsBySearchTerm = async (regex, res) => {
    db.getDB().collection(itemsCollection).find({
        "name": regex
    }).toArray((err, result) => {
        res.status(constants.RES_OK).send(result);
    });
};

const getMultipleItems = async (itemIds, res) => {
    let querySafeItemIds = [];
    itemIds.forEach((value) => {
        querySafeItemIds.push(db.getPrimaryKey(value));
    });

    db.getDB().collection(itemsCollection).find({
        "_id": {$in: querySafeItemIds}
    }).toArray((err, result) => {
        if (err) {
            res.status(constants.RES_INTERNAL_ERR).send(err);
            return;
        }

        res.status(constants.RES_OK).send(result);
    });
};

const getAllItems = async (req, res) => {
    db.getDB().collection(itemsCollection).find({}).toArray((err, result) => {
        if (err) {
            res.status(constants.RES_INTERNAL_ERR).send(err);
            return;
        } else {
            var itemNamesArr = result.map((obj) => {
                return obj.name;
            });

            res.status(constants.RES_OK).send(itemNamesArr);
        }
    });
};

const postItem = async (name, description, barcode, units, res) => {
    db.getDB().collection(itemsCollection).insertOne({
        name,
        description,
        barcode,
        units
    }, (err, result) => {
        if (err) {
            res.status(constants.RES_INTERNAL_ERR).send(err);
            return;
        }

        res.status(constants.RES_OK).send(result.ops[0]._id);
    });
};

const putItem = async (itemId, name, description, barcode, units, res) => {
    db.getDB().collection(itemsCollection).updateOne({
        "_id": db.getPrimaryKey(itemId)
    },
    {$set: {
        name,
        description,
        barcode,
        units
    }}, (err, result) => {
        if (err) {
            res.status(constants.RES_INTERNAL_ERR).send(err);
            return;
        }

        res.sendStatus(constants.RES_OK);
    });
};

const deleteItems = async (itemIds, res) => {

    let querySafeItemIds = [];
    itemIds.forEach( (value, key) => {
        querySafeItemIds[key] = db.getPrimaryKey(value);
    });

    db.getDB().collection(itemsCollection).deleteMany({
        "_id": {$in: querySafeItemIds}
    }, (err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }
 
        res.sendStatus(constants.RES_OK);
    });
};

const postRestockItemNotifs = async(storeId, itemId, res) => {
    db.getDB().collection(itemsCollection).find({
        "_id": db.getPrimaryKey(itemId)
    }).toArray((itemerr, item) => {

        if (!item.length){
            res.sendStatus(constants.RES_BAD_REQUEST);
            return;
        }
        
        db.getDB().collection(storesCollection).find({
            "_id": db.getPrimaryKey(storeId)
        }).toArray((storeerr, store) => {
            if (!store.length){
                res.sendStatus(constants.RES_OK);
                return;
            }
            db.getDB().collection(constants.COLLECTION_USERSUBSCRIPTIONS).find({
                "storeId": db.getPrimaryKey(storeId),
                "itemId": db.getPrimaryKey(itemId)
            }, {projection: {_id: 0, storeId: 0, itemId: 0}}).toArray((userSubErr, userIds) => {
                var itemName = item[0].name;
                var storeName = store[0].name;
                
                var registrationToken = "dBunx2SPvzc:APA91bHHyeferFCAAB1z1kEmRSGj00OwXl94ZrjRnkdNEwdryRkgSw-8_bkuFgCDN7qLnRc5bpHzpYBxIi4XhBtkYOhjoAP7DzdBwm1itKgD338B7UvdR1FODvOXM9T2jyidBDNg8udV";
            
                var message = {
                    token: registrationToken,
                    notification: {
                        title: "Item Restock Notification!",
                        body: itemName + " has been re-stocked at " + storeName + "!"
                    }
                };

                // No users subscribing, no push notifications sent
                if (userIds.length === 0){
                    res.sendStatus(constants.RES_NOT_FOUND);
                    return;
                }

                try {
                    // Send a message to the device corresponding to the provided
                    // registration token.
                    admin.messaging().send(message)
                    .then((response) => {
                        // Response is a message ID string.
                        res.sendStatus(constants.RES_OK);
                        return;
                    })
                    .catch((error) => {
                        res.status(constants.RES_INTERNAL_ERR).send(error);
                        return;
                    });
                } catch (error) {
                    res.status(constants.RES_INTERNAL_ERR).send(error);
                    return;
                }
            });
        });
    });
};

module.exports = {
    getItemsByStore,
    postItemsByStore,
    putItemAtStoreId,
    deleteItemsFromStore,
    getItemsBySearchTerm,
    getMultipleItems,
    postItem,
    putItem,
    deleteItems,
    getAllItems,
    postRestockItemNotifs
};