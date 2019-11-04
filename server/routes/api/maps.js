const constants = require("../../constants");
const baseURL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
const key = "&key=" + constants.API_KEY;

const googleMapsClient = require("@google/maps").createClient({
    key: constants.API_KEY,
    Promise: Promise
});

const geocode = (googleMapsClient, address) => {
    // this.address = address;
    googleMapsClient.geocode({address: address}).asPromise()
        .then((response) => {
            console.log(response.json.results);
            res = response.json.results;
            // return response.json.results;
        })
        .catch((err) => {
            console.log(err);
        });
}

const reverseGeocodeLatLng = (googleMapsClient, lat, lng) => {
    googleMapsClient.reverseGeocode({
        latlng: [lat, lng]
    }).asPromise()
        .then((response) => {
            return response.json.results;
        })
        .catch((err) => {
            console.log(err);
        });
}

const reverseGeocodePlaceId = (googleMapsClient, placeId) => {
    googleMapsClient.reverseGeocode({
        place_id: placeId
    }).asPromise()
        .then((response) => {
            return response.json.results;
        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports = {
    geocode,
    reverseGeocodeLatLng,
    reverseGeocodePlaceId,
    googleMapsClient
};