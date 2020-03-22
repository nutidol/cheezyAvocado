const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cors = require('cors')
// setup staff router
const router = express.Router();
router.use(morgan('dev'));
var server;

//receive parameter from index.js
router.get('/', function(req, res) {
    var getParameter = req.parameter;
    server=getParameter.param;
    res.send(server)
  });

// test route
router.get('/', (req, res) => {
    res.send('this is from socketEvent file!');
});

//test socket 
// let io = socketIO.listen(server);
// io.on('connection',  function(socket) {
//     console.log('user connected'); 
//      const hi='hello'
//      io.sockets.emit('openLockerStatusToRobot', hi); 
//  });


module.exports = router;