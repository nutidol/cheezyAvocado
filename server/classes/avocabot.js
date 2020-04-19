const Destination = require('./destination');
const Order = require('./order');
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
    lockerIsOpen = false;
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
        //Update order status
        let purpose = this.currentDestination.purpose;
        let currentOrder = this.currentDestination.order;
        if(purpose == this.controller.purpose.DELIVER) {
          currentOrder.updateStatus(orderStatus.ARRIVED);
        }
        if(purpose == this.controller.purpose.PICKUP) {
          currentOrder.updateStatus(orderStatus.ARRIVEDDEPARTMENT);
        }
        //MQTT: Ring bell
        let destination = this.currentDestination.destination;
        let message = destination + 'ON';
        client.publish(prefix+'controlBell',message);
        //Set timeout for 60 seconds -> Go back to department
        if(purpose == this.controller.purpose.DELIVER) {
          this.currentTimeout = setTimeout(()=>{
            let destination = new Destination(
              this.currentDestination.order.departmentName,
              this.controller.purpose.RETURN,
              this.currentDestination.order);
            //Update status
            //this.currentDestination.order.updateStatus(Order.status.MISSED);
            this.goTo(destination);
          },180000); //Avocabot returns home if guest does not press 'Open Avocabot' within 3 mins
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
      client.publish(prefix+'turnLeft');
    }

    turnRight() {
      console.log('turn right');
      client.publish(prefix+'turnRight');
    }

    forward(distance) {
      console.log('forward ' + distance);
      client.publish(prefix+'forward',distance);
    }

    backward(distance) {
      console.log('backward' + distance);
      client.publish(prefix+'backward',distance);
    }

    enterHome() {
      console.log('Enter home');
      client.publish(prefix+'enterHome');
    }

    exitHome() {
      console.log('Exit home');
      client.publish(prefix+'exitHome');
    }   
    
    openLocker() {
      //Check whether avocabot is at the destination
      let currentNode = node[this.currentDestination.destination];
      let destinationNode = this.currentPosition;
      if(currentNode != destinationNode) {
        console.warn('Someone is trying to open the locker while the avocabot is not at the destination!');
        return;
      }
      //MQTT: Tell avocabot to open locker (turn on the light)
      client.publish(prefix+'openLocker');
      //MQTT: receive response from Avocabot when LED is on
      client.subscribe('lockerIsOpen');
      client.on('message', (topic, message) => {
        if(topic == 'lockerIsOpen') {
          if(this.lockerIsOpen == false) {
            console.log(topic);
            this.lockerIsOpen = true;
            let message = this.currentDestination.destination + 'OFF';
            client.publish(prefix+'controlBell',message);
            //Update order status
            let purpose = this.currentDestination.purpose;
            let currentOrder = this.currentDestination.order;
            if(purpose == this.controller.purpose.DELIVER) {
              currentOrder.updateStatus(orderStatus.COMPLETE);
            }
            if(this.currentDestination.purpose == this.controller.purpose.DELIVER) {
              clearInterval(this.currentTimeout);
              this.currentTimeout = setTimeout(()=>{
                this.controller.retrieveFromQueue();
              },60000);
            }
          }
        }
      })
     
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
      client.publish(prefix+'closeLocker');
      //TODO: MQTT receive response from robot when LED is off
      client.subscribe('lockerIsClosed')
      client.on('message', (topic, message) => {
        if(topic == 'lockerIsClosed') {
          if(this.lockerIsOpen == true) {
            console.log(topic);
            this.lockerIsOpen = false;
            this.callReturnRobot = true;
            clearInterval(this.currentTimeout);
            this.controller.retrieveFromQueue();
          }
        }
      })
    }
    
}

module.exports = Avocabot;