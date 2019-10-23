const express = require('express');
const router = express.Router();
const constants = require('../../constants');

const db = require('../../db');
const employeesCollection = constants.COLLECTION_EMPLOYEES;
const usersCollection = constants.COLLECTION_USERS;

router.use(express.json());

// Get all emplyees and their details. 
router.get('/', (req, res) => {
    db.getDB().collection(employeesCollection).find({}).toArray((err, documents) => {
        if(err){
            res.status(400).send(err);
            return; 
        } else {
            res.json(documents);
        }
    });
});

// Get details for a specific employee
router.get('/:userid', (req, res) => {
    const userid = req.params.userid;

    db.getDB().collection(employeesCollection).find({
        userid : db.getPrimaryKey(userid)
    }).toArray((err, documents) => {
        if(err){
            res.status(400).send(err);
            return; 
        } else {
            res.json(documents);
        }
    });
});


/**
 * POST requests
 */

// Create a employee object
router.post('/', (req, res) => {
    const userInput = req.body;

    const storeid = userInput.storeid;
    const role = userInput.role;

    db.getDB().collection(usersCollection).insertOne({
        "email": userInput.email,
        "password": userInput.password,
        "authType": userInput.auth_type
    }, (err, result) => {
        if (err) {
            res.status(400).send(err);
            return;
        } else {
            var userid = result.ops[0]._id;
            db.getDB().collection(employeesCollection).insertOne({
                "userid": userid,
                "storeid": storeid,
                "role": role
            }, (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                } else {
                    res.status(200).send(userid);
                }
            });
        }
    });
});


/**
 * PUT requests
 */

// Update all details for a specific employee
router.put('/:userid', (req, res) => {
    const userid = req.params.userid;
    const userInput = req.body;

    db.getDB().collection(employeesCollection).findOneAndUpdate(
        {userid : db.getPrimaryKey(userid)}, 
        {$set : {
            storeid: userInput.storeid,
            role: userInput.role
        }}, 
        {returnOriginal : false}, 
    (err, result) => {
        if(err)
            console.log(err);
        else {
            res.json(result);
        }
    });
});


/**
 * DELETE requests
 */
// Delete an employee with store id "userid"
router.delete('/:storeID', (req, res) => {
    const storeID = req.params.storeID;

    db.getDB().collection(collection).findOneAndDelete(
        {_id : db.getPrimaryKey(storeID)}, 
    (err, result) => {
        if(err)
            console.log(err);
        else {
            res.json(result);
        }
    });
});

module.exports = router;