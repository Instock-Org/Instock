const getItemsByStore = async (req, res) => {
    res.sendStatus(200);
};

const postItemsByStore = async (storeId, itemId, quantity, price, res) => {
    res.sendStatus(200);
};

const getItemsBySearchTerm = async (regex, res) => {
    res.sendStatus(200);
};

module.exports = {
    getItemsByStore,
    postItemsByStore,
    getItemsBySearchTerm
}