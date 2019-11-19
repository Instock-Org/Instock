const getItemsByStore = async (storeId, res) => {
    // TODO: Move into a separate sample response body file
    let items = [
        {
            storeId: "43dabc123456123456abcdef",
            itemId: "abcfedabcfed654321123456"
        },
        {
            storeId: "43dabc123456123456abcdef",
            itemId: "111122223333444455556666"
        }
    ];
    res.status(200).send(items);
};

const postItemsByStore = async (storeId, itemId, quantity, price, res) => {
    if (itemId == "123456123456abcdefabcdef" && quantity == 5 && price == 2.99) {
        res.sendStatus(200);
    }
    else {
        res.sendStatus(400);
    }
};

const putItemAtStoreId = async (storeId, itemId, quantity, price, res) => {
    // Dummy that always returns 200.
    // TODO: Add proper implementation
    res.sendStatus(200);
};

const getItemsBySearchTerm = async (regex, res) => {
    // Dummy that always returns 200
    // TODO: Add proper implementation
    res.sendStatus(200);
};

module.exports = {
    getItemsByStore,
    postItemsByStore,
    putItemAtStoreId,
    getItemsBySearchTerm
}