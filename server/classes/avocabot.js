const Destination = require('./destination');
const Graph = require('./graph/graph');
require('./../global');

class Avocabot {

    currentPosition;
    currentDestination;
    instructions;
    instructionPointer
    currentTimeout;
    controller;
    hotelMap;

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
      //TODO: Update currentPosition
      if(this.instructionPointer >= this.instructions.length) { //Avocabot has arrived.
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
        let currentInstruction = this.instructions[this.instructionPointer].instruction;
        mapping[currentInstruction[0]](currentInstruction.substring(1));
      }
    }

    calculateRoute(destination) {
      let currentNode = this.currentPosition;
      let destinationNode = node[destination];
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

    openLocker() {
      clearInterval(this.currentTimeout);
      this.currentTimeout = setTimeout(()=>{
        this.controller.retrieveFromQueue();
      },10000);
    }

    closeLocker() {
      retrieveFromQueue();
    }
    
}

module.exports = Avocabot;