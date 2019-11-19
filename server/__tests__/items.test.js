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
        request.get('/api/items/store/43dabc123456123456abcdef')
            .set("Accept", "application/json")
            .expect(200, res);
    });
});