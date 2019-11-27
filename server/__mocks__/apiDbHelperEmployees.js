const constants = require("../constants");

const loginEmployee = async (req, res) => {
    res.status(constants.RES_OK).json({
        "Success": "Login successfull."
    });
};

const createEmployee = async (userInput, res) => {
    var employeeid = "jdksjdf";
    res.status(constants.RES_OK).send(employeeid);
};

module.exports = {
    loginEmployee,
    createEmployee
};