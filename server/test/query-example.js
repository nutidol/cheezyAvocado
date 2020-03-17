// query example
const express = require('express');
const router = express.Router();
const { pool } = require('../config')


const getCustomers = (request, response) => {
    pool.query('SELECT * FROM Customer', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })

  
const addCustomer = (request, response) => {
    const { customerID, customerFirstName, customerLastName } = request.body
  
    pool.query('INSERT INTO Customer (customerID, customerFirstName, customerLastName) VALUES ($1, $2, $3)', [customerID, customerFirstName, customerLastName], error => {
      if (error) {
        throw error
      }
      response.status(201).json({ status: 'success', message: 'Customer added.' })
    })
}
  
  router
    .route('/customers')
    // GET endpoint
    .get(getCustomers)
    // POST endpoint
    .post(addCustomer)

module.exports = router;