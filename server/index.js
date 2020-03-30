const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { pool } = require('./config/config');
const helmet = require('helmet');
const compression = require('compression');
const app = require('./config/server').app;
const mqtt = require('mqtt');
require('./global');

const guestRoutes = require('./routes/guestRoutes');
const authentication = require('./routes/authentication');
const menu = require('./routes/menu');
const staffRoutes = require('./routes/staffRoutes');
const morgan = require('morgan');
const Avocabot = require('./classes/avocabot');
const Order = require('./classes/order');
const Queue = require('./classes/queue');
const HotelMap = require('./classes/hotelMap');
const queryExample = require('./test/queryExample');
const avocabotRoutes = require('./routes/avocabotRoutes');

//const client = mqtt.connect('mqtt://broker.hivemq.com')

app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(compression())
app.use(helmet())
app.use('/guests', guestRoutes);
app.use('/authen', authentication.router)
app.use('/menu', menu);
app.use('/staffs', staffRoutes);
app.use('/queryEx', queryExample);
app.use('/avocabot', avocabotRoutes);

// USE FOR MOCK UP HTML FILE > page.html
// Register the index route of your app that returns the HTML file
app.get('/', function (req, res) {
  console.log("Homepage");
  res.sendFile(__dirname + '/page.html');
});

// USE FOR MOCK UP HTML FILE
// Expose the node_modules folder as static resources (to access socket.io.js in the browser)
app.use('/static', express.static('node_modules'));

// PLS DONT DELETE!! how to pass parameter to guestRoutes.js 
// app.use('/guests', function (req, res, next) {
//   req.parameter = {
//       param: server
//   };
//   next();
// }, guestRoutes);

app.post('/addGuest',(req,res)=>{
  const guestID= req.query.guestID
  const guestFirstName =req.query.guestFirstName
  const guestLastName =req.query.guestLastName
  const guestNameTitle= req.query.guestNameTitle
  const guestEmailAddress = req.query.guestEmailAddress
  const password=req.query.password 
  const roomNumber=req.query.roomNumber
  const roomTypeName=req.query.roomTypeName
  const checkInDate=req.query.checkInDate
  const checkOutDate=req.query.checkOutDate

  var sql1 = 'INSERT INTO guest ("guestID", "guestFirstName", "guestLastName", "guestNameTitle", "guestEmailAddress", "password") VALUES (\''+guestID+'\',\''+guestFirstName+'\',\''+guestLastName+'\',\''+guestNameTitle+'\',\''+guestEmailAddress+'\',\''+password+'\')' 
  var sql2 = 'INSERT INTO room ("roomNumber", "roomTypeName", "guestID", "checkInDate", "checkOutDate") VALUES (\''+roomNumber+'\',\''+roomTypeName+'\',\''+guestID+'\',\''+checkInDate+'\',\''+checkOutDate+'\')'
  // var sql1 = 'INSERT INTO guest (guestID, guestFirstName, guestLastName, guestNameTitle, guestEmailAddress, password) VALUES ?'
  // var sql2 = 'INSERT INTO room (roomNumber, roomTypeName, guestID, checkInDate, checkOutDate) VALUES ?'
  //var sql3 = 'INSERT INTO guest (guestID, guestFirstName, guestLastName, guestNameTitle, guestEmailAddress, password) VALUES ?'
  //const guestInfo=req.query.guestInfo
  //const guestInfo=req.query.guestInfo;
  
  //const {guestID, guestFirstName, guestLastName, guestNameTitle,roomNumber,  checkInDate, checkOutDate} = req.query.guestInfo;
  // var value1=[
  //   [guestID, guestFirstName, guestLastName, guestNameTitle, null , null ]
  // ];
  // var value2=[
  //   [roomNumber, null , guestID, checkInDate, checkOutDate]
  // ]
  // var value1=[
  //   [guestInfo.guestID, guestInfo.guestFirstName, guestInfo.guestLastName, guestInfo.guestNameTitle, guestInfo.guestEmailAddress , guestInfo.password ]
  // ];
  // var value2=[
  //   [guestInfo.roomNumber, guestInfo.roomTypeName , guestInfo.guestID, guestInfo.checkInDate, guestInfo.checkOutDate]
  // ];
  // var value1=[
  //   [req.query.guestID, req.query.guestFirstName, req.query.guestLastName, req.query.guestNameTitle, req.query.guestEmailAddress , req.query.password ]
  // ];
  // var value2=[
  //   [req.query.roomNumber, req.query.roomTypeName , req.query.guestID, req.query.checkInDate, req.query.checkOutDate]
  // ]
  console.log('hi')
  pool.query(sql1,  (error, results1) => {
      if (error) {
        console.log('error')
        throw error;
      }
      //res.status(200).json(results1.rows)
        //res.status(200).send('added new guest');
        console.log('add to guest')
    })
    pool.query(sql2,  (error, results2) => {
      if (error) {
        console.log('error')
        throw error;
        
      }
      res.status(200).json(results2.rows)
        //res.status(200).send('added new guest');
        console.log('add to room')
    })
  });


