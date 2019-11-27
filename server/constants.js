/**
 * This file holds all the constants for ther server.
 */
const dotenv = require("dotenv");
dotenv.config();

/**
 * App Constants
 */
const PORT = process.env.PORT || 8081;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

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
const COLLECTION_AUTH = "Auth";

/**
 * Response Constants
 */
const RES_OK = 200;
const RES_BAD_REQUEST = 400;
const RES_NOT_FOUND = 404;
const RES_INTERNAL_ERR = 500;

/**
 * Other constants
 */
const R_EARTH = 6378.0;
const DEFAULT_LATITUDE = 49.262131;
const DEFAULT_LONGITUDE = -123.250578;
const DEFAULT_RADIUS_KM = 5.0;
const MAX_LATITUDE = 90.0;
const MIN_LATITUDE = -90.0;
const MAX_LONGITUDE = 180.0;
const MIN_LONGITUDE = -180.0;
const TOKEN_TIMEOUT = 10; // 5 mins - 300 seconds

module.exports = {
    API_KEY: process.env.API_KEY,
    GOOGLE_AUTH_CLIENT_ID: process.env.GOOGLE_AUTH_CLIENT_ID,
    GOOGLE_AUTH_SECRET: process.env.GOOGLE_AUTH_SECRET,
    PORT,
    REDIS_PORT,
    DB_NAME,
    MONGODB_URL,
    COLLECTION_STORES,
    COLLECTION_STOREHAS,
    COLLECTION_ITEMS,
    COLLECTION_USERS,
    COLLECTION_EMPLOYEES,
    COLLECTION_USERSUBSCRIPTIONS,
    COLLECTION_AUTH,
    R_EARTH,
    DEFAULT_LATITUDE,
    DEFAULT_LONGITUDE,
    DEFAULT_RADIUS_KM,
    MAX_LATITUDE,
    MIN_LATITUDE,
    MAX_LONGITUDE,
    MIN_LONGITUDE,
    RES_OK,
    RES_BAD_REQUEST,
    RES_NOT_FOUND,
    RES_INTERNAL_ERR,
    TOKEN_TIMEOUT
};