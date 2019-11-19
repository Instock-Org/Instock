const app = require('../server');
const constants = require('../constants');
const supertest = require('supertest');
const request = supertest(app);

jest.mock('../apiDbHelperStores');

describe('POST /api/stores/feweststores (Complex Logic)', () => {
    test('Empty shopping list should return not found', (res) => {
        const body = {}; //uses default value empty shopping list

        request.post('/api/stores/feweststores')
            .set("Accept", "application/json")
            .send(body)
            .expect(constants.RES_NOT_FOUND, res);
    });

    test('Invalid coordinates should return bad request', (res) => {
        const body = {
            shoppingList: ["apple"],
            location: {
                latitude: -200,
                longitude: 200
            },
            radius: 2
        }

        request.post('/api/stores/feweststores')
            .set("Accept", "application/json")
            .send(body)
            .expect(constants.RES_BAD_REQUEST, res);
    });

    test('Valid inputs return something', (res) => {
        const body = {
            "shoppingList": ["cookies", "apple", "banana", "butter"],
	        "radius": 15
        };

        const expectedResponse = {
            "stores": [
                {
                    "_id": "5db09cabeea14e2e8ff080ec",
                    "address": "321 Water Street",
                    "city": "Vancouver",
                    "province": "BC",
                    "name": "Gastown's",
                    "lat": 49.2846566,
                    "lng": -123.1093607,
                    "place_id": "ChIJnRw5MHhxhlQRGsxOr6JOvCE",
                    "items": [
                        {
                            "_id": "5db025340f8f222d3c27943f",
                            "name": "cookies",
                            "description": "Delicious oven-baked goodness",
                            "barcode": "12345678",
                            "units": "800 g",
                            "quantity": 10,
                            "price": "2.50"
                        },
                        {
                            "_id": "5db025670f8f222d3c279440",
                            "name": "apple",
                            "description": "Crispy fruit",
                            "barcode": "3065",
                            "units": "0.5 kg",
                            "quantity": 10,
                            "price": 2.99
                        },
                        {
                            "_id": "5db0258d0f8f222d3c279441",
                            "name": "Banana",
                            "description": "Most popular fruit in the world",
                            "barcode": "4011",
                            "units": "0.3 kg",
                            "quantity": 75,
                            "price": 0.61
                        },
                        {
                            "_id": "5db025d60f8f222d3c279442",
                            "name": "Butter",
                            "description": "Dairy item",
                            "barcode": "26322373235236",
                            "units": "1 L",
                            "quantity": 30,
                            "price": 4.25
                        }
                    ]
                }
            ]
        };

        // Probably the dumbest test ever but I don't want to spend an eternity refactoring this the
        // night before it's due
        request.post('/api/stores/feweststores')
            .set("Accept", "application/json")
            .send(body)
            .expect(constants.RES_OK, res)
            .expect(expectedResponse, res.body);
    });
})