const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const io = require('../config/server').io
const auth = require('./authentication');
const { pool } = require('../config/config');
require('../global');
const Avocabot = require('../classes/avocabot');

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
    if(!req.query) {
        res.send('parameter is missing');
    }
    const reservationId = req.query.reservationID;
    const query1 = 'SELECT "invoiceNumber","totalAmount" FROM "serviceBill" WHERE \"reservationID\"=\''+reservationId+'\'';
    var invoicenumber = 0;
    var totalResult = [];
    const result = {};
    var totalOrder = [];
    var count = 0;
    pool.query(query1, (error, results) => {
        if (error) {
            throw error
          }
        // console.log(results);
        const totalAmount = results.rows[0].totalAmount;
        invoicenumber=results.rows[0].invoiceNumber;
        console.log('the invoice number is ' + invoicenumber);
   //---------------------- -------------------------------------
        const query2 = 'SELECT "orderID","timestamp" FROM "order" WHERE "invoiceNumber"=\''+invoicenumber+'\'';
        const orderId = [];
        var orders = [];
        pool.query(query2, (error, results1) => {
            if (error) {
                throw error
            }
            console.log(results1.rows[0]);
            const currentTS = results1.rows[0].timestamp;
            var date_ob = new Date(currentTS);
            var year = date_ob.getFullYear();
            var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            var date = ("0" + date_ob.getDate()).slice(-2);
            var hours = ("0" + date_ob.getHours()).slice(-2);
            var minutes = ("0" + date_ob.getMinutes()).slice(-2);
            var seconds = ("0" + date_ob.getSeconds()).slice(-2);
            const timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

            var totalBillAmount = 0;
            // console.log(results1);
            // console.log(results1.rows.length);
            const numberOfRows = results1.rows.length;
            for(let i=0 ; i<results1.rows.length; i++){
                // console.log(results1.rows[i].orderID);
                // orderId.push(results1.rows[i].orderID);
                const currentOrderID = results1.rows[i].orderID;
                console.log('this is the currentOrderID '+ currentOrderID);
                var subOrders = [];
                var totalOrderCost = 0;
                const query3 = 'SELECT "foodName",amount,price FROM "orderFood", "food" WHERE "orderFood"."foodID" = "food"."foodID" and "orderID"=\''+currentOrderID+'\'';
                pool.query(query3, (error, results) => {
                    if (error) {
                        throw error
                    }
                    // console.log(results);
                    for(j=0 ; j<results.rows.length; j++){
                        // foodId.push(results.rows[j].foodID);
                        // amount.push(results.rows[j].amount);
                        console.log(results.rows[j]);
                        const subOrder = {
                            foodName: results.rows[j].foodName,
                            amount: results.rows[j].amount,
                            price: results.rows[j].price
                        }
                        subOrders = [...subOrders, subOrder];
                        totalOrderCost = results.rows[j].price * results.rows[j].amount+ totalOrderCost;
                        console.log('the total price is '+ totalOrderCost);
                        console.log('order looks like this '+ subOrders);
                        if(j == results.rows.length-1){
                            const order = {
                                orderID : currentOrderID,
                                totalCost : totalOrderCost,
                                orders : subOrders,
                                timestamp: timestamp,
                            };
                            console.log('this is what an order look like');
                            console.log(order);
                            orders = [...orders, order];
                            console.log('this is what orders look like ' + orders);
                            totalBillAmount = totalOrderCost + totalBillAmount;
                            if(i == numberOfRows-1){
                                const serviceBill = {
                                    reservationID: reservationId,
                                    invoiceNumber: invoicenumber,
                                    totalAmount: totalAmount,
                                    orders: orders
                                }
                                res.status(200).json(serviceBill);
                            }
                        }
                    } 

                })

            // console.log(orderId);
    //--------------------------------------------------------------------------
            //loop in each orderID
            // for(i=0;i<orderId.length;i++) {
            //     const currentOrderId=orderId[i];
            //     console.log(orderId[i]);
            //     console.log(i);
            //     const list = {};
            //     // list.orderID = orderId1;
            //     const foodId = [];
            //     const amount = [];
                // var subOrders = [];
                // var totalOrderCost = 0;
                // const query3 = 'SELECT "foodName",amount,price FROM "orderFood", "food" WHERE "orderFood"."foodID" = "food"."foodID" and "orderID"=\''+currentOrderId+'\'';
                // pool.query(query3, (error, results) => {
                //     if (error) {
                //         throw error
                //     }
                //     // console.log(results);
                //     for(j=0 ; j<results.rows.length; j++){
                //         foodId.push(results.rows[j].foodID);
                //         amount.push(results.rows[j].amount);
                //         console.log(results.rows[j]);
                //         const order = {
                //             foodName: results.rows[j].foodID,
                //             amount: results.rows[j].amount
                //         }
                //         subOrders = [...subOrders, order];
                //         totalOrderCost = results.rows[j].price * results.rows[j].amount;
                //         console.log('the total price is '+ totalOrderCost);
                //         console.log('order looks like this '+ subOrders);

                //     } 
                    // console.log(foodId);
    //--------------------------------------------------
                    //loop in each foodID array
                //     var totalamount = 0;
                //     var b = 0;
                //     const sublist = {};
                //     count++;
                //     for(k=0;k<foodId.length; k++) {
                //         console.log(k)
                //         const foodId1 = foodId[k];
                //         console.log(foodId[k])
                //         const infor = {};
                //         const query4 = 'SELECT * FROM food WHERE \"foodID\"=\''+foodId1+'\'';
                //         pool.query(query4, (error, results) => {
                //             b++;
                //             if (error) {
                //                 throw error
                //             }
                //             console.log(results)        
                //             infor.foodName = results.rows[0].foodName;
                //             infor.price = results.rows[0].price;
                //             infor.amount = amount[0];
                //             if(b==1) {
                //                 sublist.order1=infor;
                //             }
                //             if(b==2) {
                //                 sublist.order2=infor;
                //             }
                //             if(b==3) {
                //                 sublist.order3=infor;
                //             }
                //             if(b==4) {
                //                 sublist.order4=infor;
                //             }
                //             if(b==5) {
                //                 sublist.order5=infor;
                //             }                                
                //             totalamount = totalamount+(infor.price*infor.amount);
                //             list.totalAmount = totalamount;
                //             console.log('here');
                //             console.log(list);
                //             totalOrder.push(list); 
                //             totalOrder = getUnique(totalOrder);
                //             console.log(totalOrder);
                //             result.totalOrder = totalOrder;
                //             console.log(result);
                //             totalResult = [];
                //             totalResult.push(result);
                //             console.log(count);
                //             console.log(b);
                //             console.log(results1.rows.length)
                //             list.orderList = sublist;  
                //             if(count == results1.rows.length && b == foodId.length) {
                //                 res.send(totalResult);
                //             }
                //         });       
                //     }             
                // });  

            }

            // const serviceBill = {
            //     reservationID: reservationId,
            //     invoiceNumber: invoicenumber,
            //     orders: orders, 
            // }
            // res.status(200).json(serviceBill);

        });
    // result.reservationID=reservationId;
    // result.totalTotalAmount=results.rows[0].totalAmount;
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
    avocabot.openLocker() 
    res.send('OK'); //Every HTTP Get has to have some response.
});

