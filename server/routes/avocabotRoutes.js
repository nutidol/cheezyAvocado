const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors')
// setup avocabot router
const router = express.Router();
router.use(morgan('dev'));

// test route
router.get('/', (req, res) => {
    res.send('this is from avocabot file!');
});

module.exports = router;