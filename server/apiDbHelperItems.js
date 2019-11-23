const db = require("./db");
const constants = require("./constants");
const storeHasCollection = constants.COLLECTION_STOREHAS;
const itemsCollection = constants.COLLECTION_ITEMS;

const getItemsByStore = async (storeId, res) => {
    db.getDB().collection(storeHasCollection).find({
        storeId
    }, {projection: {_id: 0, storeId: 0}}).toArray((err, result) => {
        res.status(constants.RES_OK).send(result);
    });
};

const postItemsByStore = async (storeId, itemId, quantity, price, res) => {
    db.getDB().collection(storeHasCollection).insertOne({
        storeId,
        itemId,
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
        storeId,
        itemId
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
    db.getDB().collection(itemsCollection).find({
        "_id": {$in: itemIds}
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
            var itemNamesArr = result.map(obj => {
                return obj.name;
            })

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
        "_id": itemId
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
    db.getDB().collection(itemsCollection).deleteMany({
        "_id": {$in: itemIds}
    }, (err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        }
 
        res.sendStatus(constants.RES_OK);
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
    getAllItems
}