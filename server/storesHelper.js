const constants = require("./constants");
const isValidCoordinates = (latitude, longitude) => {
    return latitude <= constants.MAX_LATITUDE && latitude >= constants.MIN_LATITUDE &&  longitude <= constants.MAX_LONGITUDE && longitude >= constants.MIN_LONGITUDE
}

const getBoundaryCoordinates = (latitude, longitude, radiusKm) => {
    if (!isValidCoordinates(latitude, longitude)) {
        return [];
    }
    
    const eastBoundaryLong = longitude + (radiusKm / constants.R_EARTH) * (180.0 / Math.PI) / Math.cos(latitude * Math.PI/180.0);
    const westBoundaryLong = longitude - (radiusKm / constants.R_EARTH) * (180.0 / Math.PI) / Math.cos(latitude * Math.PI/180.0);
    const northBoundaryLat = latitude + (radiusKm / constants.R_EARTH) * (180.0 / Math.PI);
    const southBoundaryLat = latitude - (radiusKm / constants.R_EARTH) * (180.0 / Math.PI);
    
    return [eastBoundaryLong, westBoundaryLong, northBoundaryLat, southBoundaryLat];
}

module.exports = {
    isValidCoordinates,
    getBoundaryCoordinates
}