const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/config')

const router = express.Router();
router.use(bodyParser.json());


const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenSecretStaff = process.env.ACCESS_TOKEN_SECRET_STAFF;

const authenticatedJWT = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) =>{
            if(err){
                return res.sendStatus(403);
            }
            const {checkInDate, checkOutDate, roomNumber} = user;
            console.log(user);
            let currentTS = Date.now();
            let checkIn = checkInDate.slice(0,10).split('-');
            let checkInDateTimeStamp = new Date(checkIn[0], checkIn[1] -1 , checkIn[2]);
            let checkOut = user.checkOutDate.slice(0,10).split('-');
            let checkOutDateTimeStamp = new Date(checkOut[0], checkOut[1] -1 , checkOut[2]+1);
            if(currentTS - Date.parse(checkInDateTimeStamp) >= 0 && currentTS - Date.parse(checkOutDateTimeStamp) <= 0) {
                req.user = user;
                next();
            }else{
                console.log('in here');
                return res.sendStatus(403);
            }
        })
    }else{
        res.sendStatus(401);
    }
}

const authenticatedJWT2 = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) =>{
            if(err){
                return res.sendStatus(403);
            }
            const {roomNumber, lastName} = user;
            const query = 'SELECT "roomNumber","guestLastName" FROM guest,room WHERE \"roomNumber\"=\''+roomNumber+'\'';
            pool.query(query, (error, results) => {
                if (error) {
                  throw error
                }
                if(results.rows[0]){
                    const {guestLastName} = results.rows[0];
                    const guestRoomNumber = results.rows[0].roomNumber;
                    if(guestLastName == lastName && guestRoomNumber== roomNumber){
                        next();
                    }else{
                        return res.sendStatus(403);
                    }
                }else{
                    return res.sendStatus(403);
                }
            })
        })
    }else{
        res.sendStatus(401);
    }
}

router.get('/', (req, res) => {
    res.send('this is from authen file!');
});


router.post('/guest', (req,res) =>{ //return customerID 
    const {roomNumber, lastName, password} = req.body;
    const query = 'SELECT * FROM guest,room WHERE \"roomNumber\"=\''+roomNumber+'\'';

    pool.query(query, (error, results) => {
        if (error) {
          throw error
        }
        console.log(results.rows[0]);
        if(results.rows[0]){
            const {guestLastName, checkInDate, checkOutDate, guestFirstName} = results.rows[0];
            const guestPassword = results.rows[0].password;
            const guestroomNumber = results.rows[0].roomNumber;
            console.log(guestLastName,checkInDate);
            if(guestLastName == lastName && guestPassword== password){
                console.log('you\'re in ');
                const accessToken = jwt.sign({roomNumber: roomNumber, checkInDate: checkInDate, checkOutDate: checkOutDate, lastName: guestLastName}, accessTokenSecret)
                res.json({accessToken,roomNumber,guestFirstName,guestLastName});
            }else{
                res.send('Incorrect data');
            }
        }else{
            res.send('Incorrect data');
        }
    })

    // console.log(req.body);
    // const checkInDate = '2020-03-17';
    // const checkOutDate = '2020-03-31';
    // const validateGuest = true;
    // if(validateGuest){
    //     const accessToken = jwt.sign({roomNumber: roomNumber, checkInDate: checkInDate, checkOutDate: checkOutDate}, accessTokenSecret)
    //     res.json({accessToken});
    // }else{
    //     res.send('Incorrect data');
    // }
});

const authenticatedStaff = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecretStaff, (err, user) =>{
            if(err){
                return res.sendStatus(403);
            }
            next();
        })
    }else{
        res.sendStatus(401);
    }
}

router.post('/staff', (req,res) =>{
    const {department, password} = req.body;
    const query = 'SELECT * FROM department,room WHERE \"departmentName\"=\''+department+'\'';

    pool.query(query, (error, results) => {
        if (error) {
          throw error
        }
        if(results.rows[0]){
            const {departmentName, departmentID} = results.rows[0];
            const departmentPassword = results.rows[0].password;
            if(departmentName == department && password == departmentPassword){
                const accessToken = jwt.sign({departmentID: departmentID, department: department}, accessTokenSecretStaff)
                res.json({accessToken});
            }else{
                res.send('Incorrect data');
            }
        }else{
            res.send('Incorrect data');
        }
    })
    
});

router.get('/getService', authenticatedJWT, (req,res) =>{ //return serviceAvailable
    res.send("authenWorkla")
});


router.get('/staffAuth', authenticatedStaff, (req,res) =>{
    res.send('staff authen works')
});

module.exports = {router, authenticatedJWT, authenticatedStaff};


