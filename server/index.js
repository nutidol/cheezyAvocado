const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./config')
const helmet = require('helmet')
const compression = require('compression')
const customerRoutes = require('./routes/customerRoutes');
const morgan = require('morgan');

const app = express()

app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(compression())
app.use(helmet())
app.use('/customers', customerRoutes);

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
// test api
app.get('/' , (req, res, next) => {
  res.send('hello');
});


app
  .route('/customerss')
  // GET endpoint
  .get(getCustomers)
  // POST endpoint
  .post(addCustomer)

// Start server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening`)
})
