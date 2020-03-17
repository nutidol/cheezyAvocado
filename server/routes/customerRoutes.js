const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors')
// setup customer router
const router = express.Router();
router.use(morgan('dev'));

// test route
router.get('/', (req, res) => {
    res.send('this is from customer file!');
});

// getBillPayment route
router.get('/getBillPayments', (req, res, next) => {
    const customerId = req.query.customerId;
    //query db
    res.send('db query results');
});

module.exports = router;