router.get('/returnRobot', (req,res,next)=> {
    avocabot.sendAvocabot();
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
        client.publish('frontend/updateKitchenOrder','there is a new kitchen order'); //publish to staff app
        departmentID = 1;        
    }else if (department == 'amenity'){
        client.publish('frontend/updateAmenityOrder','there is a new amenity order'); //publish to staff app
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
                                
                                                const getInvoiceNumber = 'select "invoiceNumber" from "serviceBill" where "reservationID" =\''+reservationID+'\'';
                                                pool.query(getInvoiceNumber,(error,res4)=>{
                                                    if(error){
                                                        throw error;
                                                    }
                                                    // console.log(res4);
                                                    // console.log(res4.rows);
                                                    // console.log('this:   '+ res4.rows[0].invoiceNumber)
                                                    const theInvoiceNumber = res4.rows[0].invoiceNumber;
                                                    const updateInvoiceNumber = 'UPDATE "order" SET "invoiceNumber" = \'' + theInvoiceNumber +'\' where "orderID"=\''+ currentOrderID +'\'';
                                                    console.log(updateInvoiceNumber);
                                                    pool.query(updateInvoiceNumber,(error,res6)=>{
                                                        console.log('updated invoice number');
                                                    })
                                                    
                                                })
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
                                            const getInvoiceNumber = 'select "invoiceNumber" from "serviceBill" where "reservationID" =\''+reservationID+'\'';
                                            pool.query(getInvoiceNumber,(error,res4)=>{
                                                if(error){
                                                    throw error;
                                                }
                                                // console.log(res4);
                                                // console.log(res4.rows);
                                                // console.log('this:   '+ res4.rows[0].invoiceNumber)
                                                const theInvoiceNumber = res4.rows[0].invoiceNumber;
                                                const updateInvoiceNumber = 'UPDATE "order" SET "invoiceNumber" = \'' + theInvoiceNumber +'\' where "orderID"=\''+ currentOrderID +'\'';
                                                console.log(updateInvoiceNumber);
                                                pool.query(updateInvoiceNumber,(error,res6)=>{
                                                    console.log('updated invoice number');
                                                })
                                                
                                            })
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

});