//------------------------------------------------Test Public MQTT------------------------------------------------

//Worked! But not work with our avocabot.

// var client  = mqtt.connect('mqtt://broker.mqttdashboard.com')

// client.on('connect', function () {
//   client.subscribe('presence', function (err) {
//     if (!err) {
//       client.publish('presence', 'Hello mqtt')
//       console.log('connected!');
//     }
//   })
//   client.subscribe('cheezy',(err)=>{
//     if(!err) {
//       //client.publish('avocado!')
//       console.log('subscribed to cheezy!');
//     }
//   })
// })

// client.on('message', (topic, message) => {
//   if(topic == 'cheezy') {
//     console.log(topic);
//     console.log(message.toString());
//   }
// })

// client.publish('cheezyavocado','Test');

//------------------------------------------------Test cayenne mqtt ------------------------------------------------

//Not working

// var Cayenne = require('cayenne-mqtt');
// var options = {
//   'clientId' : '3185d220-6dc5-11ea-b301-fd142d6c1e6c',
//   'username' : '97bc8410-6ceb-11ea-b301-fd142d6c1e6c',
//   'password' : '1fdc8ecb6167cf2eee213597b72a2af0d0ac3c5c'
// }
// var Client = new Cayenne.Client(options);
// Client.connect();
 
// var Ch0 = Client.Channel('0');
// var Ch1 = Client.Channel('1');
 
// Ch1.on('message',function(msg){   
//   if(msg == '1') Ch2.publish('0');
//   if(msg == '0') Ch2.publish('1');
// });

// Ch0.publish('0');

//------------------------------------------------Test cayenne mqtt 2------------------------------------------------

// var client = mqtt.connect('mqtt://mqtt.mydevices.com',{
//     port: 1883,  
//     clientId: '3185d220-6dc5-11ea-b301-fd142d6c1e6c',  
//     username: '97bc8410-6ceb-11ea-b301-fd142d6c1e6c',  
//     password: '1fdc8ecb6167cf2eee213597b72a2af0d0ac3c5c'
//     //connectTimeout: 5000  
// });

// client.on('connect', function () {
//   client.subscribe('presence', function (err) {
//     if (!err) {
//       client.publish('presence', 'Hello mqtt')
//       console.log('connected!');
//     }
//   })
//   client.subscribe('cheezy',(err)=>{
//     if(!err) {
//       //client.publish('avocado!')
//       console.log('subscribed to cheezy!');
//     }
//   })
// })

// client.publish('cheezyavocado','Test');

//------------------------------------------------Test delivery system------------------------------------------------
order = new Order('1111','Kitchen','101');
queue.addToQueue(order);

app.get('/finish', function (req, res) {
  res.send('OK');
  avocabot.execute();
});

app.get('/sendOrder',(req,res)=>{
  res.send('OK');
  avocabot.closeLocker();
});

//------------------------------------------------Test mqtt async------------------------------------------------

// let client = mqtt.connect('mqtt://broker.mqttdashboard.com');

// client.on('connect', function () {
//   client.subscribe('presence', function (err) {
//     if (!err) {
//       client.publish('presence', 'Hello mqtt')
//       console.log('connected!');
//     }
//   })
//   client.subscribe('cheezy',(err)=>{
//     if(!err) {
//       console.log('subscribed to cheezy!');
//     }
//   })
// });

// let promise = new Promise((resolve, reject) => {
//   client.on('message', (topic, message) => {
//     if(topic == 'cheezy') {
//       console.log(topic);
//       console.log(message.toString());
//     }
//   })
// });

// promise.then(()=>{
//   console.log('fulfull');
// }).catch((err)=>{
//   console.log(err);
// })

//------------------------------------------------Test http async------------------------------------------------


// let promise2 = new Promise((resolve, reject) => {
//   app.get('/testAsync',(req,res)=>{
//     resolve();
//     res.send('OK');
//   });
// });

// promise2.then(()=>{
//   console.log('fulfill');
// }).catch((err)=>{
//   console.log(err);
// })

// async function goTo() {
//   for(let i=0;i<5;i++) {
//     console.log(i);
//     await new Promise((resolve,reject)=>{
//       app.get('/testAsync',(req,res)=>{
//         resolve();
//         res.send('OK');
//       });
//     })
//   }
// }

// goTo();