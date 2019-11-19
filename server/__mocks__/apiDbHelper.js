/* START OF ITEMS ENDPOINTS MONGODB MOCKS */
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
    if (storeId == "43dabc123456123456abcdef" && itemId == "123456123456abcdefabcdef" && quantity == 5 && price == 2.99) {
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

const deleteItemsFromStore = async (storeId, itemIds, res) => {
    // Dummy that always returns 200
    // TODO: Add proper implementation
    res.sendStatus(200);
};

const getItemsBySearchTerm = async (regex, res) => {
    const APPLE_PIE = "apple pie";
    let expected_regex = new RegExp(".*apple pie.*", "i");
    
    // TODO: Move into a separate sample response body file
    let items = [
        {
            _id: "111122223333444455556666",
            name: "apple pie",
            description: "Home made apple pie",
            barcode: "002642638034",
            units: "500g"
        }
    ];
    
    if (APPLE_PIE.match(regex)) {
        res.status(200).send(items);
    }
    else {
        return res.sendStatus(400);
    }
    
};

const getMultipleItemsAtStore = async (itemIds, res) => {
    // Dummy that always returns 200
    // TODO: Add proper implementation
    res.sendStatus(200);
};

const postItem = async (name, description, barcode, units, res) => {
    // Dummy that always returns 200
    // TODO: Add proper implementation
    res.sendStatus(200);
};

const putItem = async (itemId, name, description, barcode, units, res) => {
    // Dummy that always returns 200
    // TODO: Add proper implementation
    res.sendStatus(200);
};

const deleteItems = async (itemIds, res) => {
    // Dummy that always returns 200
    // TODO: Add proper implementation
    res.sendStatus(200);
};

module.exports = {
    getItemsByStore,
    postItemsByStore,
    putItemAtStoreId,
    deleteItemsFromStore,
    getItemsBySearchTerm,
    getMultipleItemsAtStore,
    postItem,
    putItem,
    deleteItems
};