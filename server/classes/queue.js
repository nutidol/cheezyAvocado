class Queue {

    purpose = {
        PICKUP = 'pick-up',
        DELIVER = 'deliver',
        RETURN = 'return',
    }
    
    constructor(avocabot) {
        this.queue = [];
    }

    addToQueue(order) {
        let department = order.departmentName;
        let roomNumber = order.roomNumber;
        let element1 = {
            'destination' : department,
            'purpose' : this.purpose.PICKUP
        }
        let element2 = {
            'destination' : roomNumber,
            'purpose' : this.purpose.DELIVER
        }
        if(this.queue.length != 0) {
            this.queue.push(element1);
            this.queue.push(element2);
        } else {
            this.queue.push(element2);
            avocabot.goTo(department);
        }

    }
}