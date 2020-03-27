const express = require('express');
const { pool } = require('../config')
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors')
// setup staff router
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
    
        //End ON Events
});

// socketGetOrders
    //parameter = String department
    //database querying
    //return orders for that department



// approveOrder route
router.get('/approveOrder', (req, res, next) => {
    //receive orderid
    //set the order’s status to “approved”
    const orderNumber = req.body;
    const query = 'UPDATE "order" SET "status" = \'Approved\' WHERE "orderID" = orderNumber';
    pool.query(query, (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }
        // res.status(200).json(results.row)
        console.log(results);
        res.status(200).json({ status: 'success', message: 'Order Approved' })
      })
});

//"0000000001"


// readyOrder route
router.get('/readyOrder', (req, res, next) => {

    const destination = req.body;
    // put the order into the queue

    // set the order’s status to “otw”
    // call the robot to the station 
    // call robot to this department
    // avocabot.js??
    const orderNumber = req.body;
    const query = 'UPDATE "order" SET status = "OnTheWay" WHERE orderID = orderNumber'
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
    // console.log("Req" = req.body)
    const orderNumber = req.body;
    const query = 'DELETE FROM "order" WHERE orderID = orderNumber'
    // const query = 'DELETE FROM "order" WHERE orderID = "0000000001"'
    pool.query(query, (error, results) => {
        if (error) {
          throw error
        }
    //delete that row of orderID from database?
    // res.status(200).json(results.row)
    res.status(200).json({ status: 'success', message: 'Order Sent' })
    })
});



module.exports = router;