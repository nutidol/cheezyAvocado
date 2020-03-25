class Order {
    constructor(orderID, departmentName, roomNumber) {
        this.orderID = orderID
        this.departmentName = departmentName
        this.roomNumber = roomNumber
    }

    updateStatus() {
        //TODO:
        //update status in database
        //socket.io to both guest and staff
    }
}

module.exports = Order