const Graph = require('./graph/graph');
require('./../global');

class Avocabot {
    constructor(currentPosition, currentDirection) {
      this.currentPosition = currentPosition;
      this.currentDirection = currentDirection;
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
      let route = this.calculateRoute(destination);
      //tell avocabot to walk according to this path. 
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