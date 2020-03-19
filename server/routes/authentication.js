const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const router = express.Router();
router.use(bodyParser.json());


const accessTokenSecret = 'tdJSPrqg3njs38B77KqT';

const authenticatedJWT = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) =>{
            if(err){
                return res.sendStatus(403);
            }
            let currentTS = Date.now();
            let checkIn = user.checkInDate.split('-');
            let checkInDate = new Date(checkIn[0], checkIn[1] -1 , checkIn[2]);
            let checkOut = user.checkOutDate.split('-');
            let checkOutDate = new Date(checkOut[0], checkOut[1] -1 , checkOut[2]);
            if(currentTS - Date.parse(checkInDate) >= 0 && currentTS - Date.parse(checkOutDate) <= 0) {
                req.user = user;
                next();
            }else{
                return res.sendStatus(403);
            }
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
    // query the stay in table for the roomNumber, lastName ans password -> based on the room number 
    console.log(req.body);
    const checkInDate = '2020-03-17';
    const checkOutDate = '2020-03-31';
    const validateGuest = true;
    if(validateGuest){
        const accessToken = jwt.sign({roomNumber: roomNumber, checkInDate: checkInDate, checkOutDate: checkOutDate}, accessTokenSecret)
        res.json({accessToken});
    }else{
        res.send('Incorrect data');
    }
});

router.get('/getService', authenticatedJWT, (req,res) =>{ //return serviceAvailable
    res.send("authenWorkla")
});

module.exports = router;
module.exports = router;
