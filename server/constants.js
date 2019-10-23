/**
 * This file holds all the constants for ther server.
 */
const dotenv = require('dotenv');
dotenv.config();

/**
 * App Constants
 */
const PORT = process.env.PORT || 8081;

/**
 * Database Constants
 */
const DB_NAME = "instock";
const MONGODB_URL = "mongodb://localhost:27017";
const COLLECTION_STORES = "Stores";
const COLLECTION_STOREHAS = "StoreHas";
const COLLECTION_ITEMS = "Items";
const COLLECTION_USERS = "Users";
const COLLECTION_EMPLOYEES = "Employees";
const COLLECTION_USERSUBSCRIPTIONS = "UserSubscriptions";

/**
 * Other constants
 */
const R_EARTH = 6378.0;

module.exports = {
    API_KEY: process.env.API_KEY,
    PORT,
    DB_NAME,
    MONGODB_URL,
    COLLECTION_STORES,
    COLLECTION_STOREHAS,
    COLLECTION_ITEMS,
    COLLECTION_USERS,
    COLLECTION_EMPLOYEES,
    COLLECTION_USERSUBSCRIPTIONS,
    R_EARTH
};