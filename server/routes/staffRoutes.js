const express = require('express');
const { pool } = require('../config/config')
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors')
const router = express.Router();
require('../global');
const Order = require('../classes/order');
const Avocabot = require('../classes/avocabot');

router.use(morgan('dev'));
const io = require('../config/server').io



// test route
router.get('/', (req, res) => {
    res.send('this is from server file!');
});

io.on('connection', function (socket) {
    console.log('User has connected to staffRoutes');
        // //ON Events
        // socket.on('getOrder' , department => { //wait from frontend(receive from page.html(mockup))
        //     //query order from that department 
        //     console.log(department);
        // });
    
        // //End ON Events
});

router.get('/getAmenityOrders', (req, res) => {
    //database querying
    //return orders for that department
    const query = 'SELECT "order"."roomNumber","order"."orderID","amenity"."amenityName","orderAmenity"."amount","order"."timestamp" FROM "order","orderAmenity","amenity" WHERE "order"."orderID"="orderAmenity"."orderID" and "orderAmenity"."amenityID"="amenity"."amenityID"';
    pool.query(query, (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }
        // console.log(results.rows);
        // console.log(results.rowCount);
        //client.publish('frontend/getAmenityOrders', results.rows); //publish to staff app
    res.status(200).json(results.rows);
    })
});

router.get('/getFoodOrders', (req, res) => {
    //database querying
    //return orders for that department
    const query = 'SELECT "order"."roomNumber","order"."orderID","food"."foodName","orderFood"."amount","order"."timestamp" FROM "order","orderFood","food" WHERE "order"."orderID"="orderFood"."orderID" and "orderFood"."foodID"="food"."foodID"';
    pool.query(query, (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }
        // console.log(results.rows);
        // console.log(results.rowCount);
       // client.publish('frontend/getFoodOrders', results.rows);  //publish to staff app
    res.status(200).json(results.rows);
    })
});



// approveOrder route
router.get('/acceptOrder', (req, res, next) => {
    //receive orderid as orderNumber -> frontend also need to send info about orderID!?
    const orderNumber = req.query.orderID;
    //set the order’s status to “approved”
    const query = 'UPDATE "order" SET "status" = \'approved\' WHERE \"orderID\" = \''+orderNumber+'\'';
    pool.query(query, (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }
        // res.status(200).json(results.row)
        console.log('status updated to approved!');
        //console.log(results)
        let message = {
            'orderID': orderID,
            'status': orderStatus.APPROVED
        }
    //3. Publish order status to geust's app
        client.publish('orderStatus',JSON.stringify(message));
        console.log(results.row);
    res.status(200).json('order approved');
    })
});


// readyOrder route
router.get('/foodFinished', (req, res, next) => {
    //Call avocabot
    let orderID = req.query.orderID;
    let departmentName;
    let roomNumber;
    const query = 'select "department"."departmentName", "order"."roomNumber" from "order" , "department" WHERE "order"."orderID" = \''+orderID+'\' and "department"."departmentID" = "order"."departmentID"'
    pool.query(query, (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }
        departmentName = results.rows[0].departmentName;
        roomNumber = results.rows[0].roomNumber;
        console.log(departmentName+','+roomNumber)
        let order = new Order(orderID,departmentName,roomNumber);
        queue.addToQueue(order);
    })
    res.send('OK');
});


// ID = 17
router.get('/sendAvocabot', (req, res) => {
    //1. Close locker
    avocabot.sendAvocabot(); //Warning: Improper called can cause bug in the navigation system
    //2. Database : Update status to 'on the way' 
    const orderID = req.query.orderID;
    const query = 'UPDATE "order" SET "status" = \'on the way\' WHERE "order"."orderID" = \''+orderID+'\'';
    pool.query(query, (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }
        console.log('status updated to on the way!');
        //console.log(results)
        let message = {
            'orderID': orderID,
            'status': orderStatus.ONTHEWAY
        }
    //3. Publish order status to geust's app
        client.publish('orderStatus',JSON.stringify(message));
        // res.status(200).json(results.row)
        console.log(results);
    res.status(200).json('order on the way'); //send to staff app
    })
});

router.get('/openLocker', (req, res, next) => {
    avocabot.openLocker() 
    res.send('OK'); //Every HTTP Get has to have some response.
});

module.exports = router;

// database enum orderStatus: on the way, approved, pending, complete, error
