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
hotelMap = new HotelMap();
avocabot = new Avocabot('K',hotelMap);
queue = new Queue(avocabot);
avocabot.controller = queue;

order = new Order('1111','Kitchen','101');
queue.addToQueue(order);

app.get('/execute', function (req, res) {
  res.send('execute');
  avocabot.execute();
});
