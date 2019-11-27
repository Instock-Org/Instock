const constants = require("../constants");

const loginEmployee = async (req, res) => {
    res.status(constants.RES_OK).send("jsliendldie");
};

const createEmployee = async (userInput, res) => {
    var employeeid = "jdksjdf";
    res.status(constants.RES_OK).send(employeeid);
};

module.exports = {
    loginEmployee,
    createEmployee
};