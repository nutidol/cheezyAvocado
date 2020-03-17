const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./config')
const helmet = require('helmet')
const compression = require('compression')
const Avocabot = require('./classes/avocabot')
const Order = require('./classes/order')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(compression())
app.use(helmet())

// example
const getCustomers = (request, response) => {
  pool.query('SELECT * FROM Customer', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addCustomer = (request, response) => {
  const { customerID, customerFirstName, customerLastName } = request.body

  pool.query('INSERT INTO Customer (customerID, customerFirstName, customerLastName) VALUES ($1, $2, $3)', [customerID, customerFirstName, customerLastName], error => {
    if (error) {
      throw error
    }
    response.status(201).json({ status: 'success', message: 'Customer added.' })
  })
}

app
  .route('/customers')
  // GET endpoint
  .get(getCustomers)
  // POST endpoint
  .post(addCustomer)

//server logic
let orderQueue = []

let observe = (obj, fn) => new Proxy(obj, {
  set(obj, key, val) {
      obj[key] = val;
      fn(obj)
  }
});

arr = observe(orderQueue, arr => {
  console.log('arr changed! ', arr)
});

app.get('/arrayChangeTest',(req,res) => {
  order = new Order('1111','Kitchen','3037')
  orderQueue.push(order)
  res.send('Test')
})

app.get('/getFoods', (req,res) => {
  res.send('Mock response')
})

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening`)
})
