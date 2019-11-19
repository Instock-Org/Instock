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
        "storeId": db.getPrimaryKey(req.params.storeId),
        "itemId": db.getPrimaryKey(req.params.itemId),
    }, {$set: {
        "quantity": req.body.quantity || 0,
        "price": req.body.price || 0
    }}, (err, result) => {
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

module.exports = {
    getItemsByStore,
    postItemsByStore,
    putItemAtStoreId,
    getItemsBySearchTerm
}