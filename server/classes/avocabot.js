class Avocabot {
    constructor(currentPosition, currentDirection) {
      this.currentPosition = currentPosition;
      this.currentDirection = currentDirection;
      this.hotelMap = {

      }
    }
    turnLeft() {
    
    }
    turnRight() {

    }
    walkStraight() {

    }
    changeDirection() {

    }
    goTo(destination) {
      pathList = this.findPath(destination);
      //tell avocabot to walk according to this path. 
    }
    findPath(destination) {
      return [];
    }
}

module.exports = Avocabot