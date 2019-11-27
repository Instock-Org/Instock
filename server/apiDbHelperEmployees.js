const db = require("./db");
const constants = require("./constants");
const employeesCollection = constants.COLLECTION_EMPLOYEES;

const loginEmployee = async (req, res) => {
    db.getDB().collection(employeesCollection).find({
        "email": req.query.email,
        "password": req.query.password
    }).toArray((err, documents) => {
        if(err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        } else {
            if(documents.length === 0) {
                res.status(constants.RES_BAD_REQUEST).json({
                    "Error": "Invalid email or password"
                });
            } else {
                res.status(constants.RES_OK).json({
                    "Success": "Login successfull."
                });
            }
        }
    });
};

const createEmployee = async (userInput, res) => {
    db.getDB().collection(employeesCollection).insertOne({
        "email": userInput.email,
        "password": userInput.password,
        "storeid": userInput.storeid,
        "role": userInput.role,
        "username": userInput.username
    }, (err, result) => {
        if (err) {
            res.status(constants.RES_BAD_REQUEST).send(err);
            return;
        } else {
            var employeeid = result.ops[0]._id;
            res.status(constants.RES_OK).send(employeeid);
        }
    });
};

module.exports = {
    createEmployee,
    loginEmployee
};