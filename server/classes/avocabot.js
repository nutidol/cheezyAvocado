const Graph = require('./graph/graph');
require('./../global');

class Avocabot {
    constructor(currentPosition, currentDirection) {
      this.currentPosition = currentPosition;
      this.currentDirection = currentDirection;
      this.currentOrder;
      this.currentInstructions;
    }
    processOrder(order) {
      let department = order.department;
      let roomNumber = order.roomNumber;
      
    }
    turnLeft() {
    
    }
    turnRight() {

    }
    forward(distance) {

    }
    backward(distance) {

    }
    reverseDirection() {

    }
    goTo(destination) {
      this.currentInstructions = this.calculateRoute(destination);

    }
    calculateRoute(destination) {
      let route = [];
      let currentNode = global.node[this.currentPosition];
      let destinationNode = global.node[destination];
      console.log(currentNode);
      if(currentNode == undefined) {
        throw console.error('The destination is invalid.');
      }
      
    }
  
    
}



module.exports = Avocabot;