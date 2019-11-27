const app = require("../server");
const constants = require("../constants");
const supertest = require("supertest");
const request = supertest(app);

const redis = "../services/redis";

jest.mock("../apiDbHelperUsers");

describe("GET /api/users/{userId}", () => {
    const expected = [{
        _id: "123456123456abcdefabcdef",
        email: "johndoe@someemail.com",
        password: "mypasswordsucks",
        authType: "email"
    }];

    test("Test getting a user retrieves all relevant details", (res) => {
        request.get("/api/users/123456123456abcdefabcdef")
            .set("Accept", "application/json")
            .expect(constants.RES_OK, res)
            .expect(expected, res.body);
    });
});

describe("POST /api/users", () => {
    test("Missing information results in bad request", (res) => {
        const newUser = {
            email: "johndoe@someemail.com",
            authType: "email"
        };

        request.post("/api/users")
            .set("Accept", "application/json")
            .send(newUser)
            .expect(constants.RES_BAD_REQUEST, res);
    });

    test("Complete information results in success", (res) => {
        const newUser = {
            email: "johndoe@someemail.com",
            password: "myPasswordSucks",
            authType: "email"
        };

        request.post("/api/users")
            .set("Accept", "application/json")
            .send(newUser)
            .expect(constants.RES_OK, res);
    });
});

describe("PUT /api/users", () => {
    test("Missing information results in bad request", (res) => {
        const updatedUser = {
            email: "johndoe@someemail.com",
            authType: "email"
        };

        request.put("/api/users/abcdefabcdef123456123456")
            .set("Accept", "application/json")
            .send(updatedUser)
            .expect(constants.RES_BAD_REQUEST, res);
    });

    test("Complete information results in success", (res) => {
        const updatedUser = {
            email: "johndoe@someemail.com",
            password: "B3tterP4$$WurD",
            authType: "email"
        };

        request.put("/api/users/abcdefabcdef123456123456")
            .set("Accept", "application/json")
            .send(updatedUser)
            .expect(constants.RES_OK, res);
    });
});

describe("DELETE /api/users", () => {
    test("Should return OK regardless of whether a user was deleted", (res) => {
        request.delete("/api/users/abcdefabcdef123456123456")
            .set("Accept", "application/json")
            .expect(constants.RES_OK, res);
    });
});

describe("GET /api/users/subscriptions/{userId}", () => {
    test("Should return OK if user has no subscriptions", (res) => {
        const expectedSubscriptions = [];
        request.get("/api/users/subscriptions/abcdefabcdefabcdefabcdef")
            .set("Accept", "application/json")
            .expect(constants.RES_OK, res)
            .expect(expectedSubscriptions, res.body);
    });

    test("Should return OK if user has subscriptions", (res) => {
        const expectedSubscriptions = [{
            storeId: "123123123123123123123123",
            itemId: "321321321321321321321321"
        }, {
            storeId: "abcdefabcdef123123123123",
            itemId: "123456123456123456123456"
        }];

        request.get("/api/users/subscriptions/abcdefabcdef123456123456")
            .set("Accept", "application/json")
            .expect(constants.RES_OK, res)
            .expect(expectedSubscriptions, res.body);
    });
});

describe("POST /api/users/subscriptions", () => {
    test("Should return OK if all fields present", (res) => {
        const body = {
            userId: "abcdefabcdefabcdefabcdef",
            storeId: "abcdefabcdefabcdefabcdef",
            itemId: "abcdefabcdefabcdefabcdef"
        };
        request.post("/api/users/subscriptions")
            .set("Accept", "application/json")
            .send(body)
            .expect(constants.RES_OK, res);
    });

    test("Should return Bad request if missing fields", (res) => {
        const body = {
            userId: "abcdefabcdefabcdefabcdef",
            storeId: "abcdefabcdefabcdefabcdef",
        };

        request.post("/api/users/subscriptions")
            .set("Accept", "application/json")
            .send(body)
            .expect(constants.RES_BAD_REQUEST, res);
    });
});

describe("DELETE /api/users/subscriptions/{userId}/{storeId}/{itemId}", () => {
    test("Should return OK if endpoint is reached regardless of item is deleted or not", (res) => {
        request.delete("/api/users/subscriptions/abcdefabcdef123456123456/abcdefabcdef123456123456/abcdefabcdef123456123456")
            .set("Accept", "application/json")
            .expect(constants.RES_OK, res);
    });
});

afterAll((done) => {
    redis.shutdown;
    done();
});