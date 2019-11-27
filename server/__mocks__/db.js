const connect = (cb) => {
    cb();
};

const getPrimaryKey = (_id) => {
    return _id;
};

const getDB = () => {
    return null;
};

module.exports = {
    getDB,
    connect,
    getPrimaryKey
};