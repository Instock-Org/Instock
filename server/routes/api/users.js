const express = require("express");
const router = express.Router();
const constants = require("../../constants");
const dbHelper = require("../../apiDbHelperUsers");
const { OAuth2Client } = require("google-auth-library");

router.use(express.json());

// Get user by id
const getUserById = async (req, res) => {
    const userId = req.params.userId;

    dbHelper.getUserById(userId, res);
};

// Add a single user
const postOneUser = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const authType = req.body.authType;

    if (!email || !password || !authType) {
        res.sendStatus(constants.RES_BAD_REQUEST);
        return;
    }

    dbHelper.postOneUser(email, password, authType, res);
};

// Add a single user
const createUser = async (req, res) => {
    const idToken = req.body.idToken;

    if (!idToken) {
        res.sendStatus(constants.RES_BAD_REQUEST);
        return;
    }

    const client = new OAuth2Client(constants.GOOGLE_AUTH_CLIENT_ID);

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: constants.GOOGLE_AUTH_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const userid = payload["sub"];
        // If request specified a G Suite domain:
        //const domain = payload['hd'];
        if (!userid) {
            res.sendStatus(constants.RES_BAD_REQUEST);
            return;
        } else {
            dbHelper.createUser(userid, res);
            // res.status(constants.RES_OK).send("It works!")
        }
    }
    verify().catch(() => {
        res.sendStatus(constants.RES_BAD_REQUEST);
        return;
    });
};

// Update user
// PUT /api/users/{user_id}
const putUserById = async (req, res) => {
    const userId = req.params.userId;
    const email = req.body.email;
    const password = req.body.password;
    const authType = req.body.authType;

    if (!email || !password || !authType) {
        res.sendStatus(constants.RES_BAD_REQUEST);
        return;
    }

    dbHelper.putUserById(userId, email, password, authType, res);
};

// Deletes a single user by user_id
// DELETE /api/users/{user_id}
const deleteUserById = async (req, res) => {
    const userId = req.params.userId;

    dbHelper.deleteUserById(userId, res);
};

// Get user subscriptions
// GET /api/users/subscriptions/{user_id}
const getUserSubscriptions = async (req, res) => {
    const userId = req.params.userId;

    dbHelper.getUserSubscriptions(userId, res);
};

// Add item to subscription
// POST /api/users/subscriptions
const postItemToSubscription = async (req, res) => {
    if (!req.body.userId || !req.body.storeId || !req.body.itemId) {
        res.sendStatus(constants.RES_BAD_REQUEST);
        return;
    }

    const userId = req.body.userId;
    const storeId = req.body.storeId;
    const itemId = req.body.itemId;

    dbHelper.postItemToSubscription(userId, storeId, itemId, res);
};

// Delete item from subscription
// DELETE /api/users/subscriptions/{user_id}/{store_id}/{item_id}
const deleteItemFromSubscription = async (req, res) => {
    const userId = req.params.userId;
    const storeId = req.params.storeId;
    const itemId = req.params.itemId;

    dbHelper.deleteItemFromSubscription(userId, storeId, itemId, res);
};

// Endpoints
router.get("/api/users/:userId", getUserById);
router.post("/api/users", postOneUser);
router.post("/api/users/createUser", createUser);
router.put("/api/users/:userId", putUserById);
router.delete("/api/users/:userId", deleteUserById);
router.get("/api/users/subscriptions/:userId", getUserSubscriptions);
router.post("/api/users/subscriptions", postItemToSubscription);
router.delete("/api/users/subscriptions/:userId/:storeId/:itemId", deleteItemFromSubscription);

module.exports = router;