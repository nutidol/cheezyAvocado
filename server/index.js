const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./config')
const helmet = require('helmet')
const compression = require('compression')

const customerRoutes = require('./routes/guestRoutes');
const authentication = require('./routes/authentication');
const menu = require('./routes/menu');
const staffRoutes = require('./routes/staffRoutes');
const morgan = require('morgan');
const Avocabot = require('./classes/avocabot')
const Order = require('./classes/order')
const queryExample = require('./test/queryExample');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(compression())
app.use(helmet())
app.use('/customers', customerRoutes);
app.use('/authen', authentication)
app.use('/menu', menu);
app.use('/staffs', staffRoutes);
app.use('/queryEx', queryExample);

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
// test api
app.get('/' , (req, res, next) => {
  res.send('hello');
});




app.get('/placeOrder',(req,res) => {
  let order = new Order('1111','Kitchen','1084')
  orderQueue.push(order)
  res.send("Added!")
})

app.get('/removeOrder',(req,res) => {
  orderQueue.pop()
  res.send("Removed!")
})


// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port 3000`)
})
