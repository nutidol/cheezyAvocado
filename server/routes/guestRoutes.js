const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors')
const io = require('../config/server').io
const auth = require('./authentication');
const { pool } = require('../config/config')

// setup guest router
const router = express.Router();
router.use(morgan('dev'));
router.use(bodyParser.json());

var orderID = 2;


// test route
router.get('/', (req, res) => {
    res.send('this is from guest file!');
});

// getBillPayment route
router.get('/getBillPayments', (req, res, next) => {
    const customerId = req.query.customerId;
    //query db
    res.send('db query results');
});

//openRobotLocker
//version 1,, use HTTP
router.post('/openRobotLocker', (req, res, next) => {
    const openLockerStatus = req.query.openLockerStatus;
    console.log(openLockerStatus);
    if(openLockerStatus=1) { //receive from frontend
    res.send(1); //send to arduino
    //1=openlocker, or call arduino function directly but let robot do is better
    //robot set 0 for locked locker and 1 for opened locker in arduino
    }
})

//openRobotLocker
//version2 use Socket
io.on('connection', function (socket) {
    console.log('User has connected to guestRoutes');
    //ON Events
    socket.on('openLockerStatus' , openLockerStatus => { //wait from frontend(receive from page.html(mockup))
        io.emit('openLockerStatusToRobot', openLockerStatus); //emit to robot(have to change)
        console.log(openLockerStatus);
    });
    //End ON Events
});


module.exports = router;



// PLS DONT DELELT , how to receive parameter from index.js
// var server;
// router.get('/receiveParameter', function(req, res) {
//     var getParameter = req.parameter;
//     server=getParameter.param;
//     res.send(server)
//   });
// place order 

router.post('/placeOrder', (req,res)=>{
    const query = 'SELECT count(*) FROM "order"'
    pool.query(query, (error, results) =>{
        if(error) {
            throw error
        }
        if(results){
            const orderID = parseInt(results.rows[0].count) + 1;
            console.log("orderID is " + orderID);
            const {department, order} = req.body;
            console.log(order)
            const timestamp = '00:00:00'  
            if(department == 'Kitchen'){

                io.emit('kitchenOrder', order)
                
            }else if (department == 'Housekeeping'){
                io.emit('houseKeepingOrder', order)
            }else{
                res.send('Incorrect department');
            }     

            const query = 'INSERT into "order"("orderID", duration, status, timestamp, "departmentID", "guestID", "invoiceNumber") VALUES (\''+orderID+'\',\'1\',\'pending\',\''+timestamp+'\',\'1\',\'001\',\'12345678\')'
            pool.query(query, (error, results1) =>{
                if(error){
                    throw error
                }
                if(results1){
                    console.log('inserted');
                    if(department == 'Kitchen'){
                        for (i = 0; i < order.length; i++) {
                            const thisOrder = order[i]
                            const foodQuery = 'INSERT into "orderFood"("orderID","foodID",amount) VALUES (\''+ orderID+'\',\''+thisOrder.id+'\',\''+thisOrder.amount+'\')'
                            pool.query(foodQuery, (error, results2) =>{
                                if(error){
                                    throw error
                                }
                                if(results2){
                                    console.log('inserted food order '+ i );
                                }
                            });
                        }    
                    }else if (department == 'Housekeeping'){
                        for (i = 0; i < order.length; i++) {
                            const thisOrder = order[i]
                            const housekeepingQuery = 'INSERT into "orderAmenity"("orderID","amenityID",amount) VALUES (\''+ orderID+'\',\''+thisOrder.id+'\',\''+thisOrder.amount+'\')'
                            pool.query(housekeepingQuery, (error, results2) =>{
                                if(error){
                                    throw error
                                }
                                if(results2){
                                    console.log('inserted amenity order '+ i );
                                }
                            });
                        } 
                    }else{
                        res.send('Incorrect department');
                    }
                }
            })  
        }
    });
});

// router.get('/test', getCurrentID, (req,res, ) =>{
//     const currentOrderID = getCurrentID();
//     console.log('current order ID ' + currentOrderID);
// });

// function getCurrentID(){ 
//     const query = 'SELECT count(*) FROM "order"'
//     pool.query(query, (error, results) =>{
//         if(error) {
//             throw error
//         }
//         if(results){
//             console.log(results.rows[0].count);
//             return results.rows[0].count;
//         }
//     });
     
// };

module.exports = router;
