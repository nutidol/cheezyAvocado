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

// module.exports = function (io) {
//     //Socket.IO
    // io.on('connection', function (socket) {
    //     console.log('User has connected to staffRoutes');
    //     //ON Events
    //     socket.on('admin', function () {
    //         console.log('Successful Socket Test');
    //     });

    //     //End ON Events
    // });
//     return router;
// };

module.exports = router;