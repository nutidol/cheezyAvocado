const express = require('express');
const { pool } = require('../config/config')
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors')
const router = express.Router();
require('../global');

router.use(morgan('dev'));
const io = require('../config/server').io



// test route
router.get('/', (req, res) => {
    res.send('this is from server file!');
});

io.on('connection', function (socket) {
    console.log('User has connected to staffRoutes');
        //ON Events
        socket.on('getOrder' , department => { //wait from frontend(receive from page.html(mockup))
            //query order from that department 
            console.log(department);
        });
    
        //End ON Events
});

// socketGetOrders
    //parameter = String department
    //database querying
    //return orders for that department



// approveOrder route
router.get('/acceptOrder', (req, res, next) => {
    //receive orderid as orderNumber -> frontend also need to send info about orderID!?
    const orderNumber = req.query.orderID;
    //set the order’s status to “approved”
    const query = 'UPDATE "order" SET "status" = \'Approved\' WHERE \"orderID\" = \''+orderNumber+'\'';
    // const query = 'UPDATE "order" SET "status" = \'Order Approved\' WHERE "orderID" = \'2\' ';
    pool.query(query, (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }
        // res.status(200).json(results.row)
        console.log(results);
    res.status(200).json('order approved');
    })
    //TODO: socket emit to frontend
});


// readyOrder route
router.get('/foodFinished', (req, res, next) => {

    //Call avocabot
    let orderID = req.query.orderID;
    //TODO: Query database for departmentName and roomNumber
    const query1 = 'SELECT * FROM order WHERE \"orderID\"=\''+orderID+'\'';
    const departmentID = "";
    const roomNumber = "";
    pool.query(query1, (error, results) => {
        if (error) {
            throw error
          }
        console.log(results)
        departmentID = results.rows[0].departmentID;
        roomNumber = results.rows[0].roomNumber;
    })
    const departmentName = "";
    const query2 = 'SELECT * FROM department WHERE \"departmentID\"=\''+departmentId+'\'';
    pool.query(query2, (error, results) => {
        if (error) {
            throw error
          }
        console.log(results)
        departmentName = results.rows[0].departmentName;
    });
    //let departmentName = req.query.departmentName;
    //let roomNumber = req.query.roomNumber;
    order = new Order(orderID,departmentName,roomNumber);
    queue.addToQueue(order);
    
    res.send('OK');
});


// sendOrder route
router.get('/sendOrder', (req, res) => {
    //1. Send Avocabot
    avocabot.sendAvocabot(); //Warning: Improper called can cause bug in the navigation system
    //2. Socket emit to Guest
    //3. Database : Update status to 'on the way'
    res.send('OK');
});


// router.get('/openLocker', (req, res, next) => {
//     const openLockerStatus = req.query.openLockerStatus; //receive from frontend
//     if(openLockerStatus == 1) { //robot set 0 for locked locker and 1 for opened locker in arduino
//       const openLockerSuccess = avocabot.openLocker();
//         if(openLockerSuccess == true) {
//             res.send('success');
//         } else {
//             res.send('not success') //FIXME: Status 200 shouldn't be used for 'not success'
//         }
//      } else {
//         res.send('not success')
//     }
// })

module.exports = router;