const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { pool } = require('./config/config');
const helmet = require('helmet');
const compression = require('compression');
const app = require('./config/server').app;
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
const avocabotRoutes = require('./routes/avocabotRoutes');



app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(compression())
app.use(helmet())
app.use('/guest', guestRoutes);
app.use('/authen', authentication.router)
app.use('/menu', menu);
app.use('/staff', staffRoutes);
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


app.get('/addGuest',(req,res)=> {
  const reservationID = req.query.reservationID;
  const guestID = req.query.guestID
  const guestFirstName =req.query.guestFirstName
  const guestLastName =req.query.guestLastName
  const guestNameTitle= req.query.guestNameTitle
  const numberOfGuests = req.query.numberOfGuests
  const roomNumber = req.query.roomNumber
  const roomTypeName = req.query.roomTypeName
  const checkInDate = req.query.checkInDate
  const checkOutDate = req.query.checkOutDate
  console.log('receive parameter')
  //http://localhost:3000/addGuest?guestID=18464857&guestFirstName=Pimrasa&guestLastName=Chaiwatnarathorn&roomNumber=260&roomTypeName=Standard Double&checkInDate=2020-03-20&checkOutDate=2020-03-25&reservationID=18276030&guestNameTitle=Miss&numberOfGuests=2


  var sql1 = 'INSERT INTO guest ("guestID", "guestFirstName", "guestLastName", "guestNameTitle", "guestEmailAddress", "password") VALUES (\''+guestID+'\',\''+guestFirstName+'\',\''+guestLastName+'\',\''+guestNameTitle+'\',\''+null+'\',\''+null+'\')' 
  var sql2 = 'INSERT INTO reservation ("reservationID", "numberOfGuests", "checkInDate", "checkOutDate") VALUES (\''+reservationID+'\',\''+numberOfGuests+'\',\''+checkInDate+'\',\''+checkOutDate+'\')'
  var sql3 = 'INSERT INTO room ("roomNumber", "roomTypeName") VALUES (\''+roomNumber+'\',\''+roomTypeName+'\')'

  console.log('insert parameter')
  
  pool.query(sql1, (error, results1) => {
      if (error) {
        console.log('error')
        throw error;
      }
        if(results1) {
          console.log('add to guest')
        pool.query(sql2,  (error, results2) => {
          if (error) {
          console.log('error')
          throw error;
          }
          if(results2) {
            console.log('add to reservation')
          pool.query(sql3,  (error, results3) => {
            if (error) {
              console.log('error')
              throw error;
            }
            if(results3) {
              console.log('add to room')
              res.status(200).send('added new guest');
            }
          });
        }
      });
    }
  });
});

client.subscribe(prefix+'finished',{qos:1});

client.on('message', (topic, message) => {
  if(topic == (prefix+'finished')) {
    avocabot.execute();
  }
})

//------------------------------------------------Test delivery system------------------------------------------------
// order = new Order('1111','Kitchen','101');
// queue.addToQueue(order);
