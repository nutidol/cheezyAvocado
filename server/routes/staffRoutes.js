const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors')
// setup staff router
const router = express.Router();

router.use(morgan('dev'));
const io = require('../config/server').io

// test route
router.get('/', (req, res) => {
    res.send('this is from server file!');
});

io.on('connection', function (socket) {
    console.log('User has connected to staffRoutes');
        //ON Events
    
        //End ON Events
});

module.exports = router;