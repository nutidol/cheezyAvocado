const Graph = require('./graph/graph');
require('./../global');

class Avocabot {
    constructor(currentPosition, currentDirection) {
      this.currentPosition = currentPosition;
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
    
    turnLeft() {
    
    }
    turnRight() {

    }
    forward(distance) {

    }
    backward(distance) {

    }
    
    
  
    
}



module.exports = Avocabot;