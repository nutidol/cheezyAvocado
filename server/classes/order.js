require('../global');

class Order {

    constructor(orderID, departmentName, roomNumber) {
        this.orderID = orderID;
        this.departmentName = departmentName;
        this.roomNumber = roomNumber;
        this.status = orderStatus.PENDING;
    }

    updateStatus(status) {
        console.log(status);
        this.status = status;
        let message = {
            'orderID': this.orderID,
            'status': status
        }
        client.publish('orderStatus',JSON.stringify(message));
    }
}

module.exports = Order