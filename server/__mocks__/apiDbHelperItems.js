const constants = require("../constants");

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
    res.status(constants.RES_OK).send(items);
};

const postItemsByStore = async (storeId, itemId, quantity, price, res) => {
    // Just check for valid inputs
    if (storeId && itemId && quantity >= 0 && price >= 0) {
        res.sendStatus(constants.RES_OK);
        return;
    }

    res.sendStatus(constants.RES_BAD_REQUEST);
};

const putItemAtStoreId = async (storeId, itemId, quantity, price, res) => {
    // Dummy that always returns 200.
    // TODO: Add proper implementation
    res.sendStatus(constants.RES_OK);
};

const deleteItemsFromStore = async (storeId, itemIds, res) => {
    // Dummy that always returns 200
    // TODO: Add proper implementation
    res.sendStatus(constants.RES_OK);
};

const getItemsBySearchTerm = async (regex, res) => {
    const APPLE_PIE = "apple pie";
    
    // TODO: Move into a separate sample response body file
    const items = [
        {
            _id: "111122223333444455556666",
            name: "apple pie",
            description: "Home made apple pie",
            barcode: "002642638034",
            units: "each"
        }
    ];
    
    if (APPLE_PIE.match(regex)) {
        res.status(constants.RES_OK).send(items);
    }
    else {
        return res.sendStatus(constants.RES_BAD_REQUEST);
    }
    
};

// TODO: Needs fixing
const getMultipleItems = async (itemIds, res) => {
    const allItems = [
        {
            _id: "111122223333444455556666",
            name: "apple pie",
            description: "Home made apple pie",
            barcode: "002642638034",
            units: "each"
        },
        {
            _id: "123456123456abcdefabcdef",
            name: "grade a sirloin beef",
            description: "Great for the grill",
            barcode: "002642638035",
            units: "lb"
        },
        {
            _id: "aaaaaabbbbbbccccccdddddd",
            name: "organic banana",
            description: "",
            barcode: "94011",
            units: "lb"
        }
    ];

    let returnedItems = [];
    allItems.forEach((item) => {
        if (itemIds.includes(item._id)) {
            returnedItems.push(item);
        }
    });

    res.status(constants.RES_OK).send(returnedItems);
};

const postItem = async (name, description, barcode, units, res) => {
    const DUMMY_ITEM_ID = "afbc12345678dcba";
    const existingItemsBarcodeOnly = ["1234567899"];

    if (existingItemsBarcodeOnly.includes(barcode)) {
        res.sendStatus(constants.RES_BAD_REQUEST);
        return;
    }

    res.status(constants.RES_OK).send(DUMMY_ITEM_ID);
};

const putItem = async (itemId, name, description, barcode, units, res) => {
    // Dummy that always returns 200
    // TODO: Add proper implementation
    res.sendStatus(constants.RES_OK);
};

const deleteItems = async (itemIds, res) => {
    // Dummy that always returns 200
    // TODO: Add proper implementation
    res.sendStatus(constants.RES_OK);
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
    deleteItems
};