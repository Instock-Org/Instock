const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const constants = require("./constants");

const dbname = constants.DB_NAME;
const url = constants.MONGODB_URL;

const mongoOptions = {
    useNewUrlParser : true,
    useUnifiedTopology: true
};

const state = {
    db : null
};

const connect = (cb) => {
    if(state.db) {
        cb();
    }
    else  {
        MongoClient.connect(url, mongoOptions, (err, client) => {
            if(err) {
                cb(err);
            }
            else {
                state.db = client.db(dbname);
                state.db.collection(constants.COLLECTION_STOREHAS).createIndex({storeId: 1, itemId: 1}, {unique: true});
                state.db.collection(constants.COLLECTION_ITEMS).createIndex({barcode: 1}, {unique: true});
                state.db.collection(constants.COLLECTION_USERS).createIndex({email: 1, authType: 1}, {unique: true});
                state.db.collection(constants.COLLECTION_USERSUBSCRIPTIONS).createIndex({userId: 1, storeId: 1, itemId: 1}, {unique: true});
                cb();
            }
        })
    }
}

const getPrimaryKey = (_id) => {
    return ObjectID(_id);
}

const getDB = () => {
    return state.db;
}

module.exports = {
    getDB,
    connect,
    getPrimaryKey
};