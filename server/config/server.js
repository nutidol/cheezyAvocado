const express = require('express')
const app = express();
const socketIO = require('socket.io');


// Start server
const server=app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port 3000`)
})

const io = socketIO.listen(server);


module.exports={app,io};
