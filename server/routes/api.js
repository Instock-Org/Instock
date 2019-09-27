const express = require('express');
const router = express.Router();

/**
 * GET request
 */
router.get('/api/groceries', (req, res) => {
    res.send("This is the GET request");
});

/**
 * POST request
 */
router.post('/api/createGroceries', (req, res) => {
    res.send("This is the POST request");
});

/**
 * PUT request
 */
router.put('/api/updateGroceries', (req, res) => {
    res.send("This is the PUT request");
});

/**
 * DELETE request
 */
router.delete('/api/deleteGroceries', (req, res) => {
    res.send("This is the DELETE request");
});


module.exports = router;