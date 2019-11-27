const app = require("../server");
const constants = require("../constants");
const supertest = require("supertest");
const request = supertest(app);

jest.mock("../apiDbHelperAuth");

describe("GET /api/auth/token", () => {

    test("Get token with client id", (res) => {
        request.get("/api/auth/token")
            .set("Accept", "application/json")
            .query({
                "clientId": "12345"
            })
            .expect(constants.RES_OK, res)
            .expect("token", res.body);
    });
});