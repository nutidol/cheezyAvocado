const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { pool } = require('./config/config');
const helmet = require('helmet');
const compression = require('compression');
const app = require('./config/server').app;
const mqtt = require('mqtt');

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

//Try mqtt
// client.on('connect', () => {
//   // Inform the avocabot that server is connected
//   client.publish('server/connected', 'true')
// })

//Debug
// hotelMap = new HotelMap();
// avocabot = new Avocabot('K',hotelMap);
// queue = new Queue(avocabot);
// avocabot.controller = queue;

// order = new Order('1111','Kitchen','101');
// queue.addToQueue(order);

app.get('/execute', function (req, res) {
  res.send('execute');
  avocabot.execute();
});

app.get('/test',(req,res)=>{
  res.send('test');
});

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
app.get('/finish',(req,res)=>{
  res.send('OK');
  queue.retrieveFromQueue();
});

//hotelMap.getInstructions('A','I');

