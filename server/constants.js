/**
 * This file holds all the constants for ther server.
 */

/**
 * App Constants
 */
const PORT = process.env.PORT || 8081;

/**
 * Database Constants
 */
const DB_NAME = "instock";
const MONGODB_URL = "mongodb://localhost:27017";
const COLLECTION_STORES = "stores";

module.exports = {
    PORT,
    DB_NAME,
    MONGODB_URL,
    COLLECTION_STORES
};