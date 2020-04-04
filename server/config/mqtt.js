const mqtt = require('mqtt');
var options = {
    port: 17267,
    host: 'mqtt://soldier.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'vfmquhui',
    password: 'yXMUCDc8eoO8',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
  };
const client = mqtt.connect('mqtt://soldier.cloudmqtt.com',options);

module.exports = client;