//test database connection
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://tlcswvmrgvubvv:deff11dcc21c92aa82a4df312217f258df67a10b0b1e9d3831042878475e9640@ec2-184-72-235-159.compute-1.amazonaws.com/df17ujlpbqu69t',
  ssl: true,
});

client.connect();

client.query('SELECT * FROM customer;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});