router.get('/cancelOrder', (req,res)=>{
    if(!req.query.orderID) {
        res.send('parameter is missing');
    }
    const orderID = req.query.orderID;
    const checkAmenity = 'select "orderID" from "orderAmenity" where "orderID"=\''+orderID+ '\'';
    pool.query(checkAmenity, (error,result)=>{
        if(error){
            throw error;
        }
        console.log(result);
        if(result.rowCount!=0){
            client.publish('frontend/updateAmenityOrder','there is a deletion of amenity order');
            const deleteAmenity = 'delete from "orderAmenity" where "orderID"=\''+orderID+'\'';
            pool.query(deleteAmenity, (error,result2)=>{
                if(error){
                    throw error;
                }
                console.log('deleted from table orderAmenity');
                const deleteOrder = 'delete from "order" where "orderID"=\''+orderID+'\'';
                pool.query(deleteOrder, (error,result3)=>{
                    if(error){
                        throw error;
                    }
                    console.log('deleted from table order');
                    res.send('deleted')
                })
            })
        }else{
            client.publish('frontend/updateKitchenOrder','there is a deletion of kitchen order');
            const getFoodOrder = 'select price,amount from "orderFood",food where "orderFood"."foodID"=food."foodID" and "orderID"=\''+orderID+'\'';
            pool.query(getFoodOrder, (error,res1)=>{
                console.log(res1);
                var totalPrice=0;
                console.log(res1.rowCount)
                for(i=0;i<res1.rowCount;i++){
                    totalPrice = totalPrice + res1.rows[i].price*res1.rows[i].amount
                }
                console.log(totalPrice);
                const getInvoiceNumber =  'select "invoiceNumber" from "order" where "orderID"=\''+ orderID+'\'';
                pool.query(getInvoiceNumber, (error,result8)=>{
                    if(error){
                        throw error
                    }
                    console.log(result8);
                    // console.log(result8.rows[0].invoiceNumber);
                    const invoiceNumber = result8.rows[0].invoiceNumber;
                    console.log(invoiceNumber);
                    const getTotalAmount = 'select "totalAmount" from "serviceBill" where "invoiceNumber"=\''+invoiceNumber+'\'';
                    pool.query(getTotalAmount,(error,result)=>{
                        if(error){
                            throw error
                        }
                        const totalAmount = result.rows[0].totalAmount;
                        console.log('totalAmount is '+ totalAmount);
                        const newTotalAmount = totalAmount- totalPrice;
                        console.log('the new totalAmount is '+ newTotalAmount);
                        const deleteFood = 'delete from "orderFood" where "orderID"=\''+orderID+'\'';
                        pool.query(deleteFood,(error,res3)=>{
                            if(error){
                                throw error
                            }
                            console.log('delete from orderFood');
                            const deleteOrder = 'delete from "order" where "orderID"=\''+orderID+'\'';
                            pool.query(deleteOrder, (error,res5)=>{
                                if(error){
                                    throw error
                                }
                                const updateServiceBillQuery = 'UPDATE "serviceBill" SET "totalAmount" = \''+newTotalAmount+'\' where "invoiceNumber"=\''+invoiceNumber+'\'';
                                pool.query(updateServiceBillQuery, (error,res7)=>{
                                    if(error){
                                        throw error
                                    }
                                    console.log('service bill is updated');
                                    if(newTotalAmount==0){
                                        const deleteServiceBill = 'delete from "serviceBill" where "invoiceNumber"=\''+invoiceNumber+'\'';
                                        console.log('delete from order');
                                        pool.query(deleteServiceBill, (error,res)=>{
                                            if(error){
                                                throw error
                                            }
                                            console.log('delete from serviceBill');
            
                                        });
                                    }
                                    res.send('the order has been cancelled');
                                })
                            });
                        });
                    }) 
                })
            })
           
            
        }
    });
});

