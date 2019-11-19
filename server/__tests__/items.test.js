const app = require('../server');
const constants = require('../constants');
const supertest = require('supertest');
const request = supertest(app);

jest.mock('../apiDbHelperItems');

// TODO: Move test request objects into a new folder? Some of these are duplicated in the mocks
describe('GET /api/items/store/{storeId}', () => {
    test('Retrieving a list of items that a store carries', (res) => {
        const resItems = [
            {
                storeId: "43dabc123456123456abcdef",
                itemId: "abcfedabcfed654321123456"
            },
            {
                storeId: "43dabc123456123456abcdef",
                itemId: "111122223333444455556666"
            }
        ];

        request.get('/api/items/store/43dabc123456123456abcdef')
            .set("Accept", "application/json")
            .expect(constants.RES_OK, res)
            .expect(resItems, res.body);
    });
});

describe('POST /api/items/store/{storeId}', () => {
    test('Adding item into store - all inputs specified', (res) => {
        const reqBody = {
            itemId: "123456123456abcdefabcdef",
            quantity: 5,
            price: 2.99
        };

        request.post('/api/items/store/43dabc123456123456abcdef')
            .send(reqBody)
            .set("Accept", "application/json")
            .expect(constants.RES_OK, res);
    });

    test('Adding item into store - test default values', (res) => {
        const reqBody = {
            itemId: "123456123456abcdefabcdef"
        };

        request.post('/api/items/store/43dabc123456123456abcdef')
            .send(reqBody)
            .set("Accept", "application/json")
            .expect(constants.RES_OK, res);
    });

    test('Adding item into store - missing itemId', (res) => {
        const reqBody = {
            quantity: 5,
            units: "each"
        };

        request.post('/api/items/store/43dabc123456123456abcdef')
            .send(reqBody)
            .set("Accept", "application/json")
            .expect(constants.RES_BAD_REQUEST, res);
    });
});

describe('PUT /api/items/store/{storeId}/{itemId}', () => {
    test('All values filled out should succeed', (res) => {
        const reqBody = {
            quantity: 5,
            price: 7.99
        };

        request.put('/api/items/store/abcdefabcdefabcdefabcdef/111122223333444455556666')
            .set("Accept", "application/json")
            .send(reqBody)
            .expect(constants.RES_OK, res);
    });

    test('Any missing values should still succeed', (res) => {
        const reqBody = {};

        request.put('/api/items/store/abcdefabcdefabcdefabcdef/111122223333444455556666')
            .set("Accept", "application/json")
            .send(reqBody)
            .expect(constants.RES_OK, res);
    });
});

describe('DELETE /api/items/store/{storeId}', () => {
    test('Empty list should respond with OK', (res) => {
        const deleteList = {
            itemIds: []
        };

        request.delete('/api/items/store/abcdefabcdefabcdefabcdef')
            .set("Accept", "application/json")
            .send(deleteList)
            .expect(constants.RES_OK, res);
    })
});

describe('GET /api/items?search_term=example+string', () => { 
    test('Retrieving items by search term', (res) => {
        const resItems = [
            {
                _id: "111122223333444455556666",
                name: "apple pie",
                description: "Home made apple pie",
                barcode: "002642638034",
                units: "each"
            }
        ];

        request.get('/api/items?search_term=apple+pie')
            .set("Accept", "application/json")
            .expect(constants.RES_OK, res)
            .expect(resItems, res.body);
    });
});

describe('POST /api/items/multiple', () => {
    test('Retrieve item data with specified item IDs', (res) => {
        const returned_items = [
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

        const body = {
            itemIds: [
                "123456123456abcdefabcdef", 
                "aaaaaabbbbbbccccccdddddd"
            ]
        };

        request.post('/api/items/multiple')
            .set("Accept", "application/json")
            .send(body)
            .expect(constants.RES_OK, res)
            .expect(returned_items, res.body);
    });
});

describe('POST /api/items', () => {
    test('Missing values should return bad request', (res) => {
        const body = {};

        request.post('/api/items')
            .set("Accept", "application/json")
            .send(body)
            .expect(constants.RES_BAD_REQUEST, res);
    });

    test('Completed fields and non-duplicated items should succeed', (res) => {
        const EXPECTED_ITEM_ID = "afbc12345678dcba";
        
        const body = {
            name: "Chunk's Ahoy",
            description: "Everyone's favourite cookies",
            barcode: "1234567999",
            units: "650g"
        };

        request.post('/api/items')
            .set("Accept", "application/json")
            .send(body)
            .expect(constants.RES_OK, res)
            .expect(EXPECTED_ITEM_ID, res.body)
    });

    test('Duplicate items (by barcode) should return bad request', (res) => {
        const body = {
            name: "Chip's Ahoy",
            description: "Everyone's favourite cookies",
            barcode: "1234567899",
            units: "650g"
        };

        request.post('/api/items')
            .set("Accept", "application/json")
            .send(body)
            .expect(constants.RES_BAD_REQUEST, res);
    });
});

describe('PUT /api/items/{itemId}', () => {
    test('Missing values should return bad request', (res) => {
        const body = {};

        request.put('/api/items/12345678abcdef12345678ab')
            .set("Accept", "application/json")
            .send(body)
            .expect(constants.RES_BAD_REQUEST, res);
    });

    test('Filled in values should succeed', (res) => {
        const body = {
            name: "Maple syrup",
            description: "Canada's #1",
            barcode: "1234567890",
            units: "500 mL"
        };

        request.put('/api/items/12345678abcdef12345678ab')
            .set("Accept", "application/json")
            .send(body)
            .expect(constants.RES_OK, res);
    });
});

describe('DELETE /api/items/{itemId}', () => {
    test('Empty list should respond with OK', (res) => {
        const deleteList = {
            itemIds: []
        };

        request.delete('/api/items')
            .set("Accept", "application/json")
            .send(deleteList)
            .expect(constants.RES_OK, res);
    });

    test('Nonempty list should respond with OK', (res) => {
        const deleteList = {
            itemIds: [
                "111122223333444455556666",
                "123422223333444455557777"
            ]
        };

        request.delete('/api/items')
            .set("Accept", "application/json")
            .send(deleteList)
            .expect(constants.RES_OK, res);
    });
});