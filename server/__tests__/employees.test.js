const app = require("../server");
const constants = require("../constants");
const supertest = require("supertest");
const request = supertest(app);

jest.mock("../apiDbHelperEmployees");

describe("GET /api/employees/login", () => {

    test("Employee login successful", (res) => {
        request.get("/api/employees/login")
            .set("Accept", "application/json")
            .query({
                "email": "abc@def.com",
                "password": "abc"
            })
            .expect(constants.RES_OK, res)
            .expect("jsliendldie", res.body);
    });
});