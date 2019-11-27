const express = require("express");
const router = express.Router();
const constants = require("../../constants");

const db = require("../../db");
const employeesCollection = constants.COLLECTION_EMPLOYEES;
const dbHelper = require("../../apiDbHelperEmployees");

router.use(express.json());

/**
 * POST requests
 */

// Create a employee object
router.post("/", (req, res) => {
    const userInput = req.body;

    dbHelper.createEmployee(userInput, res);
});

router.get("/login", (req, res) => {
    dbHelper.loginEmployee(req,res);
});

module.exports = router;