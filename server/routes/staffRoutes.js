const express = require('express');
const { pool } = require('../config/config')
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors')
const router = express.Router();

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
router.get('/approveOrder', (req, res, next) => {
    //receive orderid as orderNumber -> frontend also need to send info about orderID!?
    const orderNumber = req.query.orderID;
    //set the order’s status to “approved”
    const query = 'UPDATE "order" SET "status" = \'Approved\' WHERE "orderID" = orderNumber';
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
router.get('/readyOrder', (req, res, next) => {

    //Get order id 
    //query database -> orderID, departmentName, roomNumber
    //

// call avocabot to the station 
<<<<<<< HEAD
    const {orderID, departmentName, roomNumber, currentPosition} = req.body; 
=======
    const orderID = req.body;
    const query = 'SELECT * FROM "order"  "status" = \'Approved\' WHERE "orderID" = orderNumber';
    
>>>>>>> 911af3924c256f811ffba891e2a0a6285c005ffc
// CALL QueryManager.addDeliveryOrder
// put the order into the queue
    let departmentName = 'Kitchen';
    let roomNumber = '101';
    order = new Order(orderID,departmentName,roomNumber);
    queue.addToQueue(order);
    pool.query(query, (error, results) => {
        if (error) {
            throw error
        }
        // res.status(200).json(results)
        res.status(200).json({ status: 'success', message: 'Order Readied' })
      })
});


// sendOrder route
router.get('/sendOrder', (req, res) => {
    const orderNumber = req.body;
    const query = 'UPDATE "order" SET "status" = \'On the way\' WHERE "orderID" = orderNumber';
    // const query = 'UPDATE "order" SET "status" = \'On the way\' WHERE "orderID" = \'2\'';
    pool.query(query, (error, results) => {
        if (error) {
            throw error
        }
    res.status(200).json({ status: 'success', message: 'Order Sent' })
    })
});

module.exports = router;