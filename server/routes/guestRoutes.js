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
//var updateKitchenOrder = false;


// test route
router.get('/', (req, res) => {
    res.send('this is from guest file!');
});

// getBillPayment route
//edit parameter to reservationID
//return json results of order using reservatioID
router.get('/getBillPayments', (req, res, next) => {
    const reservationId = req.query.reservationID;
    const query1 = 'SELECT * FROM "serviceBill" WHERE \"reservationID\"=\''+reservationId+'\'';
    var invoicenumber = 0;
    var totalResult = [];
    const result = {};
    var totalOrder = [];
    var count = 0;
    pool.query(query1, (error, results) => {
        if (error) {
            throw error
          }
        console.log(results);
        invoicenumber=results.rows[0].invoiceNumber;
        console.log(invoicenumber);
    
   //-----------------------------------------------------------
        const query2 = 'SELECT * FROM "order" WHERE \"invoiceNumber\"=\''+invoicenumber+'\'';
        const orderId = [];
        pool.query(query2, (error, results1) => {
            if (error) {
                throw error
            }
            console.log(results1);
            console.log(results1.rows.length);
            for(i=0 ; i<results1.rows.length; i++){
                console.log(results1.rows[i].orderID);
                orderId.push(results1.rows[i].orderID);
            } 
            console.log(orderId);
    //--------------------------------------------------------------------------
            //loop in each orderID
            for(i=0;i<orderId.length;i++) {
                const orderId1=orderId[i];
                console.log(orderId[i]);
                console.log(i);
                const list = {};
                list.orderID = orderId1;
                const foodId = [];
                const amount = [];
                const query3 = 'SELECT * FROM "orderFood" WHERE \"orderID\"=\''+orderId1+'\'';
                pool.query(query3, (error, results) => {
                    if (error) {
                        throw error
                    }
                    console.log(results);
                    for(j=0 ; j<results.rows.length; j++){
                        foodId.push(results.rows[j].foodID);
                        amount.push(results.rows[j].amount);
                    } 
                    console.log(foodId);
    //--------------------------------------------------
                    //loop in each foodID array
                    var totalamount = 0;
                    var b = 0;
                    const sublist = {};
                    count++;
                    for(k=0;k<foodId.length; k++) {
                        console.log(k)
                        const foodId1 = foodId[k];
                        console.log(foodId[k])
                        const infor = {};
                        const query4 = 'SELECT * FROM food WHERE \"foodID\"=\''+foodId1+'\'';
                        pool.query(query4, (error, results) => {
                            b++;
                            if (error) {
                                throw error
                            }
                            console.log(results)        
                            infor.foodName = results.rows[0].foodName;
                            infor.price = results.rows[0].price;
                            infor.amount = amount[0];
                            if(b==1) {
                                sublist.order1=infor;
                            }
                            if(b==2) {
                                sublist.order2=infor;
                            }
                            if(b==3) {
                                sublist.order3=infor;
                            }
                            if(b==4) {
                                sublist.order4=infor;
                            }
                            if(b==5) {
                                sublist.order5=infor;
                            }                                
                            totalamount = totalamount+(infor.price*infor.amount);
                            list.totalAmount = totalamount;
                            console.log('here');
                            console.log(list);
                            totalOrder.push(list); 
                            totalOrder = getUnique(totalOrder);
                            console.log(totalOrder);
                            result.totalOrder = totalOrder;
                            console.log(result);
                            totalResult = [];
                            totalResult.push(result);
                            console.log(count);
                            console.log(b);
                            console.log(results1.rows.length)
                            list.orderList = sublist;  
                            if(count == results1.rows.length && b == foodId.length) {
                                res.send(totalResult);
                            }
                        });       
                    }             
                });  
            }
        });
    result.reservationID=reservationId;
    result.totalTotalAmount=results.rows[0].totalAmount;
    });
});

//[{"reservationID":"00000002","totalTotalAmount":930,"totalOrder":[{"orderID":120,"totalAmount":510,"orderList":{"order1":{"foodName":"Prawn Pad Thai","price":170,"amount":3}}},{"orderID":130,"totalAmount":660,"orderList":{"order1":{"foodName":"Chicken Noodle","price":70,"amount":3},"order2":{"foodName":"Chicken Pad Thai","price":150,"amount":3}}}]}]

function getUnique(array){
    var uniqueArray = [];
    
    // Loop through array values
    for(i=0; i < array.length; i++){
        if(uniqueArray.indexOf(array[i]) === -1) {
            uniqueArray.push(array[i]);
        }
    }
    return uniqueArray;
}

//openRobotLocker
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

router.get('/returnRobot', (req,res,next)=> {
    avocabot.sendAvocabot();
    // if(avocabot.callReturnRobot == true) {
    //     res.status(200).send('success');
    // } else {
    //     res.status(200).send('not success');
    // }
    res.send('OK'); //Every HTTP Get has to have some response.
})


