const Destination = require('./destination');

class Queue {

    queue = [];
    avocabot;
    purpose = {
        PICKUP :'pick up',
        DELIVER : 'deliver',
        RETURN : 'return',
        GOHOME : 'go home'
    };
    
    constructor(avocabot) {
        this.avocabot = avocabot;
    }

    addToQueue(order) {
        let department = order.departmentName;
        let roomNumber = order.roomNumber;
        let destination1 = new Destination(department,this.purpose.PICKUP,order);
        let destination2 = new Destination(roomNumber,this.purpose.DELIVER,order);
        let goNow = (this.queue.length == 0) ? true : false;
        this.queue.push(destination1);
        this.queue.push(destination2);
        if(goNow) {
            avocabot.goTo(destination1);
        }
    }

    retrieveFromQueue() {
        this.queue.shift();
        let destination = (this.queue.length == 0 ) ? new Destination('116',this.purpose.GOHOME,null) : this.queue[0];
        avocabot.goTo(destination);
    }

}

module.exports = Queue;