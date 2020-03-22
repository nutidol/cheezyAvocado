const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./config/config')
const helmet = require('helmet')
const compression = require('compression')
const app = express();
const socketIO = require('socket.io');
//const server = require('./config/server')

//app.io = require('socket.io')();



// Start server
const server=app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port 3000`)
})
module.exports = server;

//app.io = socketIO.listen(server);


// test socket 
// let io = socketIO.listen(server);
// io.on('connection',  function(socket) {
//     console.log('user connected'); 
//     const hi='hello'
//     io.sockets.emit('openLockerStatusToRobot', hi); 
// });

const guestRoutes = require('./routes/guestRoutes');
const authentication = require('./routes/authentication');
const menu = require('./routes/menu');
const staffRoutes = require('./routes/staffRoutes');
const socketEvent = require('./routes/socketEvent');
const morgan = require('morgan');
const Avocabot = require('./classes/avocabot')
const Order = require('./classes/order')
const queryExample = require('./test/queryExample');



app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(compression())
app.use(helmet())
//app.use('/guests', guestRoutes);
//app.use('/socketEvent', socketEvent)
app.use('/authen', authentication)
app.use('/menu', menu);
app.use('/staffs', staffRoutes);
app.use('/queryEx', queryExample);

//pass parameter to guestRoutes.js
app.use('/guests', function (req, res, next) {
  req.parameter = {
      param: server
  };
  next();
}, guestRoutes);

//pass parameter to socketEvent.js
app.use('/socketEvent', function (req, res, next) {
  req.parameter = {
      param: server
  };
  next();
}, socketEvent);




// Register the index route of your app that returns the HTML file
app.get('/', function (req, res) {
  console.log("Homepage");
  res.sendFile(__dirname + '/page.html');
});


// Expose the node_modules folder as static resources (to access socket.io.js in the browser)
app.use('/static', express.static('node_modules'));




//---Server logic---
//Variable initialization
var arrayChangeHandler = {
  set: function(target, property, value, receiver) {
    console.log("arrayChangeHandler called")
    var currentOrder = orderQueue[0]
    processOrder(currentOrder)
    target[property] = value;
    return true;
  }
};
var orderQueue = new Proxy([], arrayChangeHandler);
var pointer;
var avocabot = new Avocabot('117','E'); 
function processOrder(order) {
  if(order == null || order == undefined) return;
  if(pointer == null) {
    pointer = order
    let department = order.departmentName
    //avocabot.goTo(department)
  }
}


app.get('/placeOrder',(req,res) => {
  let order = new Order('1111','Kitchen','1084')
  orderQueue.push(order)
  res.send("Added!")
})

app.get('/removeOrder',(req,res) => {
  orderQueue.pop()
  res.send("Removed!")
})

app.get('*',(req,res) => {
  res.send("Page Not Found!")
})




