const constants = require("../constants");

const complexLogic = async (shoppingList, res) => {
    const sampleResponse = {
        "stores": [
            {
                "_id": "5db09cabeea14e2e8ff080ec",
                "address": "321 Water Street",
                "city": "Vancouver",
                "province": "BC",
                "name": "Gastown's",
                "lat": 49.2846566,
                "lng": -123.1093607,
                "place_id": "ChIJnRw5MHhxhlQRGsxOr6JOvCE",
                "items": [
                    {
                        "_id": "5db025340f8f222d3c27943f",
                        "name": "cookies",
                        "description": "Delicious oven-baked goodness",
                        "barcode": "12345678",
                        "units": "800 g",
                        "quantity": 10,
                        "price": "2.50"
                    },
                    {
                        "_id": "5db025670f8f222d3c279440",
                        "name": "apple",
                        "description": "Crispy fruit",
                        "barcode": "3065",
                        "units": "0.5 kg",
                        "quantity": 10,
                        "price": 2.99
                    },
                    {
                        "_id": "5db0258d0f8f222d3c279441",
                        "name": "Banana",
                        "description": "Most popular fruit in the world",
                        "barcode": "4011",
                        "units": "0.3 kg",
                        "quantity": 75,
                        "price": 0.61
                    },
                    {
                        "_id": "5db025d60f8f222d3c279442",
                        "name": "Butter",
                        "description": "Dairy item",
                        "barcode": "26322373235236",
                        "units": "1 L",
                        "quantity": 30,
                        "price": 4.25
                    }
                ]
            }
        ]
    };

    res.status(constants.RES_OK).send(sampleResponse);
}

module.exports = {
    complexLogic
}