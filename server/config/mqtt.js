const mqtt = require('mqtt');
// Connect MQTT
const client = mqtt.connect('mqtt://broker.hivemq.com')


module.exports=client;