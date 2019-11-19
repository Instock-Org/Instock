const app = require('../server');
const supertest = require('supertest');
const request = supertest(app);

//jest.mock('../routes/api/items');
jest.mock('../apiDbHelper');

describe('Tests for /items endpoints', () => {
    test('Adding an item to a store', (res) => {
        const reqBody = {
            itemId: "123456123456abcdefabcdef",
            quantity: 5,
            price: 2.99
        };

        request.post('/api/items/store/43dabc123456123456abcdef')
            .send(reqBody)
            .set("Accept", "application/json")
            .expect(200, res);
    });

    test('Retrieving a list of items that a store carries', (res) => {
        // TODO: Move into a separate sample response body file
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
            .expect(200, res)
            .expect(resItems, res.body);
    });

    test('Retrieving items by search term', (res) => {
        // TODO: Move into a separate sample response body file
        let resItems = [
            {
                _id: "111122223333444455556666",
                name: "apple pie",
                description: "Home made apple pie",
                barcode: "002642638034",
                units: "500g"
            }
        ];

        request.get('/api/items?search_term=apple+pie')
            .set("Accept", "application/json")
            .expect(200, res)
            .expect(resItems, res.body);
    });
});