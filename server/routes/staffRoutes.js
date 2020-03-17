const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors')
// setup staff router
const router = express.Router();
router.use(morgan('dev'));

// test route
router.get('/', (req, res) => {
    res.send('this is from server file!');
});


module.exports = router;