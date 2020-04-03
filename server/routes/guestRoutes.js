const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const io = require('../config/server').io
const auth = require('./authentication');
const { pool } = require('../config/config');
require('../global');

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
    const guestId = req.query.guestID;
    const query = 'SELECT * FROM "serviceBill" WHERE \"guestID\"=\''+guestId+'\'';
   
    pool.query(query, (error, results) => {
        if (error) {
            throw error
          }
        console.log(results)
        res.status(200).json(results.rows[0].totalAmount)
    })
});

//openRobotLocker
//version 1,, use HTTP
router.get('/openLocker', (req, res, next) => {
    const openLockerStatus = req.query.openLockerStatus; //receive from frontend
    console.log(openLockerStatus);
    if(openLockerStatus==1) { //robot set 0 for locked locker and 1 for opened locker in arduino
        avocabot.openLocker() 
        if(avocabot.lockerIsOpen==true) {
        res.status(200).send('success');
        } else {
            res.status(200).send('not success')
        }
     } else {
        res.status(200).send('not success')
    }
})

router.get('/returnRobot', (req,res,next)=> {
    avocabot.sendAvocabot();
    if(avocabot.callReturnRobot == true) {
        res.status(200).send('success');
    } else {
        res.status(200).send('not success');
    }
})


io.on('connection', function (socket) {
    console.log('User has connected to guestRoutes');
    //ON Events
    // socket.on('openLockerStatus' , openLockerStatus => { //wait from frontend(receive from page.html(mockup))
    //     io.emit('openLockerStatusToRobot', openLockerStatus); //emit to robot(have to change)
    //     console.log(openLockerStatus);
    // });
    // //End ON Events
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
            const ts = Date.now();
            var date_ob = new Date(ts);
            var year = date_ob.getFullYear();
            var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            var date = ("0" + date_ob.getDate()).slice(-2);
            var hours = ("0" + date_ob.getHours()).slice(-2);
            var minutes = ("0" + date_ob.getMinutes()).slice(-2);
            var seconds = ("0" + date_ob.getSeconds()).slice(-2);
            const dateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
            console.log(dateTime);
            if(department == 'food'){

                io.emit('kitchenOrder', order)
                
            }else if (department == 'amenity'){

                io.emit('houseKeepingOrder', order)

            }else{
                res.send('Incorrect department');
            }     

            const query = 'INSERT into "order"("orderID", duration, status, timestamp, "departmentID", "guestID", "invoiceNumber","datetime") VALUES (\''+orderID+'\',\'1\',\'pending\',\''+timestamp+'\',\'1\',\'001\',\'12345678\',\''+dateTime+ '\')';
            pool.query(query, (error, results1) =>{
                if(error){
                    throw error
                }
                if(results1){
                    console.log('inserted');
                    if(department == 'food'){
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
                        res.status(200).json({orderID: orderID.toString()})
                    }else if (department == 'amenity'){
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
                        res.status(200).json({orderID: orderID.toString()})
                    }else{
                        res.send('Incorrect department');
                    }
                }
            })  
        }
    });
});

// router.get('/test', (req,res,) =>{
//     var ts = Date.now();
//     // convert unix timestamp to milliseconds
//     var ts_ms = ts * 1000;
//     var date_ob = new Date(ts);
//     console.log(date_ob);
//     var year = date_ob.getFullYear();
//     var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
//     var date = ("0" + date_ob.getDate()).slice(-2);
//     var hours = ("0" + date_ob.getHours()).slice(-2);
//     var minutes = ("0" + date_ob.getMinutes()).slice(-2);
//     var seconds = ("0" + date_ob.getSeconds()).slice(-2);
//     console.log("Date as YYYY-MM-DD Format: " + year + "-" + month + "-" + date);
//     console.log("Date as YYYY-MM-DD hh:mm:ss Format: " + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
//     res.send('okieee')
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
