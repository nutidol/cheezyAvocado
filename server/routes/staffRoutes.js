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
    res.send('this is from staff file!');
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


router.get('/getFoodOrders', (req, res) => {
    let query = 'select "order"."orderID","order"."roomNumber","food"."foodName","orderFood"."amount","order"."timestamp","order"."status"' +
                'from "order","orderFood","food"' + 
                'where "orderFood"."orderID" = "order"."orderID" and "orderFood"."foodID" = "food"."foodID" and ("order"."status"=\'pending\' or "order"."status"=\'approved\' or "order"."status" = \'on the way\' or "order"."status" = \'arrived\' or "order"."status" = \'arrived at department\' or "order"."status" = \'on the way to department\' )'
    pool.query(query, (error, results) => {
        if (error) {
            res.send('error'); 
            console.log(error);
            throw error
        }
        let orders = results.rows;
        let currentOrderID;
        let list = [];
        let foodList = [];
        for(let i=0;i<orders.length;i++) {
            let currentObject = orders[i];
            let nextObject = orders[i+1];
            foodList.push({
                'foodName': currentObject.foodName,
                'amount': currentObject.amount
            });
            currentOrderID = currentObject.orderID;
            let status = currentObject.status;
            if(currentOrderID && nextObject && nextObject.orderID != currentOrderID) {
                const currentTS = currentObject.timestamp
                var date_ob = new Date(currentTS);
                var year = date_ob.getFullYear();
                var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                var date = ("0" + date_ob.getDate()).slice(-2);
                var hours = ("0" + date_ob.getHours()).slice(-2);
                var minutes = ("0" + date_ob.getMinutes()).slice(-2);
                var seconds = ("0" + date_ob.getSeconds()).slice(-2);
                const timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

                list.push({
                    'orderID': currentOrderID,
                    'roomNumber': currentObject.roomNumber,
                    'timestamp': timestamp,
                    'orders': foodList,
                    'status' : status
                });
                foodList = [];
                currentOrderID = nextObject.orderID;
            }
        }
        res.status(200).json(list);
    });
});


router.get('/getAmenityOrders', (req, res) => {
    const query = 'SELECT "order"."roomNumber","order"."orderID","amenity"."amenityName","orderAmenity"."amount","order"."timestamp","order"."status" FROM "order","orderAmenity","amenity" WHERE "order"."orderID"="orderAmenity"."orderID" and "orderAmenity"."amenityID"="amenity"."amenityID" and ("order"."status"=\'pending\' or "order"."status"=\'approved\' or "order"."status" = \'on the way\' or "order"."status" = \'arrived\' or "order"."status" = \'arrived at department\' or "order"."status" = \'on the way to department\' )';
    pool.query(query, (error, results) => {
        if (error) {
            res.send('error'); 
            console.log(error);
            throw error
        }
        let orders = results.rows;
        let currentOrderID;
        let list = [];
        let amenityList = [];
        for(let i=0;i<orders.length;i++) {
            let currentObject = orders[i];
            let nextObject = orders[i+1];
            amenityList.push({
                'amenityName': currentObject.amenityName,
                'amount': currentObject.amount
            });
            currentOrderID = currentObject.orderID;
            let status = currentObject.status;
            if(currentOrderID && nextObject && nextObject.orderID != currentOrderID) {
                const currentTS = currentObject.timestamp
                var date_ob = new Date(currentTS);
                var year = date_ob.getFullYear();
                var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                var date = ("0" + date_ob.getDate()).slice(-2);
                var hours = ("0" + date_ob.getHours()).slice(-2);
                var minutes = ("0" + date_ob.getMinutes()).slice(-2);
                var seconds = ("0" + date_ob.getSeconds()).slice(-2);
                const timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

                list.push({
                    'orderID': currentOrderID,
                    'roomNumber': currentObject.roomNumber,
                    'timestamp': timestamp,
                    'orders': amenityList,
                    'status' : status
                });
                amenityList = [];
                currentOrderID = nextObject.orderID;
            }
        }
        res.status(200).json(list);
    });
});


