const Destination = require('./destination');
const Graph = require('./graph/graph');
require('./../global');
const client=require('../config/mqtt')

class Avocabot {

    currentPosition;
    currentDestination;
    instructions;
    instructionPointer;
    currentTimeout;
    controller;
    hotelMap;
    openRobotSuccess;
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
      if(this.instructionPointer >= this.instructions.length) { //Avocabot has arrived.
        //Update current position
        if(this.instructionPointer != 0) {
          let previousInstruction = this.instructions[this.instructionPointer-1];
          this.currentPosition = previousInstruction.newPosition;
        }
        //Set order status
        let status;
        let purpose = this.currentDestination.purpose;
        switch(purpose) {
          case this.controller.purpose.PICKUP : status = 'on the way'
          case this.controller.purpose.DELIVER : status = 'arrived'
          case this.controller.purpose.RETURN : status = 'missed'
        }
        if(status) {
          this.currentDestination.order.updateStatus(status);
        }
        //TODO: Ring bell
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

      }else{
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
    }

    backward(distance) {
      console.log('backward' + distance);
    }

    enterHome() {
      console.log('Enter home');
    }

    exitHome() {
      console.log('Exit home');
    }

    openLockerGuest() {
      //Connect MQTT
      client.on('connect', function () {
        console.log("MQTT Connect to Guest openlocker function");
        client.publish("openLockerGuest", "1"); // send 1 means open LED
    });
      this.openRobotSuccess=true;
      //set time out to go home after guest takes the order out 
      clearInterval(this.currentTimeout);
      this.currentTimeout = setTimeout(()=>{
        if(this.callReturnRobot==true) {
          return;
        }
        this.controller.retrieveFromQueue();
      },20000);
    }

    openLockerStaff() {
    //Connect MQTT
      client.on('connect', function () {
        console.log("MQTT Connect to Staff openlocker function");
        client.publish("openLockerStaff", "1"); // send 1 means open LED
    });
      this.openRobotSuccess=true;
      //no time out
    }

    returnRobot() {
      this.openRobotSuccess=false;
      this.callReturnRobot=true;
      retrieveFromQueue(); //go home
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


// // Receive Message and print on terminal
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