io.on('connection', function (socket) {
    console.log('User has connected to guestRoutes');

    //ON Events
    // socket.on('openLockerStatus' , openLockerStatus => { //wait from frontend(receive from page.html(mockup))
    //     io.emit('openLockerStatusToRobot', openLockerStatus); //emit to robot(have to change)
    //     console.log(openLockerStatus);
    // });
    // //End ON Events

    // if(updateKitchenOrder){
    //     io.emit('kitchenOrder','there has been an order');
    //     updateKitchenOrder = false;
    // }

    // io.emit('amenityOrder','there has been an order');
    // //End ON Events
});





// PLS DONT DELELT , how to receive parameter from index.js
// var server;
// router.get('/receiveParameter', function(req, res) {
//     var getParameter = req.parameter;
//     server=getParameter.param;
//     res.send(server)
//   });
// place order 



router.post('/placeOrder', (req,res)=>{
    const {department, order, reservationID, roomNumber,totalCost} = req.body;
    console.log(order)
    const ts = Date.now();
    var date_ob = new Date(ts);
    var year = date_ob.getFullYear();
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var date = ("0" + date_ob.getDate()).slice(-2);
    var hours = ("0" + date_ob.getHours()).slice(-2);
    var minutes = ("0" + date_ob.getMinutes()).slice(-2);
    var seconds = ("0" + date_ob.getSeconds()).slice(-2);
    const timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    console.log(timestamp);
    var departmentID;
    if(department == 'food'){
        // USE mqtt instead of socket
        // io.on('connection', function (socket) {        
        //     io.emit('kitchenOrder','there has been an order');   
        //client.publish('frontend/guest/kitchenOrer', order); //publish to guest app
        client.publish('frontend/staff/updateKitchenOrder','there is a new kitchen order'); //publish to staff app
        departmentID = 1;        
    }else if (department == 'amenity'){
        // USE mqtt instead of socket
        // io.emit('houseKeepingOrder', order)
        //client.publish('frontend/guest/amenityOrder', order); //publish to guest app
        client.publish('frontend/staff/updateAmenityOrder','there is a new amenity order'); //publish to staff app
        departmentID = 2; 

    }else{
        res.send('Incorrect department');
    } 
    
    if(department == 'food'){
        const queryFood = 'INSERT into "order"(status, timestamp,"roomNumber", "departmentID") VALUES (\'pending\',\''+timestamp+'\',\''+roomNumber+'\',\''+'1'+ '\')';
        pool.query(queryFood, (error, results1) =>{
            if(error){
                throw error
            }
            if(results1){
                console.log('inserted');
                const getOrderIDQuery = 'select \"orderID\" from \"order\" where \"timestamp\"=\''+timestamp+ '\';';
                pool.query(getOrderIDQuery,(error,results4) =>{
                    if(error){
    
                    }
                    if(results4){
                        console.log(results4.rows[0].orderID);
                        const currentOrderID = results4.rows[0].orderID; 
                            for (i = 0; i < order.length; i++) {
                                const thisOrder = order[i]
                                const foodQuery = 'INSERT into "orderFood"("orderID","foodID",amount) VALUES (\''+ currentOrderID+'\',\''+thisOrder.id+'\',\''+thisOrder.amount+'\')';
                                pool.query(foodQuery, (error, results2) =>{
                                    if(error){
                                        throw error
                                    }
                                    if(results2){
                                        console.log('inserted food order '+ i );
                                    }
                                });
                            }
                            console.log('the reservation id is ' + reservationID);
                            const serviceBillQuery = 'select "invoiceNumber","totalAmount" from "serviceBill" where "reservationID" =\''+reservationID+'\''
                            pool.query(serviceBillQuery, (error, results5) =>{
                                if(error){
                                    throw error
                                }
                                if(results5){
                                    // console.log(results5)
                                    if(results5.rowCount==0){
                                        const newServiceBillQuery = 'INSERT into "serviceBill"(timestamp,"totalAmount","reservationID") VALUES (\''+timestamp+'\',\''+totalCost+'\',\''+reservationID+'\')';
                                        pool.query(newServiceBillQuery,(error, results6) =>{
                                            if(error){
                                                throw error
                                            }else{
                                                console.log('a new service bill has been created');
                                            }
                                        })
                                    }else{
                                        const newTotal = parseInt(totalCost)+ parseInt(results5.rows[0].totalAmount);
                                        const updateBillQuery = 'UPDATE "serviceBill" SET "totalAmount" = \''+newTotal+'\' where "reservationID"=\''+reservationID+'\'';
                                        pool.query(updateBillQuery, (error, results7)=>{
                                            if(error){
                                                throw error
                                            } else{
                                                console.log('the service bill has been updated');
                                            }
                                        });
                            
                                    }
                                } 
                            });
                            res.status(200).json({orderID: currentOrderID});                         
                        
                    }
                })
            }    
        });

    }else if (department == 'amenity'){
        const queryAmenity = 'INSERT into "order"(status, timestamp,"roomNumber", "departmentID") VALUES (\'pending\',\''+timestamp+'\',\''+roomNumber+'\',\''+'2'+ '\')';
        pool.query(queryAmenity, (error, results1) =>{
            if(error){
                throw error
            }
            if(results1){
                console.log('inserted');
                const getOrderIDQuery = 'select \"orderID\" from \"order\" where \"timestamp\"=\''+timestamp+ '\';';
                pool.query(getOrderIDQuery,(error,results4) =>{
                    if(error){
    
                    }
                    if(results4){
                        console.log(results4.rows[0].orderID);
                        const currentOrderID = results4.rows[0].orderID;
                            for (i = 0; i < order.length; i++) {
                                const thisOrder = order[i]
                                const housekeepingQuery = 'INSERT into "orderAmenity"("orderID","amenityID",amount) VALUES (\''+ currentOrderID+'\',\''+thisOrder.id+'\',\''+thisOrder.amount+'\')'
                                pool.query(housekeepingQuery, (error, results2) =>{
                                    if(error){
                                        throw error
                                    }
                                    if(results2){
                                        console.log('inserted amenity order '+ i );
                                    }
                                });
                             } 
                            res.status(200).json({orderID: currentOrderID});
                    }
                })
            }    
        });
    }


    //This one is in case of back up -> will delete soon after testing with the whole system 

    // const query = 'INSERT into "order"(status, timestamp,"roomNumber", "departmentID") VALUES (\'pending\',\''+timestamp+'\',\''+roomNumber+'\',\''+'1'+ '\')';
    // pool.query(query, (error, results1) =>{
    //     if(error){
    //         throw error
    //     }
    //     if(results1){
    //         console.log('inserted');
    //         const getOrderIDQuery = 'select \"orderID\" from \"order\" where \"timestamp\"=\''+timestamp+ '\';';
    //         pool.query(getOrderIDQuery,(error,results4) =>{
    //             if(error){

    //             }
    //             if(results4){
    //                 console.log(results4.rows[0].orderID);
    //                 const currentOrderID = results4.rows[0].orderID;
    //                 if(department == 'food'){   
    //                     for (i = 0; i < order.length; i++) {
    //                         const thisOrder = order[i]
    //                         const foodQuery = 'INSERT into "orderFood"("orderID","foodID",amount) VALUES (\''+ currentOrderID+'\',\''+thisOrder.id+'\',\''+thisOrder.amount+'\')';
    //                         pool.query(foodQuery, (error, results2) =>{
    //                             if(error){
    //                                 throw error
    //                             }
    //                             if(results2){
    //                                 console.log('inserted food order '+ i );
    //                             }
    //                         });
    //                     }
    //                     console.log('the reservation id is ' + reservationID);
    //                     const serviceBillQuery = 'select "invoiceNumber","totalAmount" from "serviceBill" where "reservationID" =\''+reservationID+'\''
    //                     pool.query(serviceBillQuery, (error, results5) =>{
    //                         if(error){
    //                             throw error
    //                         }
    //                         if(results5){
    //                             // console.log(results5)
    //                             if(results5.rowCount==0){
    //                                 const newServiceBillQuery = 'INSERT into "serviceBill"(timestamp,"totalAmount","reservationID") VALUES (\''+timestamp+'\',\''+totalCost+'\',\''+reservationID+'\')';
    //                                 pool.query(newServiceBillQuery,(error, results6) =>{
    //                                     if(error){
    //                                         throw error
    //                                     }else{
    //                                         console.log('a new service bill has been created');
    //                                     }
    //                                 })
    //                             }else{
    //                                 const newTotal = parseInt(totalCost)+ parseInt(results5.rows[0].totalAmount);
    //                                 const updateBillQuery = 'UPDATE "serviceBill" SET "totalAmount" = \''+newTotal+'\' where "reservationID"=\''+reservationID+'\'';
    //                                 pool.query(updateBillQuery, (error, results7)=>{
    //                                     if(error){
    //                                         throw error
    //                                     } else{
    //                                         console.log('the service bill has been updated');
    //                                     }
    //                                 });
                        
    //                             }
    //                         } 
    //                     });
    //                     res.status(200).json({orderID: currentOrderID});                         
    //                 }else if (department == 'amenity'){
    //                     for (i = 0; i < order.length; i++) {
    //                         const thisOrder = order[i]
    //                         const housekeepingQuery = 'INSERT into "orderAmenity"("orderID","amenityID",amount) VALUES (\''+ currentOrderID+'\',\''+thisOrder.id+'\',\''+thisOrder.amount+'\')'
    //                         pool.query(housekeepingQuery, (error, results2) =>{
    //                             if(error){
    //                                 throw error
    //                             }
    //                             if(results2){
    //                                 console.log('inserted amenity order '+ i );
    //                             }
    //                         });
    //                      } 
    //                     res.status(200).json({orderID: currentOrderID});
    //                 }else{
    //                     res.send('Incorrect department');
    //                 }
    //             }
    //         })
    //     }    
    // });
});



// router.get('/testOrder',(req,res)=>{
//     // updateKitchenOrder = true;
//     client.publish('frontend/kitchenOrder','there is a new kitchen order');  
//     client.publish('frontend/amenityOrder','there is a new amenity order');    
//     res.send('okay');
// });


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
