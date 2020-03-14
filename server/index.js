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

//test database connection
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://tlcswvmrgvubvv:deff11dcc21c92aa82a4df312217f258df67a10b0b1e9d3831042878475e9640@ec2-184-72-235-159.compute-1.amazonaws.com/df17ujlpbqu69t',
  ssl: true,
});

client.connect();

client.query('SELECT * FROM customer;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});

const getCustomers = (request, response) => {
  pool.query('SELECT * FROM customer', (error, results) => {
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

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening`)
})
