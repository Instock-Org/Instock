const app = require("../server");
const constants = require("../constants");
const supertest = require("supertest");
const request = supertest(app);
const storesHelper = require("../storesHelper");

const redis = "../services/redis";

jest.mock("../apiDbHelperStores");
describe("StoresHelper methods", () => {
    test("isValidCoordinates - Invalid coordinates should return false", () => {
        const latitude = 200.123;
        const longitude = 200.123;
        expect(storesHelper.isValidCoordinates(latitude, longitude)).toBe(false);
    });

    test("isValidCoordinates - Valid coordinates should return true", () => {
        const latitude = 49.123;
        const longitude = -123.123;
        expect(storesHelper.isValidCoordinates(latitude, longitude)).toBe(true);
    });

    test("getBoundaryCoordinates - Invalid coordinates should return empty array", () => {
        const latitude = 200.123;
        const longitude = -123.123;
        const radius = 10;
        expect(storesHelper.getBoundaryCoordinates(latitude, longitude, radius)).toStrictEqual([]);
    });

    test("getBoundaryCoordinates - Valid coordinates should return array with coordinates", () => {
        const latitude = 49.123;
        const longitude = -123.123;
        const radius = 10;

        const eastBoundaryLong = longitude + (radius / constants.R_EARTH) * (180.0 / Math.PI) / Math.cos(latitude * Math.PI/180.0);
        const westBoundaryLong = longitude - (radius / constants.R_EARTH) * (180.0 / Math.PI) / Math.cos(latitude * Math.PI/180.0);
        const northBoundaryLat = latitude + (radius / constants.R_EARTH) * (180.0 / Math.PI);
        const southBoundaryLat = latitude - (radius / constants.R_EARTH) * (180.0 / Math.PI);
    
        const expectedReturn = [eastBoundaryLong, westBoundaryLong, northBoundaryLat, southBoundaryLat];
        expect(storesHelper.getBoundaryCoordinates(latitude, longitude, radius)).toStrictEqual(expectedReturn);
    });
});
describe("POST /api/stores/feweststores (Complex Logic)", () => {
    test("Empty shopping list should return not found", (res) => {
        const body = {}; //uses default value empty shopping list

        request.post("/api/stores/feweststores")
            .set("Accept", "application/json")
            .send(body)
            .expect(constants.RES_NOT_FOUND, res);
    });

    test("Invalid coordinates should return bad request", (res) => {
        const body = {
            shoppingList: ["apple"],
            location: {
                latitude: -200,
                longitude: 200
            },
            radius: 2
        };

        request.post("/api/stores/feweststores")
            .set("Accept", "application/json")
            .send(body)
            .expect(constants.RES_BAD_REQUEST, res);
    });

    test("Valid inputs return results", (res) => {
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
        request.post("/api/stores/feweststores")
            .set("Accept", "application/json")
            .send(body)
            .expect(constants.RES_OK, res)
            .expect(expectedResponse, res.body);
    });
});

describe("GET /api/stores/ ", () => {
    test("No client id or token specified", (res) => {
        request.get("/api/stores")
            .set("Accept", "application/json")
            .expect({
                "Error": "Invalid client id or token..."
            }, res);
    });

    test("No token specified", (res) => {
        request.get("/api/stores")
            .set("Accept", "application/json")
            .query({
                "clientId": 12345
            })
            .expect({
                "Error": "Invalid token..."
            }, res);
    });

    test("Successful Request", (res) => {

        request.get("/api/stores")
            .set("Accept", "application/json")
            .query({
                "clientId": 12345,
                "token": "ABC"
            })
            .expect([
                {
                    "_id": "1234",
                    "address": "ABC",
                    "city": "Vancouver",
                    "province": "BC",
                    "name": "Store A",
                    "lat": 49,
                    "lng": -123,
                    "place_id": "AB"
                },
                {
                    "_id": "12345",
                    "address": "ABCD",
                    "city": "Vancouver",
                    "province": "BC",
                    "name": "Store B",
                    "lat": 49,
                    "lng": -123,
                    "place_id": "ABC"
                },
            ], res);
    });
});

describe("GET /api/stores/:storeid ", () => {
    test("Invalid store id specified", (res) => {
        request.get("/api/stores/123")
            .set("Accept", "application/json")
            .expect({
                "Error": "Invalid store id..."
            }, res);
    });

    test("Successful Get specific store Request", (res) => {

        request.get("/api/stores/1234")
            .set("Accept", "application/json")
            .expect([
                {
                    "_id": "1234",
                    "address": "ABC",
                    "city": "Vancouver",
                    "province": "BC",
                    "name": "Store A",
                    "lat": 49,
                    "lng": -123,
                    "place_id": "AB"
                }
            ], res);
    });
});

describe("POST /api/stores/nearbyStores ", () => {
    test("Error: No stores within radius", (res) => {
        const body = {
            "location": {
                "latitude": 49.262130,
                "longtitude": -123.250578
            },
            "radius": 1.0
        };

        request.post("/api/stores/nearbyStores")
            .set("Accept", "application/json")
            .send(body)
            .expect(constants.RES_NOT_FOUND, res);
    });

    test("Success: One store within radius", (res) => {
        const body = {
            "location": {
                "latitude": 49.262130,
                "longtitude": -123.250578
            },
            "radius": 2.0
        };

        request.post("/api/stores/nearbyStores")
            .set("Accept", "application/json")
            .send(body)
            .expect([
                {
                    "storeName": "Save On Foods",
                    "address": "5945 Berton Ave.",
                    "city": "Vancouver",
                    "province": "BC",
                    "location": {
                        "lat": 49.2548294,
                        "lng": -123.2365587
                    }
                }
            ], res);
    });
});

afterAll((done) => {
    redis.shutdown;
    done();
});