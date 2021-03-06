const Avocabot = require('./classes/avocabot');
const Queue = require('./classes/queue');
const HotelMap = require('./classes/hotelMap');

node = {
    '101' : 'A',
    '102' : 'A',
    '103' : 'B',
    '104' : 'B',
    '105' : 'C',
    '106' : 'D',
    '107' : 'D',
    '108' : 'E',
    '109' : 'E',
    '110' : 'F',
    '111' : 'F',
    '112' : 'G',
    '113' : 'G',
    '114' : 'I',
    '115' : 'H',
    '116' : 'K',
    '117' : 'I',
    '119' : 'J',
    'Kitchen' : 'I',
    'Housekeeping' : 'J'
}

hotelMap = new HotelMap();
avocabot = new Avocabot('K',hotelMap);
queue = new Queue(avocabot);
avocabot.controller = queue;

const mqtt = require('mqtt');
const options = {
    port: 17267,
    host: process.env.MQTT_HOST,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASSWORD,
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
  };
client = mqtt.connect('mqtt://soldier.cloudmqtt.com',options);

orderStatus = {
  PENDING :'pending',
  APPROVED : 'approved',
  ONTHEWAYDEPARTMENT : 'on the way to department',
  ARRIVEDDEPARTMENT: 'arrived at department', 
  ONTHEWAY: 'on the way',
  ARRIVED : 'arrived',
  COMPLETE : 'complete',
  MISSED : 'missed'
};

prefix = process.env.PREFIX;