const socketIO = require('socket.io');
const server=require('../index')
const hello='12345'



  
const io = socketIO.listen(server);


module.exports=io;