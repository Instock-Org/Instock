const app = require("../server");
const constants = require("../constants");
const supertest = require("supertest");
const request = supertest(app);

const redis = "../services/redis";

jest.mock("../apiDbHelperItems");

// TODO: Move test request objects into a new folder? Some of these are duplicated in the mocks
describe("GET /api/items/store/{storeId}", () => {
    test("Retrieving a list of items that a store carries", async (done) => {
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

        const res = await request.get("/api/items/store/43dabc123456123456abcdef")
            .set("Accept", "application/json");
            
            expect(res.status).toBe(constants.RES_OK);
            expect(res.body).toEqual(resItems);

        done();
    });
});

describe("POST /api/items/store/{storeId}", () => {
    test("Adding item into store - all inputs specified", async (done) => {
        const reqBody = {
            itemId: "123456123456abcdefabcdef",
            quantity: 5,
            price: 2.99
        };

        const res = await request.post("/api/items/store/43dabc123456123456abcdef")
            .send(reqBody)
            .set("Accept", "application/json");
            
        expect(res.status).toBe(constants.RES_OK);

        done();
    });

    test("Adding item into store - test default values", async (done) => {
        const reqBody = {
            itemId: "123456123456abcdefabcdef"
        };

        const res = await request.post("/api/items/store/43dabc123456123456abcdef")
            .send(reqBody)
            .set("Accept", "application/json");
        
        expect(res.status).toBe(constants.RES_OK);

        done();
    });

    test("Adding item into store - missing itemId", async (done) => {
        const reqBody = {
            quantity: 5,
            units: "each"
        };

        const res = await request.post("/api/items/store/43dabc123456123456abcdef")
            .send(reqBody)
            .set("Accept", "application/json");

        expect(res.status).toBe(constants.RES_BAD_REQUEST);

        done();
    });
});

describe("PUT /api/items/store/{storeId}/{itemId}", () => {
    test("All values filled out should succeed", async (done) => {
        const reqBody = {
            quantity: 5,
            price: 7.99
        };

        const res = await request.put("/api/items/store/abcdefabcdefabcdefabcdef/111122223333444455556666")
            .set("Accept", "application/json")
            .send(reqBody);
            
        expect(res.status).toBe(constants.RES_OK);

        done();
    });

    test("Any missing values should still succeed", async (done) => {
        const reqBody = {};

        const res = await request.put("/api/items/store/abcdefabcdefabcdefabcdef/111122223333444455556666")
            .set("Accept", "application/json")
            .send(reqBody);
        
        expect(res.status).toBe(constants.RES_OK);

        done();
    });
});

describe("DELETE /api/items/store/{storeId}", () => {
    test("Empty list should respond with OK", async (done) => {
        const deleteList = {
            itemIds: []
        };

        const res = await request.delete("/api/items/store/abcdefabcdefabcdefabcdef")
            .set("Accept", "application/json")
            .send(deleteList);
        
        expect(res.status).toBe(constants.RES_OK);

        done();
    })
});

describe("GET /api/items?search_term=example+string", () => { 
    test("Retrieving items by search term", async (done) => {
        const resItems = [
            {
                _id: "111122223333444455556666",
                name: "apple pie",
                description: "Home made apple pie",
                barcode: "002642638034",
                units: "each"
            }
        ];

        const res = await request.get("/api/items?search_term=apple+pie")
            .set("Accept", "application/json");
        
        expect(res.status).toBe(constants.RES_OK);
        expect(res.body).toEqual(resItems);

        done();
    });
});

describe("POST /api/items/multiple", () => {
    test("Retrieve item data with specified item IDs", async (done) => {
        const returnedItems = [
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

        const res = await request.post("/api/items/multiple")
            .set("Accept", "application/json")
            .send(body);
        
        expect(res.status).toBe(constants.RES_OK);
        expect(res.body).toEqual(returnedItems);

        done();
    });
});

describe("POST /api/items", () => {
    test("Missing values should return bad request", async (done) => {
        const body = {};

        const res = await request.post("/api/items")
            .set("Accept", "application/json")
            .send(body);

        expect(res.status).toBe(constants.RES_BAD_REQUEST);

        done();
    });

    test("Completed fields and non-duplicated items should succeed", async (done) => {
        const EXPECTED_ITEM_ID = "afbc12345678dcba";
        
        const body = {
            name: "Chunk's Ahoy",
            description: "Everyone's favourite cookies",
            barcode: "1234567999",
            units: "650g"
        };

        const res = await request.post("/api/items")
            .set("Accept", "application/json")
            .send(body);
        
        expect(res.status).toBe(constants.RES_OK);
        expect(res.text).toBe(EXPECTED_ITEM_ID);

        done();
    });

    test("Duplicate items (by barcode) should return bad request", async (done) => {
        const body = {
            name: "Chip's Ahoy",
            description: "Everyone's favourite cookies",
            barcode: "1234567899",
            units: "650g"
        };

        const res = await request.post("/api/items")
            .set("Accept", "application/json")
            .send(body);
        
        expect(res.status).toBe(constants.RES_BAD_REQUEST);

        done();
    });
});

describe("PUT /api/items/{itemId}", () => {
    test("Missing values should return bad request", async (done) => {
        const body = {};

        const res = await request.put("/api/items/12345678abcdef12345678ab")
            .set("Accept", "application/json")
            .send(body);

        expect(res.status).toBe(constants.RES_BAD_REQUEST);

        done();
    });

    test("Filled in values should succeed", async (done) => {
        const body = {
            name: "Maple syrup",
            description: "Canada's #1",
            barcode: "1234567890",
            units: "500 mL"
        };

        const res = await request.put("/api/items/12345678abcdef12345678ab")
            .set("Accept", "application/json")
            .send(body);

        expect(res.status).toBe(constants.RES_OK);

        done();
    });
});

describe("DELETE /api/items/{itemId}", () => {
    test("Empty list should respond with OK", async (done) => {
        const deleteList = {
            itemIds: []
        };

        const res = await request.delete("/api/items")
            .set("Accept", "application/json")
            .send(deleteList);
        
        expect(res.status).toBe(constants.RES_OK);

        done();
    });

    test("Nonempty list should respond with OK", async (done) => {
        const deleteList = {
            itemIds: [
                "111122223333444455556666",
                "123422223333444455557777"
            ]
        };

        const res = await request.delete("/api/items")
            .set("Accept", "application/json")
            .send(deleteList);
        
        expect(res.status).toBe(constants.RES_OK);

        done();
    });
});

afterAll((done) => {
    console.log("reach1");
    redis.shutdown;
    done();
});