router.get('/getCurrentOrder', (req,res)=>{
    if(!req.query.roomNumber) {
        res.send('parameter is missing');
    }
    const roomNumber = req.query.roomNumber;
    const query = 'select "orderID","status" from "order" where (status = \'pending\' or status =\'approved\' or status =\'on the way\') and "roomNumber"=\''+roomNumber+'\'';
    console.log(query);
    pool.query(query,(error,result)=>{
        if(error){
            throw error
        }
        res.status(200).json(result.rows)
    })
});

router.get('/getFoods', auth.authenticatedJWT, (req,res)=>{
    pool.query('SELECT * FROM food', (error, results) => {
        if (error) {
          throw error
        }
        // console.log(results);
        res.status(200).json(results.rows)
      })
});

router.get('/getFoodsByName', auth.authenticatedJWT, (req,res)=>{
    const query = 'SELECT * FROM food ORDER BY "foodName" ASC'
    pool.query(query, (error, results )=>{
        if(error){
            throw error
        }
        res.status(200).json(results.rows)
    })
});

router.get('/getFoodsByPrice', auth.authenticatedJWT, (req,res)=>{
    const query = 'SELECT * FROM food ORDER BY "price" ASC'
    pool.query(query, (error, results )=>{
        if(error){
            throw error
        }
        res.status(200).json(results.rows)
    })
})

router.get('/getAmenities', auth.authenticatedJWT, (req,res)=>{
    pool.query('SELECT * FROM amenity', (error, results) => {
        if (error) {
          throw error
        }
        // console.log(results);
        res.status(200).json(results.rows)
      })
});

router.get('/getAmenitiesByName', auth.authenticatedJWT, (req,res)=>{
    const query = 'SELECT * FROM amenity ORDER BY "amenityName" ASC';
    pool.query(query, (error,results) =>{
        if(error){
            throw error
        }
        res.status(200).json(results.rows)
    })
})





router.get('/testOrder', auth.authenticatedJWT, (req,res)=>{
    // updateKitchenOrder = true;
    client.publish('frontend/kitchenOrder','there is a new kitchen order');  
    client.publish('frontend/amenityOrder','there is a new amenity order');    
    res.send('okay');
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


module.exports = router;
