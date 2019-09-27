const express = require('express');
const router = express.Router();

/**
 * GET request
 */
router.get('/api/groceries', (req, res) => {
    res.send("This is the GET request");
});