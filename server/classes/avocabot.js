const Destination = require('./destination');
const Graph = require('./graph/graph');
require('../global');


class Avocabot {

    currentPosition;
    currentDestination;
    instructions;
    instructionPointer;
    currentTimeout;
    controller;
    hotelMap;
    lockerIsOpen;
    callReturnRobot;

    constructor(currentPosition, hotelMap) { //currentPosition as a character notation.
      this.currentPosition = currentPosition;
      this.hotelMap = hotelMap;
    }

    goTo(destination) {
      console.log(' --- Going to ' + destination.destination + ' ---');
      this.currentDestination = destination;
      this.instructions = this.calculateRoute(destination.destination);
      this.instructionPointer = -1;
      this.execute();
    }

    execute() {
      this.instructionPointer++;
      if(this.instructionPointer > this.instructions.length) {
        console.warn('Pointer is out of range');
      }
      if(this.instructionPointer == this.instructions.length) { //Avocabot has arrived.
        console.log('The avocabot has arrived!');
        //Update current position
        if(this.instructionPointer != 0) {
          let previousInstruction = this.instructions[this.instructionPointer-1];
          this.currentPosition = previousInstruction.newPosition;
        }
        //Set order status
        let status;
        let purpose = this.currentDestination.purpose;
        switch(purpose) {
          //case this.controller.purpose.PICKUP : status = 'on the way'
          case this.controller.purpose.DELIVER : status = 'arrived'
          case this.controller.purpose.RETURN : status = 'missed'
        }
        if(status) {
          this.currentDestination.order.updateStatus(status);
        }
        //TODO: Ring bell
        //TODO: Socket.emit to frontend to allow open avocabot
        //Set timeout for 30 seconds -> Go back to department
        if(purpose == this.controller.purpose.DELIVER) {
          this.currentTimeout = setTimeout(()=>{
            let destination = new Destination(
              this.currentDestination.order.departmentName,
              this.controller.purpose.RETURN,
              this.currentDestination.order);
            this.goTo(destination);
          },30000);
        }

      }else if(this.instructionPointer < this.instructions.length){
        let mapping = {
          'L' : this.turnLeft,
          'R' : this.turnRight,
          'F' : this.forward,
          'B' : this.backward,
          'I' : this.enterHome,
          'O' : this.exitHome
        }
        //Update current position
        if(this.instructionPointer != 0) {
          let previousInstruction = this.instructions[this.instructionPointer-1];
          this.currentPosition = previousInstruction.newPosition;
        }
        //Execute current instruction
        let currentInstruction = this.instructions[this.instructionPointer].instruction;
        mapping[currentInstruction[0]](currentInstruction.substring(1));
      }
    }

    calculateRoute(destination) {
      let currentNode = this.currentPosition;
      let destinationNode = node[destination];
      console.log('currentNode : ' + currentNode + ', destinationNode : ' + destinationNode);
      return hotelMap.getInstructions(currentNode, destinationNode);
    }

    turnLeft() {
      console.log('turn left');
    }

    turnRight() {
      console.log('turn right');
    }

    forward(distance) {
      console.log('forward ' + distance);
      client.publish('Cheezy','Forward');
    }

    backward(distance) {
      console.log('backward' + distance);
    }

    enterHome() {
      console.log('Enter home');
    }

    exitHome() {
      console.log('Exit home');
      client.publish('Cheezy','exitHome');
    }   
    
    openLocker() {
      //Check whether avocabot is at the destination
      let currentNode = node[this.currentDestination.destination];
      let destinationNode = this.currentPosition;
      if(currentNode != destinationNode) {
        console.log('Someone is trying to open the locker while the avocabot is not at the destination!');
        return;
      }
      //MQTT: Tell avocabot to open locker (turn on the light)
      client.publish('Cheezy','openLocker');
      //TODO: Receive response from robot
      this.lockerIsOpen = true;
      if(this.currentDestination.purpose == this.controller.purpose.DELIVER) {
        clearInterval(this.currentTimeout);
        this.currentTimeout = setTimeout(()=>{
          this.controller.retrieveFromQueue();
        },10000);
      }
      //TODO: return success status
    }

    sendAvocabot() {
      let currentNode = node[this.currentDestination.destination];
      let destinationNode = this.currentPosition;
      if(currentNode != destinationNode) {
        console.warn('Someone is trying to close the locker while the avocabot is not at the destination!');
        return;
      }
      this.callReturnRobot = false;
      //MQTT: turn light off
      //receive response from robot when leave guest room
      clearInterval(this.currentTimeout);
      this.lockerIsOpen = false;
      //if send robot success
      this.callReturnRobot = true;
      this.controller.retrieveFromQueue();
    }
    
}

module.exports = Avocabot;

// // Connect MQTT
// client.on('connect', function () {
//   // Subscribe any topic
//   console.log("MQTT Connect");
//   client.subscribe('test', function (err) {
//       if (err) {
//           console.log(err);
//       }
     
//   });
// });

// client.on('connect', function () {
//   console.log("MQTT Connect to Staff openlocker function");
//   client.publish("test", "1"); // send 1 means open LED
// });

// Receive Message and print on terminal
// client.on('message', function (topic, message) {
//   // message is Buffer
//   console.log(message.toString());
// });



// client.on('connect', function () {
//   console.log("MQTT Connect publish");
//   client.publish('test', "hello from NodeJS");
     
// });




//NOT USE BUT KEEP IT
// setInterval(() => {
//   client.publish("test", "hello from NodeJS");
// }, 5000);