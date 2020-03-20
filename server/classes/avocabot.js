const Graph = require('./graph/graph')
require('./../global')

class Avocabot {
    constructor(currentPosition, currentDirection) {
      this.currentPosition = currentPosition;
      this.currentDirection = currentDirection;
      this.hotelMap = global.hotelMap;
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
      return [];
    }
}

module.exports = Avocabot