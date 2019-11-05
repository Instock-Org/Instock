const constants = require("../../constants");
const baseURL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
const key = "&key=" + constants.API_KEY;

const googleMapsClient = require("@google/maps").createClient({
    key: constants.API_KEY,
    Promise: Promise
});

module.exports = {
    googleMapsClient
};