// approveOrder route
router.get('/acceptOrder', (req, res) => {
    //error if no id
    if(!req.query.orderID) {
        res.send('parameter is missing');
    }
    const orderID = req.query.orderID;
    //set the order’s status to “approved”
    const query = 'UPDATE "order" SET "status" = \'approved\' WHERE \"orderID\" = \''+orderID+'\'';
    pool.query(query, (error, results) => {
        if (error) {
            res.send('error'); 
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
    })
    res.status(200).json('order approved');
});


// readyOrder route
router.get('/foodFinished', (req, res, next) => {
    if(!req.query.orderID) {
        res.send('parameter is missing');
    }
    //Call avocabot
    let orderID = req.query.orderID;
    let departmentName;
    let roomNumber;
    const query = 'select "department"."departmentName", "order"."roomNumber" from "order" , "department" WHERE "order"."orderID" = \''+orderID+'\' and "department"."departmentID" = "order"."departmentID"'
    pool.query(query, (error, results) => {
        if (error) {
            throw error
        }
        departmentName = results.rows[0].departmentName;
        roomNumber = results.rows[0].roomNumber;
        console.log(departmentName+','+roomNumber)
        let order = new Order(orderID,departmentName,roomNumber);
        queue.addToQueue(order);
    })
    res.status(200).json('OK');
});


// ID = 17
router.get('/sendAvocabot', (req, res) => {
    if(!req.query.orderID) {
        res.send('parameter is missing');
    }
    //1. Close locker
    avocabot.sendAvocabot(); //Warning: Improper called can cause bug in the navigation system
    //2. Database : Update status to 'on the way' 
    const orderID = req.query.orderID;
    const query = 'UPDATE "order" SET "status" = \'on the way\' WHERE "order"."orderID" = \''+orderID+'\'';
    pool.query(query, (error, results) => {
        if (error) {
            res.send('error'); 
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
    try {
    avocabot.openLocker() 
    res.send('OK'); //Every HTTP Get has to have some response.
    } catch (err) {
        res.status(400).send("error");
    }
});

module.exports = router;

// database enum orderStatus: on the way, approved, pending, complete, error


router.get('/getFoodOrdersOld', (req, res) => {
    const query = 'SELECT "roomNumber","orderID","timestamp" FROM "order" WHERE status = \'pending\' or status = \'approved\' or status = \'on the way\''
    pool.query(query, (error, results)=>{
        if(error){
            throw error
        }
        let value = []; 
        const rows = results.rowCount;
        for(let i=0; i<results.rowCount; i++){
            // console.log(results.rows[i]);
            // const currentOrderID = results.rows[i].orderID
            // const currentRoomNumber = results.rows[i].roomNumber
            const query1 = 'SELECT "foodName","amount" FROM "orderFood","food" WHERE "orderFood"."orderID" = \''+ results.rows[i].orderID +'\' and "orderFood"."foodID"="food"."foodID"'
            // console.log(query1); 
            pool.query(query1, (error, results2)=>{
                    const currentOrderID = results.rows[i].orderID
                    const currentRoomNumber = results.rows[i].roomNumber
                    const currentTS = results.rows[i].timestamp
                    var date_ob = new Date(currentTS);
                    var year = date_ob.getFullYear();
                    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                    var date = ("0" + date_ob.getDate()).slice(-2);
                    var hours = ("0" + date_ob.getHours()).slice(-2);
                    var minutes = ("0" + date_ob.getMinutes()).slice(-2);
                    var seconds = ("0" + date_ob.getSeconds()).slice(-2);
                    const timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
                    if(error){
                        throw error
                    }
                    // console.log(results2);
                    const orderInfo = {
                        orderID : currentOrderID,
                        roomNumber : currentRoomNumber,
                        timestamp: timestamp,
                        orders : results2.rows
                    };
                    value = [...value, orderInfo];
                    if(i== results.rowCount-1){
                        console.log(value);
                        res.status(200).json(value);
                    }
                    // console.log(orderInfo);
            });
            // console.log('this is ' + a);
            // function addToValueJa(a,valueJa){
            //     valueJa = a() + valueJa;
            // };
            // addToValueJa(a,valueJa);
        }
    })
})
