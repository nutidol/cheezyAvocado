const express = require('express');
const { pool } = require('../config/config')
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors')
const router = express.Router();
require('../global');
const Order = require('../classes/order');

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
    const query = 'SELECT "order"."roomNumber","order"."orderID","amenity"."amenityName","orderAmenity"."amount","order"."timestamp" FROM "order","orderAmenity","amenity" WHERE "order"."orderID"="orderAmenity"."orderID" and "orderAmenity"."amenityID"="amenity"."amenityID" and "order"."status"=\'pending\' or "order"."status"=\'approved\'';
    pool.query(query, (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }
        // console.log(results.rows);
        // console.log(results.rowCount);
    res.status(200).json(results.rows);
    })
});

router.get('/getFoodOrders', (req, res) => {
    //database querying
    //return orders for that department
    const query = 'SELECT "order"."roomNumber","order"."orderID","food"."foodName","orderFood"."amount","order"."timestamp" FROM "order","orderFood","food" WHERE "order"."orderID"="orderFood"."orderID" and "orderFood"."foodID"="food"."foodID" and "order"."status"=\'pending\' or "order"."status"=\'approved\'';
    pool.query(query, (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }
    res.status(200).json(results.rows);
    })
});



// approveOrder route
router.get('/acceptOrder', (req, res, next) => {
    //receive orderid as orderNumber -> frontend also need to send info about orderID!?
    const orderID = req.query.orderID;
    //set the order’s status to “approved”
    const query = 'UPDATE "order" SET "status" = \'approved\' WHERE \"orderID\" = \''+orderID+'\'';
    pool.query(query, (error, results) => {
        if (error) {
            console.log(error);
            throw error
        }
        console.log(results);
        console.log('status updated!');
        let message = {
            'orderID': orderID,
            'status': orderStatus.APPROVED
        }
        //publish order status to geust's app
        client.publish('orderStatus',JSON.stringify(message));
    res.status(200).json('order approved');
    })
});


// // readyOrder route
// router.get('/foodFinished', (req, res, next) => {
//     //Call avocabot
//     let orderID = req.query.orderID;
//     let departmentName;
//     let roomNumber;
//     const query1 = 'SELECT * FROM order WHERE \"orderID\"=\''+orderID+'\'';
//     const departmentID = "";
//     const roomNumber = "";
//     pool.query(query1, (error, results) => {
//         if (error) {
//             throw error
//           }
//         console.log(results)
//         departmentID = results.rows[0].departmentID;
//         roomNumber = results.rows[0].roomNumber;
//     })
//     const departmentName = "";
//     const query2 = 'SELECT * FROM department WHERE \"departmentID\"=\''+departmentId+'\'';
//     pool.query(query2, (error, results) => {
//         if (error) {
//             throw error
//           }
//         console.log(results)
//         departmentName = results.rows[0].departmentName;
//     });
//     //let departmentName = req.query.departmentName;
//     //let roomNumber = req.query.roomNumber;
//     order = new Order(orderID,departmentName,roomNumber);
//     queue.addToQueue(order);
//     res.send('OK');
// });



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




// sendOrder route
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
        console.log('update status!');
        console.log(results)
        let message = {
            'orderID': orderID,
            'status': orderStatus.ONTHEWAY
        }
        client.publish('orderStatus',JSON.stringify(message));
    })
    res.status(200).json('order on the way');
});

router.get('/openLocker', (req, res, next) => {
    // const openLockerStatus = req.query.openLockerStatus; //receive from frontend
    // console.log(openLockerStatus);
    // if(openLockerStatus==1) { //robot set 0 for locked locker and 1 for opened locker in arduino
        avocabot.openLocker() 
    //     if(avocabot.lockerIsOpen==true) {
    //     res.status(200).send('success');
    //     } else {
    //         res.status(200).send('not success')
    //     }
    //  } else {
    //     res.status(200).send('not success')
    // }
        res.send('OK'); //Every HTTP Get has to have some response.
});


module.exports = router;

