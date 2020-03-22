const express = require('express')
const app = express();

// Start server
const server=app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port 3000`)
})

module.exports=server;