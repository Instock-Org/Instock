'use strict';

const express = require("express");
const router = express.Router();

router.use(express.json());

router.get("/api/items/store/:storeId", (req, res) => {
    res.sendStatus(200);
});

router.post("/api/items/store/:storeId", (req, res) => {
    res.sendStatus(200);
});

module.exports = router;